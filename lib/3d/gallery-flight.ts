/**
 * Hero 03 "Gallery Flight": a camera flying forward through a dark room of
 * floating photographs. Product photos hang at different depths around the
 * path; each collection has a large photograph on the path itself, sized to
 * fill the screen when the camera stops in front of it. Scroll sets where the
 * camera should be; it eases there with inertia, so motion is one continuous
 * glide with no cuts. While moving, every photo ripples a little like silk.
 *
 * Plain Three.js, loaded lazily by <HeroGalleryFlight>. Guardrails: WebGL2
 * check (null = keep the HTML fallback), DPR clamp, loop paused off-screen
 * and in hidden tabs, still frames under reduced motion, full disposal.
 * Nothing here writes to the console: load failures simply leave a photo out.
 */
import * as THREE from "three";

export type FlightPhoto = { url: string; aspect: number };

export type FlightOptions = {
  products: FlightPhoto[];
  /** One per collection, in stage order. */
  landmarks: FlightPhoto[];
  background: string;
  onFirstFrame?: () => void;
};

export type FlightHandle = {
  /** 0 (hero) .. 3 (pants), fractional between stops. */
  setStage(stage: number): void;
  dispose(): void;
};

/** Where each collection photo stands, and how far in front of it the camera stops. */
const LANDMARK_Z = [-8, -21, -34];
const STOP_DISTANCE = 4;
const CAMERA_STOPS = [7, ...LANDMARK_Z.map((z) => z + STOP_DISTANCE)];
const FOV = 45;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uVel;
  uniform float uPhase;
  uniform float uCurve;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec3 p = position;
    // A gentle concave curve, like a length of silk held up.
    p.z -= uCurve * (p.x * p.x);
    // Silk ripple while moving: a bow across the photo and a travelling wave.
    float v = uVel;
    p.z += v * 0.22 * sin(uv.x * 3.14159);
    p.z += v * 0.06 * sin(uv.y * 9.0 + uTime * 3.0 + uPhase);
    p.y += v * 0.04 * sin(uv.x * 6.0 + uTime * 2.0 + uPhase);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uAlpha;
  uniform float uDim;
  uniform float uVel;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec2 uSize;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    // A whisper of colour separation while moving fast; none at rest.
    float shift = 0.004 * abs(uVel);
    vec3 col = vec3(
      texture2D(uMap, vUv + vec2(0.0, shift)).r,
      texture2D(uMap, vUv).g,
      texture2D(uMap, vUv - vec2(0.0, shift)).b
    );
    col *= uDim;
    // Soft rounded corners (in world units, so every size reads the same).
    vec2 q = abs(vUv - 0.5) * uSize;
    vec2 d = q - (uSize * 0.5 - 0.06);
    float corner = length(max(d, 0.0)) - 0.06;
    float edge = 1.0 - smoothstep(-0.01, 0.0, corner);
    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    col = mix(col, uFog, fog);
    gl_FragColor = vec4(col, uAlpha * edge);
    #include <colorspace_fragment>
  }
