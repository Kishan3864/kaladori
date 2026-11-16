import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { removeMessage, toggleMessageRead } from "@/app/admin/actions";
import { AdminHeader } from "@/components/admin/admin-header";
import { customerWhatsapp, formatDateTime, telHref } from "@/components/admin/format";
import { gate } from "@/components/admin/gate";
import { SubmitButton } from "@/components/admin/submit-button";
import { listMessages, type ContactMessage } from "@/lib/server/contacts";
import { listOrders } from "@/lib/server/orders";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function AdminMessagesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="shell py-8 md:py-12">
      <AdminHeader active="messages" />
      <Suspense
        fallback={
          <div className="mt-8 space-y-3" aria-busy="true" aria-label="Loading messages">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 animate-pulse bg-sand/40" />
            ))}
          </div>
        }
      >
        <Messages searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Messages({ searchParams }: { searchParams: SearchParams }) {
  await gate();
  const [all, orders, sp] = await Promise.all([listMessages(), listOrders(), searchParams]);
  const unreadOnly = sp.show === "unread";

  const messages = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unread = messages.filter((m) => !m.read).length;
  const visible = unreadOnly ? messages.filter((m) => !m.read) : messages;
  const orderIdByNumber = new Map(orders.map((o) => [o.number.toUpperCase(), o.id]));

  return (
    <section aria-labelledby="messages-heading" className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="messages-heading" className="font-display text-2xl">
          Messages{" "}
          <span className="text-base text-stone">
            ({messages.length}
            {unread ? `, ${unread} unread` : ""})
          </span>
        </h2>
        <nav aria-label="Filter messages" className="flex gap-2">
          <Chip href="/admin/messages" active={!unreadOnly} label="All" n={messages.length} />
          <Chip href="/admin/messages?show=unread" active={unreadOnly} label="Unread" n={unread} />
        </nav>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 border border-dashed border-line px-6 py-12 text-center text-stone">
          {messages.length === 0 ? "No messages yet." : "You’re all caught up — no unread messages."}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((m) => (
            <MessageItem
              key={m.id}
              m={m}
              orderId={m.orderNumber ? orderIdByNumber.get(m.orderNumber.toUpperCase()) : undefined}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function MessageItem({ m, orderId }: { m: ContactMessage; orderId?: string }) {
  const subject = `Re: ${m.topic} — ${site.name}`;
  const quoted = m.message
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  const mailto = `mailto:${m.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Hello ${m.name.split(" ")[0]},\n\n\n\n— ${site.name}\n\nOn ${formatDateTime(m.createdAt)} you wrote:\n${quoted}`,
  )}`;
  const whatsappText = `Hello ${m.name.split(" ")[0]}, this is ${site.name} replying to your message about “${m.topic}”.`;

  return (
    <li className={cn("border", m.read ? "border-line bg-ivory" : "border-maroon/40 bg-blush/10")}>
      <details className="group">
        <summary className="flex cursor-pointer list-none gap-3 p-4 md:p-5 [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden
            className={cn("mt-1.5 size-2 shrink-0 rounded-full", m.read ? "bg-transparent" : "bg-maroon")}
          />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className={cn("truncate", !m.read && "font-medium")}>
                {m.name}
                {!m.read ? <span className="sr-only"> (unread)</span> : null}
              </span>
              <span className="shrink-0 text-xs text-stone">{formatDateTime(m.createdAt)}</span>
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone">
              <span className="eyebrow text-maroon">{m.topic}</span>
              {m.orderNumber ? <span>· Order {m.orderNumber}</span> : null}
            </span>
            <span className="mt-2 line-clamp-2 block text-sm text-ink/80 group-open:hidden">{m.message}</span>
          </span>
          <span aria-hidden className="mt-0.5 shrink-0 text-stone transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>

        <div className="border-t border-line px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pl-10">
          <p className="whitespace-pre-line text-[15px] leading-relaxed">{m.message}</p>

          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
            <dt className="text-stone">Email</dt>
            <dd className="break-all">
              <a href={`mailto:${m.email}`} className="link-draw">
                {m.email}
              </a>
            </dd>
            {m.phone ? (
              <>
                <dt className="text-stone">Phone</dt>
                <dd>
                  <a href={telHref(m.phone)} className="link-draw">
                    {m.phone}
                  </a>
                </dd>
              </>
            ) : null}
            {m.orderNumber ? (
              <>
                <dt className="text-stone">Order</dt>
                <dd>
                  {orderId ? (
                    <Link href={`/admin/orders/${orderId}`} className="link-draw text-maroon">
                      {m.orderNumber} →
                    </Link>
                  ) : (
                    <>
                      {m.orderNumber} <span className="text-stone">(no matching order)</span>
                    </>
                  )}
                </dd>
              </>
            ) : null}
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <a href={mailto} className="btn btn-ink min-h-10 px-4">
              Reply by email
            </a>
            {m.phone ? (
              <a
                href={customerWhatsapp(m.phone, whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline min-h-10 px-4"
              >
                WhatsApp
              </a>
            ) : null}
            <form action={toggleMessageRead}>
              <input type="hidden" name="id" value={m.id} />
              <input type="hidden" name="read" value={m.read ? "false" : "true"} />
              <SubmitButton pendingLabel="Saving…" className="btn btn-outline min-h-10 px-4">
                {m.read ? "Mark unread" : "Mark read"}
              </SubmitButton>
            </form>
            <form action={removeMessage} className="ml-auto">
              <input type="hidden" name="id" value={m.id} />
              <SubmitButton
                pendingLabel="Deleting…"
                confirm={`Delete this message from ${m.name}? This can’t be undone.`}
                className="eyebrow px-2 py-3 text-stone transition-colors hover:text-maroon"
              >
                Delete
              </SubmitButton>
            </form>
          </div>
        </div>
      </details>
    </li>
  );
}

function Chip({ href, active, label, n }: { href: string; active: boolean; label: string; n: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-center gap-2 border px-3 py-2 text-xs transition-colors",
        active ? "border-ink bg-ink text-ivory" : "border-line text-ink hover:border-ink",
      )}
    >
      {label}
      <span className={cn("tabular-nums", active ? "text-ivory/70" : "text-stone")}>{n}</span>
    </Link>
  );
}
