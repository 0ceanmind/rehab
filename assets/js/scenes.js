// Three.js scenes: hero chip, component carousel, 555 pinout, speaker
import * as THREE from 'three';
import { makeChip555, makeResistor, makeCeramic, makeElectrolytic, makeButton, makeSpeaker, makeBattery, fitModel, studio, glowSprite, canvasTex } from './models.js';

class View {
  constructor(el, { fov = 35, alpha = true } = {}) {
    this.el = el;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 2000);
    this.clock = new THREE.Clock();
    this.running = false;
    this.mouse = new THREE.Vector2(0, 0); this.mouseIn = false;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      this.mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      this.mouseIn = true;
    });
    el.addEventListener('pointerleave', () => { this.mouseIn = false; });
    studio(this.renderer, this.scene);
    this.resize();
    new ResizeObserver(() => this.resize()).observe(el);
  }
  resize() {
    const r = this.el.getBoundingClientRect();
    const cw = this.el.clientWidth, ch = this.el.clientHeight;
    if (!cw || !ch) return;
    const scale = r.width / cw; // stage scale
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr * scale);
    this.renderer.setSize(cw, ch, false);
    this.renderer.domElement.style.width = cw + 'px';
    this.renderer.domElement.style.height = ch + 'px';
    this.camera.aspect = cw / ch; this.camera.updateProjectionMatrix();
  }
  start() { if (this.running) return; this.running = true; this.resize(); this.clock.getDelta(); const loop = () => { if (!this.running) return; const dt = Math.min(this.clock.getDelta(), 0.05); this.update(dt, this.clock.elapsedTime); this.renderer.render(this.scene, this.camera); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  stop() { this.running = false; }
  update() {}
}

function lights(scene, key = 1.6) {
  const k = new THREE.DirectionalLight(0xffffff, key); k.position.set(4, 8, 6); scene.add(k);
  const rim = new THREE.DirectionalLight(0x7fb8ff, 1.2); rim.position.set(-6, 3, -6); scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
}

/* ============ HERO: floating 555 with living circuit traces ============ */
export class HeroScene extends View {
  constructor(el) {
    super(el, { fov: 30 });
    const s = this.scene;
    lights(s, 1.8);
    this.camera.position.set(0, 8, 46); this.camera.lookAt(0, -1, 0);
    this.chip = makeChip555();
    this.chip.scale.setScalar(1.25);
    this.pivot = new THREE.Group(); this.pivot.add(this.chip); s.add(this.pivot);
    this.pivot.rotation.set(0.5, -0.6, 0);
    // circuit traces on a plane below the chip
    this.traces = new THREE.Group(); s.add(this.traces);
    this.traces.position.y = -6; this.traces.rotation.x = 0;
    const lineMat = new THREE.LineBasicMaterial({ color: 0x2a3a55, transparent: true, opacity: 0.85 });
    this.paths = [];
    const rnd = mulberry(7);
    for (let i = 0; i < 46; i++) {
      const pts = [];
      const side = i % 4;
      let x = (side < 2 ? -1 : 1) * (3 + rnd() * 4), z = (side % 2 ? -1 : 1) * (1 + rnd() * 4);
      pts.push(new THREE.Vector3(x * 0.6, 0, z * 0.6));
      let dir = side < 2 ? -1 : 1;
      for (let k = 0; k < 4; k++) {
        const len = 4 + rnd() * 10;
        if (k % 2 === 0) x += dir * len; else z += (rnd() > .5 ? 1 : -1) * len * 0.6;
        pts.push(new THREE.Vector3(x, 0, z));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      this.traces.add(new THREE.Line(geo, lineMat));
      const pad = new THREE.Mesh(new THREE.CircleGeometry(0.28, 20), new THREE.MeshBasicMaterial({ color: 0x3d5a85 }));
      pad.rotation.x = -Math.PI / 2; pad.position.copy(pts[pts.length - 1]); this.traces.add(pad);
      const curve = new THREE.CurvePath();
      for (let k = 0; k < pts.length - 1; k++) curve.add(new THREE.LineCurve3(pts[k], pts[k + 1]));
      const colors = ['#2997ff', '#bf5af2', '#64d2ff', '#ffb340'];
      const sp = new THREE.Sprite(glowSprite(colors[i % 4])); sp.scale.setScalar(1.3);
      this.traces.add(sp);
      this.paths.push({ curve, sp, t: rnd(), speed: 0.05 + rnd() * 0.12 });
    }
    const halo = new THREE.Sprite(glowSprite('#2f6bff')); halo.scale.set(40, 22, 1); halo.position.set(0, -5.5, 0); halo.material.opacity = 0.35; s.add(halo);
  }
  update(dt, t) {
    const end = this.mode === 'end';
    this.pivot.position.y += ((Math.sin(t * 0.9) * 0.5 + (end ? -6.5 : 1.2)) - this.pivot.position.y) * 0.08;
    const sc = end ? 0.8 : 1.25; this.chip.scale.setScalar(this.chip.scale.x + (sc - this.chip.scale.x) * 0.08);
    const mx = this.mouseIn ? this.mouse.x : Math.sin(t * .3) * .3, my = this.mouseIn ? this.mouse.y : 0;
    this.pivot.rotation.y += ((-0.6 + t * 0.12 + mx * 0.6) - this.pivot.rotation.y) * 0.04;
    this.pivot.rotation.x += ((0.45 - my * 0.3) - this.pivot.rotation.x) * 0.05;
    this.traces.rotation.y = t * 0.03;
    for (const p of this.paths) { p.t = (p.t + p.speed * dt) % 1; p.sp.position.copy(p.curve.getPointAt(p.t)); p.sp.material.opacity = Math.sin(p.t * Math.PI); }
  }
}

function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ============ COMPONENT CAROUSEL ============ */
export const PARTS = [
  { id: 'battery', make: makeBattery, tilt: [0.15, 0.5, 0] },
  { id: 'ic555', make: makeChip555, tilt: [0.7, 0.5, 0] },
  { id: 'speaker', make: makeSpeaker, tilt: [1.0, 0, 0] },
  { id: 'r1k', make: () => makeResistor(['brown', 'black', 'black', 'brown', 'brown']), tilt: [0.3, 0.4, 0] },
  { id: 'r51k', make: () => makeResistor(['green', 'brown', 'black', 'brown', 'brown']), tilt: [0.3, 0.4, 0] },
  { id: 'c10u', make: makeElectrolytic, tilt: [0.25, 0.5, 0] },
  { id: 'c10n', make: () => makeCeramic('103', '#d9772f'), tilt: [0.1, 0.9, 0] },
  { id: 'c100n', make: () => makeCeramic('104', '#c9622a'), tilt: [0.1, 0.9, 0] },
  { id: 'button', make: makeButton, tilt: [0.75, 0.6, 0] },
];

export class PartsScene extends View {
  constructor(el) {
    super(el, { fov: 30 });
    lights(this.scene, 1.7);
    this.camera.position.set(0, 1.4, 11); this.camera.lookAt(0, 0.1, 0);
    this.items = [];
    PARTS.forEach((p, i) => {
      const m = fitModel(p.make(), 1.0);
      m.rotation.set(...p.tilt);
      const holder = new THREE.Group(); holder.add(m);
      holder.userData = { i, model: m, base: p.tilt.slice() };
      const ped = new THREE.Mesh(new THREE.RingGeometry(1.05, 1.12, 96), new THREE.MeshBasicMaterial({ color: 0x2997ff, transparent: true, opacity: 0, side: THREE.DoubleSide }));
      ped.rotation.x = -Math.PI / 2; ped.position.y = -1.2; holder.add(ped); holder.userData.ped = ped;
      const glow = new THREE.Sprite(glowSprite('#2f6bff')); glow.scale.set(5, 1.4, 1); glow.position.y = -1.25; glow.material.opacity = 0; holder.add(glow); holder.userData.glow = glow;
      this.scene.add(holder); this.items.push(holder);
    });
    this.sel = 0; this.selF = 0;
    this.ray = new THREE.Raycaster();
    el.addEventListener('click', () => { if (this.hoverI != null) this.select(this.hoverI, true); });
  }
  select(i, user) { this.sel = i; if (user) this.userT = performance.now(); this.onSelect && this.onSelect(i); }
  update(dt, t) {
    this.selF += (this.sel - this.selF) * Math.min(1, dt * 4.5);
    this.items.forEach((h, i) => {
      const d = i - this.selF, a = Math.abs(d), sg = Math.sign(d), near = Math.min(a, 1);
      h.position.x = a < 1 ? d * 2.3 : sg * (2.3 + (a - 1) * 1.45);
      h.position.z = -near * 2.4 - Math.max(0, a - 1) * 0.7;
      h.position.y = (a < 0.5 ? Math.sin(t * 1.5) * 0.08 + 0.2 : 0) - near * 0.1;
      h.scale.setScalar(1.75 - near * 1.05);
      h.rotation.y = -sg * near * 0.55;
      const front = a < 0.5;
      h.userData.model.rotation.y = h.userData.base[1] + (front ? t * 0.55 : 0);
      h.userData.ped.material.opacity = Math.max(0, 0.6 - a * 1.2);
      h.userData.glow.material.opacity = Math.max(0, 0.5 - a);
      h.visible = a < 4.6;
    });
    this.hoverI = null;
    if (this.mouseIn) {
      this.ray.setFromCamera(this.mouse, this.camera);
      const hit = this.ray.intersectObjects(this.items, true).find(h => h.object.type === 'Mesh');
      if (hit) { let o = hit.object; while (o && !this.items.includes(o)) o = o.parent; if (o) this.hoverI = o.userData.i; }
    }
    this.el.style.cursor = this.hoverI != null ? 'pointer' : 'default';
  }
}

/* ============ 555 PINOUT ============ */
export class PinoutScene extends View {
  constructor(el) {
    super(el, { fov: 28 });
    lights(this.scene, 1.8);
    this.camera.position.set(0, 36, 17); this.camera.lookAt(0, -1.5, 0.5);
    this.chip = makeChip555();
    this.chip.scale.setScalar(1.0);
    this.scene.add(this.chip);
    const halo = new THREE.Sprite(glowSprite('#2f6bff')); halo.scale.set(36, 26, 1); halo.position.set(0, -6, 0); halo.material.opacity = .25; this.scene.add(halo);
    this.hi = null; this.drag = 0;
    let down = null;
    el.addEventListener('pointerdown', e => { down = e.clientX; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', e => { if (down != null) { this.drag += (e.clientX - down) * 0.008; down = e.clientX; } });
    el.addEventListener('pointerup', () => { down = null; });
  }
  highlight(pin) {
    this.hi = pin;
    Object.entries(this.chip.userData.legs).forEach(([n, lg]) => {
      const m = lg.userData.mat;
      if (+n === pin) { m.emissive = new THREE.Color(0x2997ff); m.emissiveIntensity = 1.4; m.color.set(0x9fd0ff); }
      else { m.emissive = new THREE.Color(0x000000); m.color.set(0xdfe3e8); }
    });
  }
  pinScreen(n) {
    const lg = this.chip.userData.legs[n];
    const v = new THREE.Vector3(0, -1.0, (n <= 4 ? 1 : -1) * 1.0); lg.localToWorld(v); v.project(this.camera);
    return [(v.x + 1) / 2, (1 - v.y) / 2];
  }
  update(dt, t) {
    this.chip.rotation.y = -Math.PI / 2 + Math.sin(t * 0.35) * 0.12 + this.drag;
    this.chip.position.y = Math.sin(t * 0.8) * 0.25;
    if (this.onFrame) this.onFrame();
  }
}

/* ============ SPEAKER (reacts to audio) ============ */
export class SpeakerScene extends View {
  constructor(el, levelFn) {
    super(el, { fov: 30 });
    lights(this.scene, 1.6);
    this.camera.position.set(0, 22, 88); this.camera.lookAt(0, 2, 0);
    this.spk = makeSpeaker();
    this.spk.rotation.x = Math.PI / 2 - 0.62; // face the camera, tilted to show depth
    this.scene.add(this.spk);
    this.level = levelFn;
    this.waves = [];
    const wm = () => new THREE.MeshBasicMaterial({ color: 0x2997ff, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    for (let i = 0; i < 6; i++) { const r = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 128), wm()); r.userData.t = i / 6; this.spk.add(r); r.rotation.x = -Math.PI / 2; r.position.y = 2; this.waves.push(r); }
    this.freq = 0;
  }
  update(dt, t) {
    const L = this.level ? this.level() : 0;
    const cone = this.spk.userData.cone;
    cone.position.y = L * 1.6 * Math.sin(t * 60);
    this.spk.rotation.z = Math.sin(t * 0.4) * 0.12;
    this.waves.forEach(w => {
      w.userData.t = (w.userData.t + dt * (0.35 + L * 0.6)) % 1;
      const s = 14 + w.userData.t * 26; w.scale.set(s, s, 1);
      w.position.y = 2 + w.userData.t * 6;
      w.material.opacity = L * (1 - w.userData.t) * 0.9;
    });
  }
}
