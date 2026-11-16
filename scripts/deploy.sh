#!/usr/bin/env bash
# KalaDori Textile — VPS deploy (Ubuntu + PM2 + host Nginx + Certbot).
# Safe to re-run: first run installs, later runs pull + rebuild + zero-downtime reload.
# Touches ONLY: $APP_DIR, the PM2 app "$APP_NAME", and the Nginx site for $DOMAIN.
set -euo pipefail

DOMAIN="${DOMAIN:-kaladori.empireevent.org}"
APP_NAME="${APP_NAME:-kaladori}"
APP_DIR="${APP_DIR:-$HOME/kaladori.flexypdf.com}"
PORT="${PORT:-3150}"
REPO="${REPO:-https://github.com/Kishan3864/kaladori.git}"
EMAIL="${EMAIL:-}"   # optional, for Let's Encrypt notices
SKIP_NGINX="${SKIP_NGINX:-0}" # 1 = only build + PM2 (run Nginx/SSL steps as root separately)

say() { printf '\n\033[1;35m▸ %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m✗ %s\033[0m\n' "$*"; exit 1; }

# ---------- 1. Pre-flight checks (read-only) ----------
say "Pre-flight checks"
command -v node >/dev/null || die "Node.js not found. Install Node 20.9+ (e.g. via nvm) and re-run."
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
[ "$NODE_MAJOR" -ge 20 ] || die "Node $(node -v) is too old — Next.js 16 needs Node 20.9+."
command -v git >/dev/null || die "git not found."
command -v pm2 >/dev/null || { say "Installing PM2 globally"; npm i -g pm2; }

# Port must be free unless it's our own PM2 app already holding it.
if ss -ltn "sport = :$PORT" | grep -q LISTEN && ! pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  die "Port $PORT is used by another service. Re-run with PORT=<free port> bash scripts/deploy.sh"
fi

# Who owns :80? We only add a vhost if it's the host's Nginx.
HOST_NGINX=0
if command -v nginx >/dev/null && systemctl is-active --quiet nginx; then HOST_NGINX=1; fi
if [ "$HOST_NGINX" = 0 ] && [ "$SKIP_NGINX" != 1 ] && sudo ss -ltnp 'sport = :80' | grep -q LISTEN; then
  echo "Port 80 is held by something other than host Nginx:"
  sudo ss -ltnp 'sport = :80'
  echo "The app will still be started on 127.0.0.1:$PORT; route $DOMAIN to it from that proxy."
fi

# ---------- 2. Code ----------
say "Fetching code into $APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch --quiet origin main
  git -C "$APP_DIR" reset --hard --quiet origin/main
else
  sudo mkdir -p "$APP_DIR"
  sudo chown "$(id -u):$(id -g)" "$APP_DIR"
  git clone --quiet "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"

# ---------- 3. Build ----------
say "Installing dependencies and building"
# .env.production is untracked and PRESERVED across deploys (secrets live here).
ENV_FILE="$APP_DIR/.env.production"
touch "$ENV_FILE" && chmod 600 "$ENV_FILE"
set_env() {  # set_env KEY VALUE  — replace if present, else append
  if grep -q "^$1=" "$ENV_FILE"; then sed -i "s|^$1=.*|$1=$2|" "$ENV_FILE"; else printf '%s=%s\n' "$1" "$2" >> "$ENV_FILE"; fi
}
has_env() { grep -q "^$1=." "$ENV_FILE"; }
rand() { node -e "process.stdout.write(require('crypto').randomBytes($1).toString('base64url'))"; }

set_env NEXT_PUBLIC_SITE_URL "https://$DOMAIN"
has_env DATA_DIR || set_env DATA_DIR "$HOME/kaladori-data"
has_env ADMIN_SECRET || set_env ADMIN_SECRET "$(rand 32)"
NEW_ADMIN_PASSWORD=""
if ! has_env ADMIN_PASSWORD; then NEW_ADMIN_PASSWORD="$(rand 12)"; set_env ADMIN_PASSWORD "$NEW_ADMIN_PASSWORD"; fi
has_env UPI_NAME || set_env UPI_NAME "KalaDori Textile"
mkdir -p "$(grep '^DATA_DIR=' "$ENV_FILE" | cut -d= -f2-)"

npm ci --no-audit --no-fund
npm run build

# ---------- 4. Run with PM2 ----------
say "Starting / reloading PM2 app \"$APP_NAME\" on 127.0.0.1:$PORT"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env
else
  PORT="$PORT" HOSTNAME=127.0.0.1 pm2 start npm --name "$APP_NAME" --cwd "$APP_DIR" -- start -- -p "$PORT" -H 127.0.0.1
fi
pm2 save >/dev/null

for i in $(seq 1 20); do
  curl -fsS -o /dev/null "http://127.0.0.1:$PORT/" && break
  sleep 1
  [ "$i" = 20 ] && die "App did not respond on :$PORT — check: pm2 logs $APP_NAME"
done
echo "App is up on 127.0.0.1:$PORT"
if [ -n "$NEW_ADMIN_PASSWORD" ]; then
  printf '\n\033[1;32m===== ADMIN LOGIN: https://%s/admin =====\nPassword: %s\n(saved in %s as ADMIN_PASSWORD — change it there, then run: pm2 reload %s --update-env)\033[0m\n' \
    "$DOMAIN" "$NEW_ADMIN_PASSWORD" "$ENV_FILE" "$APP_NAME"
fi
has_env UPI_ID || printf '\n\033[1;33mUPI QR is not configured yet. Add a line  UPI_ID=yourname@bank  to %s, then: pm2 reload %s --update-env\033[0m\n' "$ENV_FILE" "$APP_NAME"

# ---------- 5. Nginx vhost (only this domain) ----------
if [ "$HOST_NGINX" = 1 ] && [ "$SKIP_NGINX" != 1 ]; then
  SITE="/etc/nginx/sites-available/$DOMAIN"
  if [ ! -f "$SITE" ]; then
    say "Adding Nginx site for $DOMAIN"
    sudo tee "$SITE" >/dev/null <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    client_max_body_size 10m;

    location /_next/static/ {
        proxy_pass http://127.0.0.1:$PORT;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }
}
NGINX
    sudo ln -sf "$SITE" "/etc/nginx/sites-enabled/$DOMAIN"
    # Validate BEFORE reload; roll back our file if the config is bad so other sites are unaffected.
    if ! sudo nginx -t; then
      sudo rm -f "/etc/nginx/sites-enabled/$DOMAIN" "$SITE"
      die "nginx -t failed — removed the new site, nothing else changed."
    fi
    sudo systemctl reload nginx
  else
    say "Nginx site for $DOMAIN already exists — left as is"
  fi

  # ---------- 6. HTTPS ----------
  if ! sudo test -d "/etc/letsencrypt/live/$DOMAIN"; then
    if command -v certbot >/dev/null; then
      say "Requesting SSL certificate"
      if [ -n "$EMAIL" ]; then
        sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect
      else
        sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect
      fi
    else
      echo "certbot not installed: sudo apt install -y certbot python3-certbot-nginx, then re-run."
    fi
  fi
fi

say "Done → https://$DOMAIN   (logs: pm2 logs $APP_NAME)"
