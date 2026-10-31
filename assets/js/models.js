// Procedural 3D models of every component in the 555 piano (units ≈ millimetres)
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../vendor/RoundedBoxGeometry.js';

export function canvasTex(w, h, draw, opts = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (opts.wrap) { t.wrapS = THREE.RepeatWrapping; }
  return t;
}

const M = {
  pin: () => new THREE.MeshStandardMaterial({ color: 0xdfe3e8, metalness: 1, roughness: 0.22 }),
  lead: () => new THREE.MeshStandardMaterial({ color: 0xcfd3d8, metalness: 1, roughness: 0.3 }),
  black: () => new THREE.MeshPhysicalMaterial({ color: 0x0b0b0d, roughness: 0.62, clearcoat: 0.3, clearcoatRoughness: 0.45, envMapIntensity: 0.55 }),
};

function leadTube(points, r = 0.22) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, 'catmullrom', 0.05);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 48, r, 10), M.lead());
}

/* ---------------- 555 timer (DIP-8) ---------------- */
export function makeChip555({ label = 'NE555P' } = {}) {
  const g = new THREE.Group();
  const L = 9.8, H = 3.3, W = 6.4;
  const body = new THREE.Mesh(new RoundedBoxGeometry(L, H, W, 4, 0.32), M.black());
  g.add(body);
  const top = canvasTex(1024, 668, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    // notch
    c.fillStyle = 'rgba(0,0,0,0.85)';
    c.beginPath(); c.arc(0, h / 2, 70, -Math.PI / 2, Math.PI / 2); c.fill();
    // pin-1 dimple
    c.beginPath(); c.arc(120, h - 120, 34, 0, Math.PI * 2); c.fillStyle = 'rgba(0,0,0,0.7)'; c.fill();
    c.fillStyle = '#b9bcc2';
    c.font = '600 150px Inter, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(label, w / 2 + 40, h / 2 - 60);
    c.font = '500 78px Inter, Arial'; c.fillStyle = '#8d9097';
    c.fillText('TIMER · 2126', w / 2 + 40, h / 2 + 90);
  });
  const topPlane = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.1, W - 0.1),
    new THREE.MeshStandardMaterial({ map: top, transparent: true, roughness: 0.6, metalness: 0 }));
  topPlane.rotation.x = -Math.PI / 2; topPlane.position.y = H / 2 + 0.005;
  g.add(topPlane);
  // legs
  const legs = {};
  const xs = [-3.81, -1.27, 1.27, 3.81];
  const legGeoShoulder = new THREE.BoxGeometry(1.4, 0.26, 1.1);
  const legGeoUpper = new THREE.BoxGeometry(1.4, 1.0, 0.26);
  const legGeoLower = new THREE.BoxGeometry(0.48, 3.0, 0.26);
  function leg(x, side) {
    const lg = new THREE.Group();
    const mat = M.pin();
    const s = new THREE.Mesh(legGeoShoulder, mat); s.position.set(0, 0, side * 0.5); lg.add(s);
    const u = new THREE.Mesh(legGeoUpper, mat); u.position.set(0, -0.6, side * 1.0); lg.add(u);
    const lo = new THREE.Mesh(legGeoLower, mat); lo.position.set(0, -2.7, side * 1.0); lg.add(lo);
    lg.position.set(x, -0.35, side * (W / 2));
    lg.userData.mat = mat;
    g.add(lg);
    return lg;
  }
  // pins 1..4 along +z (left→right), 5..8 along -z (right→left); notch at -x
  xs.forEach((x, i) => { legs[i + 1] = leg(x, 1); });
  xs.slice().reverse().forEach((x, i) => { legs[i + 5] = leg(x, -1); });
  g.userData.legs = legs;
  return g;
}