`;

function supportsWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Panel = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  uniforms: Record<string, THREE.IUniform>;
  aspect: number;
  loaded: boolean;
  reveal: number;
  base: THREE.Vector3;
  kind: "product" | "landmark";
  index: number;
};

export function mountGalleryFlight(container: HTMLElement, opts: FlightOptions): FlightHandle | null {
  if (!supportsWebGL2()) return null;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const small = window.innerWidth < 768;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  const bg = new THREE.Color(opts.background);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
  renderer.setClearColor(bg, 1);

  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1.2s ease;touch-action:pan-y";
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);
  camera.position.set(0, 0, CAMERA_STOPS[0]);

  const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  const placeholder = new THREE.DataTexture(new Uint8Array([18, 12, 14, 255]), 1, 1);
  placeholder.needsUpdate = true;

  const panels: Panel[] = [];

  function makePanel(kind: Panel["kind"], index: number, aspect: number, base: THREE.Vector3) {
    const uniforms: Record<string, THREE.IUniform> = {
      uMap: { value: placeholder },
      uAlpha: { value: 0 },
      uDim: { value: kind === "landmark" ? 0.92 : 0.86 },
      uVel: { value: 0 },
      uTime: { value: 0 },
      uPhase: { value: index * 1.7 },
      uCurve: { value: kind === "landmark" ? 0.015 : 0.05 },
      uFog: { value: bg },
      uFogNear: { value: kind === "landmark" ? 7 : 5 },
      uFogFar: { value: kind === "landmark" ? 30 : 22 },
      uSize: { value: new THREE.Vector2(1, 1) },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(base);
    mesh.renderOrder = kind === "landmark" ? 0 : 1;
    scene.add(mesh);
    const panel: Panel = { mesh, uniforms, aspect, loaded: false, reveal: 0, base, kind, index };
    panels.push(panel);
    return panel;
  }

  /* --------------------------------------------------------------- layout */
  const productPanels = opts.products.map((photo, i) => {
    // A loose helix around the flight path, never across its centre.
    const z = 3 - i * 3.3;
    const angle = i * 2.15 + 0.7;
    const radius = 2.5 + (i % 3) * 0.35;
    const base = new THREE.Vector3(Math.cos(angle) * radius * 1.3, Math.sin(angle) * radius * 0.72, z);
    const panel = makePanel("product", i, photo.aspect, base);
    const h = 1.35;
    panel.mesh.scale.set(h * photo.aspect, h, 1);
    panel.uniforms.uSize.value.set(h * photo.aspect, h);
    panel.mesh.rotation.y = -base.x * 0.07;
    panel.mesh.rotation.x = base.y * 0.05;
    return panel;
  });

  const landmarkPanels = opts.landmarks.map((photo, i) =>
    makePanel("landmark", i, photo.aspect, new THREE.Vector3(0, 0, LANDMARK_Z[i] ?? -8 - i * 13)),
  );

  /** Size each collection photo to cover the screen from its camera stop. */
  function fitLandmarks() {
    const h = 2 * STOP_DISTANCE * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const w = h * camera.aspect;
    for (const p of landmarkPanels) {
      const cover = w / h > p.aspect ? [w, w / p.aspect] : [h * p.aspect, h];
      const sx = cover[0] * 1.06;
      const sy = cover[1] * 1.06;
      p.mesh.scale.set(sx, sy, 1);
      p.uniforms.uSize.value.set(sx, sy);
    }
  }

  /* ------------------------------------------------------------- textures */
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const textures: THREE.Texture[] = [];
  let cancelled = false;

  function applyTexture(panel: Panel, texture: THREE.Texture, width: number, height: number) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, maxAniso);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    textures.push(texture);
    panel.uniforms.uMap.value = texture;
    panel.aspect = width / height || panel.aspect;
    if (panel.kind === "product") {
      const h = 1.35;
      panel.mesh.scale.set(h * panel.aspect, h, 1);
      panel.uniforms.uSize.value.set(h * panel.aspect, h);
    } else {
      fitLandmarks();
    }
    panel.loaded = true;
    if (reduced) draw();
  }

  async function load(panel: Panel, url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok || cancelled) return;
      const blob = await response.blob();
      if (cancelled) return;
      if ("createImageBitmap" in window) {
        const bitmap = await createImageBitmap(blob, { imageOrientation: "flipY" });
        if (cancelled) {
          bitmap.close();
          return;
        }
        applyTexture(panel, new THREE.Texture(bitmap), bitmap.width, bitmap.height);
      } else {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        await img.decode();
        if (cancelled) return;
        applyTexture(panel, new THREE.Texture(img), img.naturalWidth, img.naturalHeight);
      }
    } catch {
      // Leave the panel out: a missing photo is not worth an error.
    }
  }

  // Collection photos first (they are the stops), then the products nearest the start.
  landmarkPanels.forEach((p, i) => void load(p, opts.landmarks[i].url));
  productPanels.forEach((p, i) => void load(p, opts.products[i].url));

  /* --------------------------------------------------------------- sizing */
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fitLandmarks();
    draw();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  /* --------------------------------------------------------------- input */
  const pointer = new THREE.Vector2();
  const onPointer = (e: PointerEvent) => {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };
  if (finePointer && !reduced) window.addEventListener("pointermove", onPointer, { passive: true });

  let stageTarget = 0;
  const cameraZAt = (s: number) => {
    const i = Math.min(CAMERA_STOPS.length - 2, Math.max(0, Math.floor(s)));
    const t = Math.min(1, Math.max(0, s - i));
    return THREE.MathUtils.lerp(CAMERA_STOPS[i], CAMERA_STOPS[i + 1], t);
  };

  /* ---------------------------------------------------------------- frame */
  let time = 0;
  let velocity = 0;
  let shown = false;
  const look = new THREE.Vector3();

  function draw(dt = 0) {
    time += dt;
    const targetZ = cameraZAt(stageTarget);
    const prevZ = camera.position.z;
    if (!shown || reduced) camera.position.z = targetZ; // first frame, or no gliding
    else if (dt > 0) camera.position.z = THREE.MathUtils.damp(prevZ, targetZ, 3.2, dt); // glide with inertia

    const rawVel = dt > 0 ? (camera.position.z - prevZ) / dt : 0;
    velocity = reduced ? 0 : THREE.MathUtils.damp(velocity, THREE.MathUtils.clamp(-rawVel / 9, -1, 1), 5, Math.max(dt, 0.001));

    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.35, 2.5, Math.max(dt, 0.001));
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -pointer.y * 0.2, 2.5, Math.max(dt, 0.001));
    look.set(camera.position.x * 0.4, camera.position.y * 0.4, camera.position.z - 10);
    camera.lookAt(look);

    const camZ = camera.position.z;
    for (const p of panels) {
      if (p.loaded) p.reveal = reduced ? 1 : Math.min(1, p.reveal + dt * 1.4);
      p.uniforms.uTime.value = time;
      p.uniforms.uVel.value = velocity;
      let alpha = smooth(0, 1, p.reveal);
      if (p.kind === "landmark") {
        // Dissolve as the camera flies through it, and rest a little larger.
        const dist = camZ - p.base.z;
        alpha *= smooth(0.6, 2.4, dist);
        p.mesh.position.z = p.base.z + (reduced ? 0 : Math.sin(time * 0.25 + p.index) * 0.04);
      } else {
        const dist = camZ - p.base.z;
        alpha *= smooth(-0.5, 1.2, dist); // fade out just before passing the camera
        if (!reduced) {
          p.mesh.position.y = p.base.y + Math.sin(time * 0.5 + p.index) * 0.07;
          p.mesh.position.x = p.base.x + Math.cos(time * 0.35 + p.index * 0.7) * 0.05;
        }
      }
      p.uniforms.uAlpha.value = alpha;
      p.mesh.visible = alpha > 0.002;
    }

    renderer.render(scene, camera);
    if (!shown) {
      shown = true;
      canvas.style.opacity = "1";
      opts.onFirstFrame?.();
    }
  }

  const timer = new THREE.Timer();
  const tick = () => {
    timer.update();
    draw(Math.min(timer.getDelta(), 0.05));
  };

  let visible = false;
  const syncLoop = () => {
    const run = visible && !document.hidden && !reduced;
    renderer.setAnimationLoop(run ? tick : null);
    if (run) timer.reset();
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncLoop();
  });
  io.observe(container);
  document.addEventListener("visibilitychange", syncLoop);

  resize();

  return {
    setStage(stage) {
      stageTarget = Math.min(CAMERA_STOPS.length - 1, Math.max(0, stage));
      if (reduced) draw();
    },
    dispose() {
      cancelled = true;
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", syncLoop);
      window.removeEventListener("pointermove", onPointer);
      timer.dispose();
      for (const p of panels) p.mesh.material.dispose();
      for (const t of textures) {
        const img = t.image as ImageBitmap | undefined;
        t.dispose();
        if (typeof ImageBitmap !== "undefined" && img instanceof ImageBitmap) img.close();
      }
      geometry.dispose();
      placeholder.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
