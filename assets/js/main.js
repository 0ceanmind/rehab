import { HeroScene, PartsScene, PinoutScene, SpeakerScene, PARTS } from './scenes.js';
import { TIPS, SPECS, PART_INFO, PINS, SKILLS, REFS } from './data.js';
import { buildOmanMap, buildShinasZoom, buildFlow, buildOrbit, buildSchematic, buildInternal } from './diagrams.js';
import { gradChart, freqChart, astableChart, scope } from './charts.js';
import { KEYS, timing, noteOn, noteOff, level, fmtHz, nearestNote, fmtR } from './audio.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const stage = $('#stage');
const W = 1920, H = 1080;
let scale = 1;
function fit() { scale = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = `translate(-50%,-50%) scale(${scale})`; }
addEventListener('resize', fit); fit();

/* ================= TOOLTIP ================= */
const tip = $('#tip'); let tipEl = null;
function tipHTML(d) {
  return `${d.k ? `<div class="k">${d.k}</div>` : ''}<div class="t">${d.t.replace(/R_A/g, 'R<sub>A</sub>').replace(/R_B/g, 'R<sub>B</sub>')}</div>${d.ar ? `<div class="ar">${d.ar}</div>` : ''}
  ${d.b ? `<div class="b">${d.b.map(x => `<div>${x.replace(/R_A/g, 'R<sub>A</sub>').replace(/R_B/g, 'R<sub>B</sub>')}</div>`).join('')}</div>` : ''}
  ${d.s ? `<div class="s">${d.s.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>` : ''}${d.src ? `<div class="src">${d.src}</div>` : ''}`;
}
function showTip(el) {
  const d = TIPS[el.dataset.tip]; if (!d) return;
  tipEl = el;
  tip.style.setProperty('--tc', d.c || 'var(--blue)');
  tip.innerHTML = tipHTML(d);
  const sr = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
  const L = (r.left - sr.left) / scale, T = (r.top - sr.top) / scale, Rr = (r.right - sr.left) / scale, B = (r.bottom - sr.top) / scale;
  const tw = 600, th = tip.offsetHeight;
  let x = Rr + 28, y = T + (B - T) / 2 - th / 2;
  if (x + tw > W - 30) x = L - 28 - tw;
  if (x < 30) { x = Math.min(W - tw - 30, Math.max(30, (L + Rr) / 2 - tw / 2)); y = B + 24; if (y + th > H - 30) y = T - th - 24; }
  y = Math.max(30, Math.min(H - th - 30, y));
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
  tip.classList.add('on');
}
function hideTip() { tipEl = null; tip.classList.remove('on'); }
stage.addEventListener('pointerover', e => {
  const el = e.target.closest('[data-tip]');
  if (el && el !== tipEl) showTip(el);
  else if (!el && tipEl) hideTip();
});
stage.addEventListener('pointerleave', hideTip);

/* ================= BUILD CONTENT ================= */
// stat counters
function countUp(root) {
  $$('[data-count]', root).forEach(el => {
    const to = +el.dataset.count, t0 = performance.now() + 500, dur = 1800;
    const f = now => { const k = Math.max(0, Math.min(1, (now - t0) / dur)); const e = 1 - Math.pow(2, -10 * k); el.textContent = Math.round(to * (k === 1 ? 1 : e)).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(f); };
    el.textContent = '0'; requestAnimationFrame(f);
  });
}
// specialisation tiles
$('#tiles').innerHTML = SPECS.map((s, i) => { TIPS['spec-' + i] = { k: 'Specialisation', t: s.k, c: s.c, b: s.b }; return `<div class="tile glass hov r" style="--i:${i + 3};--c:${s.c}" data-tip="spec-${i}"><svg viewBox="0 0 24 24">${s.ic}</svg><b>${s.k}</b></div>`; }).join('');
// skills
$('#skills').innerHTML = SKILLS.map((s, i) => { TIPS['skill-' + i] = { k: 'Skill ' + (i + 1), t: s.k, c: s.c, b: s.b }; return `<div class="skill glass hov r" style="--i:${i + 2};--c:${s.c}" data-tip="skill-${i}"><span class="n">0${i + 1}</span><svg viewBox="0 0 24 24">${s.ic}</svg><b>${s.k}</b></div>`; }).join('');
// references
$('#refs').innerHTML = REFS.map(([t, u], i) => `<div><em>${String(i + 1).padStart(2, '0')}</em>${t}<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\/\//, '')}</a></div>`).join('');
// breadboard hotspots
const HS = [
  { x: 30.7, y: 28, tip: 'hs-spk' }, { x: 95.2, y: 69, tip: 'hs-bat' }, { x: 70.6, y: 64, tip: 'hs-555' }, { x: 64.5, y: 55.3, tip: 'hs-c3' },
  { x: 71.1, y: 47, tip: 'hs-cer' }, { x: 41, y: 79, tip: 'hs-res' }, { x: 84, y: 45, tip: 'hs-rail' },
  ...[19.2, 28.2, 37.3, 46.4, 55.4].map((x, i) => ({ x, y: 63, tip: 'hs-key' + i, key: i })),
];
Object.assign(TIPS, {
  'hs-spk': { k: 'Output', t: '8 Ω speaker', c: '#bf5af2', b: ['Oval speaker, wired by the white leads', 'Plays the square-wave tone'] },
  'hs-bat': { k: 'Power', t: '9 V battery (6F22)', c: '#30d158', b: ['Red → + rail, blue → − rail', 'Feeds the whole breadboard'] },
  'hs-555': { k: 'The brain', t: '555 timer IC', c: '#2997ff', b: ['8-pin DIP across the centre gap', 'Generates the oscillation'] },
  'hs-c3': { k: 'Coupling', t: '10 µF electrolytic', c: '#ffb340', b: ['C3 between pin 3 and the speaker', 'Mind the polarity'] },
  'hs-cer': { k: 'Timing & filtering', t: 'Ceramic capacitors', c: '#ffb340', b: ['C1 100 nF — timing', 'C2 10 nF — pin 5 noise filter'] },
  'hs-res': { k: 'Pitch ladder', t: '6 resistors', c: '#64d2ff', b: ['5 × 1 kΩ + 1 × 5.1 kΩ', 'Blue metal-film, 5 colour bands'] },
  'hs-rail': { k: 'Wiring', t: 'Power rails', c: '#ff453a', b: ['+ and − rails along the edges', 'Jumper wires link everything'] },
});
const bp = $('#buildPhoto');
HS.forEach((h, i) => {
  const d = document.createElement('div'); d.className = 'hs' + (h.key != null ? ' key' : ''); d.style.cssText = `left:${h.x}%;top:${h.y}%;--i:${i}`; d.dataset.tip = h.tip;
  if (h.key != null) {
    const k = KEYS[h.key], tm = timing(k.RB);
    TIPS[h.tip] = { k: 'Key ' + (h.key + 1), t: `${k.id} · ${fmtHz(tm.f)}`, c: '#ffb340', b: ['Click to hear this key', `R_B = ${fmtR(k.RB)}`] };
    d.addEventListener('pointerdown', () => noteOn('hs', tm.f, tm.duty)); d.addEventListener('pointerup', () => noteOff('hs')); d.addEventListener('pointerleave', () => noteOff('hs'));
  }
  bp.appendChild(d);
});
// project photo tilt
const pp = $('#projPhoto');
pp.addEventListener('pointermove', e => { const r = pp.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; pp.style.transform = `perspective(1600px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`; });
pp.addEventListener('pointerleave', () => pp.style.transform = '');
// original schematic thumb
['#origThumb', '#partsThumb'].forEach(id => $(id).addEventListener('click', e => { e.currentTarget.classList.toggle('big'); }));

/* ================= SLIDE HOOKS ================= */
const hooks = {};
const lazy = (fn) => { let v; return () => v || (v = fn()); };

// HERO + END share one WebGL scene
const hero = lazy(() => new HeroScene($('#hero3d')));
hooks['s-hero'] = { enter() { const h = hero(); h.mode = 'hero'; $('#hero3d').appendChild(h.renderer.domElement); h.el = $('#hero3d'); h.resize(); h.start(); }, leave() { hero().stop(); } };
hooks['s-end'] = { enter() { const h = hero(); h.mode = 'end'; $('#end3d').appendChild(h.renderer.domElement); h.el = $('#end3d'); h.resize(); h.start(); }, leave() { hero().stop(); } };
hooks['s-overview'] = { enter() { countUp($('#s-overview')); } };

const omap = buildOmanMap($('#omanMap'), $('#clist'));
hooks['s-map'] = omap;
buildFlow($('#flow'));
const zoom = buildShinasZoom($('#shinasMap'));
hooks['s-shinas'] = zoom;
const orbit = buildOrbit($('#orbit'));
const grads = gradChart($('#gradChart'));
hooks['s-programs'] = { enter() { orbit.enter(); grads.enter(); }, leave() { orbit.leave(); grads.leave(); } };

// PARTS carousel
const partInfo = $('#partInfo'), partBar = $('#partBar');
partBar.innerHTML = PARTS.map((p, i) => `<button data-i="${i}">${PART_INFO[p.id].n === 'Resistor' || PART_INFO[p.id].n.includes('cap') ? PART_INFO[p.id].v.split(' ·')[0] : PART_INFO[p.id].n}</button>`).join('');
PARTS.forEach(p => { const d = PART_INFO[p.id]; TIPS['part-' + p.id] = { k: `${d.n} · ×${d.q}`, t: d.v, c: d.c, b: d.tip }; });
function showPart(i) {
  const p = PARTS[i], d = PART_INFO[p.id];
  partInfo.innerHTML = `<div class="swap" data-tip="part-${p.id}"><div class="pname">${d.n}</div><div class="pval" style="color:${d.c}">${d.v}</div><div class="prole">${d.role}</div><div class="qty">× ${d.q}</div></div>`;
  $$('button', partBar).forEach((b, j) => b.classList.toggle('on', j === i));
}
const parts = lazy(() => { const s = new PartsScene($('#parts3d')); s.onSelect = showPart; return s; });
let partTimer;
partBar.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { parts().select(+b.dataset.i, true); } });
hooks['s-parts'] = {
  enter() { const s = parts(); s.start(); s.select(s.sel); partTimer = setInterval(() => { if (!s.userT || performance.now() - s.userT > 9000) s.select((s.sel + 1) % PARTS.length); }, 3600); },
  leave() { parts().stop(); clearInterval(partTimer); $('#partsThumb').classList.remove('big'); },
};