/* ---------------- Resistor (5-band metal film) ---------------- */
const BAND = { black: '#111', brown: '#7a3d17', red: '#d0262c', orange: '#ef7a1a', yellow: '#f4c430', green: '#2f9a45', blue: '#2a5fd6', violet: '#8a3fd4', grey: '#8a8a8a', white: '#f2f2f2', gold: '#cfa63c' };
export function makeResistor(bands = ['brown', 'black', 'black', 'brown', 'brown'], bodyColor = '#4f8fd8') {
  const g = new THREE.Group();
  const tex = canvasTex(1024, 256, (c, w, h) => {
    c.fillStyle = bodyColor; c.fillRect(0, 0, w, h);
    const grad = c.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'rgba(255,255,255,0.05)'); grad.addColorStop(1, 'rgba(0,0,0,0.05)');
    c.fillStyle = grad; c.fillRect(0, 0, w, h);
    const pos = [0.16, 0.30, 0.44, 0.58, 0.84];
    bands.forEach((b, i) => { c.fillStyle = BAND[b]; c.fillRect(pos[i] * w - 26, 0, 52, h); });
  });
  // rotate texture so bands run around the cylinder
  tex.center.set(0.5, 0.5); tex.rotation = Math.PI / 2;
  const mat = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.3 });
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 4.2, 48, 1, true), mat);
  cyl.rotation.z = Math.PI / 2; g.add(cyl);
  const capMat = new THREE.MeshPhysicalMaterial({ color: bodyColor, roughness: 0.35, clearcoat: 0.6 });
  [-1, 1].forEach(s => {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1.18, 40, 24), capMat);
    cap.scale.set(0.95, 1, 1); cap.position.x = s * 2.35; g.add(cap);
    if (s === 1) {
      // tolerance band on the bulge
      const band = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.45, 40, 1, true), new THREE.MeshStandardMaterial({ color: BAND[bands[4]], roughness: .4 }));
      band.rotation.z = Math.PI / 2; band.position.x = 2.35; g.add(band);
    }
    g.add(leadTube([[s * 3.0, 0, 0], [s * 5.5, 0, 0], [s * 6.6, -0.4, 0], [s * 6.8, -1.6, 0], [s * 6.8, -6.5, 0]]));
  });
  return g;
}

/* ---------------- Ceramic disc capacitor ---------------- */
export function makeCeramic(code = '104', color = '#d9772f') {
  const g = new THREE.Group();
  const face = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = color; c.fillRect(0, 0, w, h);
    const r = c.createRadialGradient(w * .4, h * .35, 10, w / 2, h / 2, w * .6);
    r.addColorStop(0, 'rgba(255,255,255,.18)'); r.addColorStop(1, 'rgba(0,0,0,.12)');
    c.fillStyle = r; c.fillRect(0, 0, w, h);
    c.fillStyle = '#2a1608'; c.font = '700 120px Inter, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(code, w * 0.75, h * 0.5);
  });
  const disc = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), new THREE.MeshPhysicalMaterial({ map: face, roughness: 0.55, clearcoat: 0.4 }));
  disc.scale.set(2.7, 2.7, 0.95); disc.rotation.y = -Math.PI / 2; g.add(disc);
  disc.position.y = 1.2;
  g.add(leadTube([[-1.0, -1.0, 0], [-1.2, -2.5, 0], [-1.27, -8.5, 0]], 0.2));
  g.add(leadTube([[1.0, -1.0, 0], [1.2, -2.5, 0], [1.27, -8.5, 0]], 0.2));
  return g;
}