// SCHEMATIC
const sch = buildSchematic($('#schematic'), { rb: $('#roRB'), f: $('#roF') });
hooks['s-circuit'] = { enter: sch.enter, leave() { sch.leave(); $('#origThumb').classList.remove('big'); }, key: i => sch.select(i) };

// PINOUT
const pinLabels = $('#pinLabels'), leaders = $('#pinLeaders');
pinLabels.innerHTML = PINS.map(p => `<div class="plabel" data-pin="${p.n}" data-tip="pin-${p.n}" style="--c:${p.c}"><em>${p.n}</em>${p.k}</div>`).join('');
PINS.forEach(p => { TIPS['pin-' + p.n] = { k: `Pin ${p.n} · ${p.k}`, t: p.t, c: p.c, b: p.b }; });
leaders.innerHTML = PINS.map(() => '<line/>').join('');
const pinout = lazy(() => {
  const s = new PinoutScene($('#pin3d'));
  const box = $('#pin3d'), lbls = $$('.plabel', pinLabels), lines = $$('line', leaders);
  s.onFrame = () => {
    const bx = box.offsetLeft, by = box.offsetTop, bw = box.clientWidth, bh = box.clientHeight;
    PINS.forEach((p, i) => {
      const [u, v] = s.pinScreen(p.n); const px = bx + u * bw, py = by + v * bh;
      const left = p.n <= 4, lx = left ? px - 230 : px + 230, ly = py;
      lbls[i].style.left = lx + 'px'; lbls[i].style.top = ly + 'px';
      const l = lines[i]; l.setAttribute('x1', px); l.setAttribute('y1', py); l.setAttribute('x2', lx + (left ? 95 : -95)); l.setAttribute('y2', ly);
    });
  };
  lbls.forEach(l => { l.addEventListener('pointerenter', () => { s.highlight(+l.dataset.pin); l.classList.add('on'); }); l.addEventListener('pointerleave', () => { s.highlight(null); l.classList.remove('on'); }); });
  return s;
});
hooks['s-pinout'] = { enter() { pinout().start(); }, leave() { pinout().stop(); } };

// ASTABLE
const internal = buildInternal($('#internal'));
const ast = astableChart($('#astChart'), $('#astKeys'), $('#astSlow'), internal);
hooks['s-astable'] = { enter: ast.enter, leave: ast.leave, key: i => ast.setKey(i) };

// FREQUENCY
const fq = freqChart($('#freqChart'), $('#capSeg'));
hooks['s-freq'] = fq;

// PIANO
const COLS = ['#ff453a', '#ff9f0a', '#ffd60a', '#30d158', '#64d2ff'];
let nowKey = -1;
$('#pianoKeys').innerHTML = KEYS.map((k, i) => { const tm = timing(k.RB), nn = nearestNote(tm.f); return `<div class="pkey" data-i="${i}" style="--c:${COLS[i]}"><small>${k.id}</small><b>${i + 1}</b><span>${Math.round(tm.f)} Hz</span></div>`; }).join('');
const pkeys = $$('.pkey');
function press(i, on) {
  const k = KEYS[i], tm = timing(k.RB);
  pkeys[i].classList.toggle('down', on);
  if (on) { noteOn('pk' + i, tm.f, tm.duty); nowKey = i; const nn = nearestNote(tm.f); $('#nowPlaying').innerHTML = `<span style="color:${COLS[i]};margin:0">${k.id}</span> · ${fmtHz(tm.f)}<span>≈ ${nn.name}</span>`; }
  else { noteOff('pk' + i); if (nowKey === i) nowKey = -1; }
}
pkeys.forEach((el, i) => {
  el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); press(i, true); });
  el.addEventListener('pointerup', () => press(i, false));
  el.addEventListener('pointercancel', () => press(i, false));
});
const spk = lazy(() => new SpeakerScene($('#spk3d'), level));
const sc = scope($('#scope'), () => nowKey >= 0 ? fmtHz(timing(KEYS[nowKey].RB).f) : 'idle');
hooks['s-piano'] = {
  enter() { spk().start(); sc.enter(); $('#nowPlaying').innerHTML = ''; },
  leave() { spk().stop(); sc.leave(); KEYS.forEach((_, i) => press(i, false)); },
  key: (i, down) => press(i, down),
};