/* ---------------- Electrolytic capacitor ---------------- */
export function makeElectrolytic() {
  const g = new THREE.Group();
  const sleeve = canvasTex(1024, 512, (c, w, h) => {
    c.fillStyle = '#141820'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#9aa3b2'; c.fillRect(w * 0.70, 0, w * 0.14, h);
    c.fillStyle = '#141820'; c.font = '800 90px Inter, Arial'; c.textAlign = 'center';
    for (let y = 80; y < h; y += 120) c.fillText('–', w * 0.77, y + 30);
    c.fillStyle = '#d7dbe2'; c.font = '700 74px Inter, Arial';
    c.save(); c.translate(w * 0.3, h / 2); c.rotate(-Math.PI / 2); c.fillText('10µF 25V', 0, 26); c.restore();
  }, { wrap: true });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 5.2, 64, 1, true),
    new THREE.MeshPhysicalMaterial({ map: sleeve, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2 }));
  g.add(body);
  const topTex = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = '#c7ccd3'; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#80868f'; c.lineWidth = 16;
    c.beginPath(); c.moveTo(w / 2, 90); c.lineTo(w / 2, h - 90); c.moveTo(90, h / 2); c.lineTo(w - 90, h / 2); c.stroke();
  });
  const top = new THREE.Mesh(new THREE.CircleGeometry(2.45, 48), new THREE.MeshStandardMaterial({ map: topTex, metalness: .9, roughness: .3 }));
  top.rotation.x = -Math.PI / 2; top.position.y = 2.61; g.add(top);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(2.42, 0.12, 12, 64), M.black()); rim.rotation.x = Math.PI / 2; rim.position.y = 2.58; g.add(rim);
  const bot = new THREE.Mesh(new THREE.CircleGeometry(2.45, 48), M.black()); bot.rotation.x = Math.PI / 2; bot.position.y = -2.6; g.add(bot);
  g.add(leadTube([[-1.0, -2.6, 0], [-1.0, -10.5, 0]], 0.22));
  g.add(leadTube([[1.0, -2.6, 0], [1.0, -8.5, 0]], 0.22));
  return g;
}

/* ---------------- Tactile push button (12×12) ---------------- */
export function makeButton() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new RoundedBoxGeometry(12, 3.6, 12, 3, 0.5), M.black()); g.add(base);
  const plate = new THREE.Mesh(new RoundedBoxGeometry(12.2, 0.35, 12.2, 2, 0.1), new THREE.MeshStandardMaterial({ color: 0xb8bdc4, metalness: 1, roughness: 0.35 }));
  plate.position.y = 1.9; g.add(plate);
  [[-4.6, -4.6], [4.6, -4.6], [-4.6, 4.6], [4.6, 4.6]].forEach(([x, z]) => {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.5, 20), M.black()); d.position.set(x, 2.15, z); g.add(d);
  });
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, 0.6, 48), M.black()); ring.position.y = 2.3; g.add(ring);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.6, 3.0, 48), new THREE.MeshPhysicalMaterial({ color: 0x1d1d21, roughness: 0.6, clearcoat: .2 }));
  cap.position.y = 3.6; g.add(cap); g.userData.cap = cap;
  [[-6.2, -2.5], [6.2, -2.5], [-6.2, 2.5], [6.2, 2.5]].forEach(([x, z]) => {
    const s = Math.sign(x);
    g.add(leadTube([[s * 5.8, -1.2, z], [s * 6.6, -1.4, z], [s * 6.6, -5.5, z]], 0.3));
  });
  return g;
}

/* ---------------- 8 Ω speaker (oval, front facing +y) ---------------- */
export function makeSpeaker() {
  const g = new THREE.Group();
  const coneGroup = new THREE.Group();
  const prof = [];
  for (let i = 0; i <= 24; i++) { const t = i / 24; const r = 3.6 + t * 9.0; prof.push(new THREE.Vector2(r, -3.2 + Math.pow(t, 1.4) * 4.2)); }
  const cone = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.95, side: THREE.DoubleSide }));
  coneGroup.add(cone);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(3.8, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x5b3418, roughness: 0.55, metalness: 0.2 }));
  cap.scale.y = 0.45; cap.position.y = -3.0; coneGroup.add(cap);
  g.add(coneGroup);
  const surround = new THREE.Mesh(new THREE.TorusGeometry(13.3, 0.9, 16, 120), new THREE.MeshStandardMaterial({ color: 0x0f0f10, roughness: 0.8 }));
  surround.rotation.x = Math.PI / 2; surround.position.y = 1.0; g.add(surround);
  // cardboard gasket frame
  const frameShape = new THREE.Shape(); frameShape.absarc(0, 0, 17.5, 0, Math.PI * 2);
  const hole = new THREE.Path(); hole.absarc(0, 0, 14.0, 0, Math.PI * 2); frameShape.holes.push(hole);
  const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(frameShape, { depth: 1.2, bevelEnabled: true, bevelThickness: .3, bevelSize: .3, bevelSegments: 2, curveSegments: 96 }),
    new THREE.MeshStandardMaterial({ color: 0x9a6a3f, roughness: 0.92, envMapIntensity: 0.5 }));
  frame.rotation.x = -Math.PI / 2; frame.position.y = 1.0; g.add(frame);
  const basket = new THREE.Mesh(new THREE.CylinderGeometry(14, 6, 6, 64, 1, true), new THREE.MeshStandardMaterial({ color: 0x2b2b2e, metalness: .8, roughness: .4, side: THREE.DoubleSide }));
  basket.position.y = -2.5; g.add(basket);
  const magnet = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 4, 48), new THREE.MeshStandardMaterial({ color: 0x3a3a3e, metalness: .9, roughness: .3 }));
  magnet.position.y = -7.2; g.add(magnet);
  g.scale.set(1.35, 1, 1); // oval
  g.userData.cone = coneGroup;
  return g;
}