/* ================= DECK ENGINE ================= */
const slides = $$('.slide');
const dots = $('#dots');
dots.innerHTML = slides.map((_, i) => `<button data-i="${i}" aria-label="Slide ${i + 1}"></button>`).join('');
dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) go(+b.dataset.i); });
const orbs = [$('.o1'), $('.o2')];
let cur = -1;
function go(n) {
  n = Math.max(0, Math.min(slides.length - 1, n));
  if (n === cur) return;
  hideTip();
  const prev = slides[cur];
  if (prev) { prev.classList.remove('active'); hooks[prev.id]?.leave?.(); }
  const dir = n > cur ? 1 : -1; cur = n;
  const s = slides[n];
  s.classList.add('active');
  try { hooks[s.id]?.enter?.(); } catch (err) { console.error(err); }
  $('#progress').style.width = ((n + 1) / slides.length * 100) + '%';
  $$('button', dots).forEach((b, i) => b.classList.toggle('on', i === n));
  $('#counter').textContent = String(n + 1).padStart(2, '0') + ' / ' + slides.length;
  const [c1, c2] = (s.dataset.orbs || '#0b3d91,#4b1d7a').split(',');
  orbs[0].style.background = c1; orbs[1].style.background = c2;
  orbs[0].style.transform = `translate(${Math.sin(n * 1.7) * 220}px, ${Math.cos(n * 1.3) * 160}px)`;
  orbs[1].style.transform = `translate(${Math.cos(n * 1.1) * 220}px, ${Math.sin(n * 1.9) * 160}px)`;
  history.replaceState(null, '', '#' + (n + 1));
  $('#brand').style.opacity = n === 0 || n === slides.length - 1 ? 0 : 1;
}
const next = () => go(cur + 1), prev = () => go(cur - 1);
window.deck = { go: n => go(n - 1) };
$('#nextBtn').addEventListener('click', next); $('#prevBtn').addEventListener('click', prev);

const held = new Set();
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); next(); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
  else if (k === 'Home') go(0);
  else if (k === 'End') go(slides.length - 1);
  else if (k === 'f' || k === 'F') { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }
  else if (/^[1-5]$/.test(k)) {
    const i = +k - 1, h = hooks[slides[cur].id];
    if (!h?.key) return;
    if (slides[cur].id === 's-piano') { if (held.has(k)) return; held.add(k); h.key(i, true); }
    else h.key(i);
  }
});
addEventListener('keyup', e => { if (/^[1-5]$/.test(e.key) && held.has(e.key)) { held.delete(e.key); hooks['s-piano'].key(+e.key - 1, false); } });

// swipe
let sx = null;
stage.addEventListener('pointerdown', e => { sx = e.target.closest('button,[data-tip],canvas,.pkey,.three,.sw') ? null : e.clientX; });
stage.addEventListener('pointerup', e => { if (sx != null && Math.abs(e.clientX - sx) > 80) (e.clientX < sx ? next : prev)(); sx = null; });

const start = parseInt(location.hash.slice(1)) - 1;
go(Number.isFinite(start) && start >= 0 ? start : 0);
setTimeout(() => { $('#hint').style.opacity = 0; }, 7000);
document.fonts?.ready.then(() => { fit(); });