/* ---------------- 9 V battery (6F22) ---------------- */
export function makeBattery() {
  const g = new THREE.Group();
  const label = canvasTex(1024, 1800, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, w, 0);
    gr.addColorStop(0, '#9aa1aa'); gr.addColorStop(.5, '#e7eaee'); gr.addColorStop(1, '#9aa1aa');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.fillStyle = '#2f8d47'; c.fillRect(0, h * 0.62, w, h * 0.38);
    c.fillStyle = '#1c1c1e'; c.font = '800 300px Inter, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('9V', w / 2, h * 0.32);
    c.font = '600 120px Inter, Arial'; c.fillText('6F22', w / 2, h * 0.47);
    c.fillStyle = '#fff'; c.font = '700 110px Inter, Arial'; c.fillText('POWER', w / 2, h * 0.78);
  });
  const mat = new THREE.MeshPhysicalMaterial({ map: label, roughness: .35, metalness: .2, clearcoat: .5 });
  const side = new THREE.MeshStandardMaterial({ color: 0xb4bac2, metalness: .75, roughness: .32 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(26.5, 44, 17.5, 4, 1.6), side);
  g.add(body);
  [1, -1].forEach(sd => { const pl = new THREE.Mesh(new THREE.PlaneGeometry(24, 41.5), mat); pl.position.z = sd * 8.77; if (sd < 0) pl.rotation.y = Math.PI; g.add(pl); });
  const capTop = new THREE.Mesh(new RoundedBoxGeometry(26.5, 3, 17.5, 3, 1.2), new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: .6 }));
  capTop.position.y = 23.2; g.add(capTop);
  const metal = new THREE.MeshStandardMaterial({ color: 0xe2e5ea, metalness: 1, roughness: .2 });
  const hex = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 2.6, 6), metal); hex.position.set(-6.4, 25.8, 0); g.add(hex);
  const rnd = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.9, 3.2, 32), metal); rnd.position.set(6.4, 26.1, 0); g.add(rnd);
  return g;
}

/* normalise a model to fit in a sphere of radius r, centred */
export function fitModel(obj, r = 1) {
  const box = new THREE.Box3().setFromObject(obj);
  const s = new THREE.Sphere(); box.getBoundingSphere(s);
  const k = r / s.radius;
  const wrap = new THREE.Group();
  obj.position.sub(s.center);
  wrap.add(obj); wrap.scale.setScalar(k);
  return wrap;
}

export function studio(renderer, scene) {
  return import('../vendor/RoomEnvironment.js').then(({ RoomEnvironment }) => {
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  });
}

export function glowSprite(color = '#2997ff', size = 256) {
  const t = canvasTex(size, size, (c, w, h) => {
    const r = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    r.addColorStop(0, color); r.addColorStop(0.25, color + 'aa'); r.addColorStop(1, color + '00');
    c.fillStyle = r; c.fillRect(0, 0, w, h);
  });
  return new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
}
