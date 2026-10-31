// SVG live diagrams: Oman map, Shinas zoom, flow, orbit, schematic, 555 internals
import { WILAYATS, MAP_BOUNDS, project } from './oman-map.js';
import { COLLEGES, FLOW, PROGRAMS, TIPS } from './data.js';
import { KEYS, timing, fmtHz, fmtR, nearestNote, blip, VCC } from './audio.js';

const NS = 'http://www.w3.org/2000/svg';
const HOSTS = { 'As Seeb': 'seeb', 'Saham': 'saham', 'Shinas': 'shinas', 'Ibri': 'ibri', 'Sur': 'sur', 'Al Buraymi': 'buraimi', 'Salalah': 'salalah', 'Al Khaburah': 'khaburah' };

/* ---------------- OMAN MAP ---------------- */
export function buildOmanMap(el, listEl) {
  const [x0, y0, x1, y1] = MAP_BOUNDS;
  let s = `<svg viewBox="${x0 - 30} ${y0 - 20} ${x1 - x0 + 120} ${y1 - y0 + 40}" preserveAspectRatio="xMidYMid meet"><g id="wils">`;
  for (const [name, d] of Object.entries(WILAYATS)) s += `<path class="wil${HOSTS[name] ? ' host' : ''}" data-w="${name}" ${HOSTS[name] ? `data-c="${HOSTS[name]}"` : ''} d="${d}"/>`;
  s += '</g><g id="pins">';
  COLLEGES.forEach((c, i) => {
    const [x, y] = project(c.lon, c.lat);
    const cls = c.star ? 'star' : c.marine ? 'marine' : '';
    s += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><g class="pin ${cls}" style="--i:${i}" data-tip="col-${c.id}" data-c="${c.id}">
      <circle class="pulse" r="10"/><circle class="dot" r="10"/>
      <text x="${c.dx}" y="${c.dy}" text-anchor="${c.anchor || 'start'}">${c.name}</text></g></g>`;
  });
  s += '</g></svg>';
  el.innerHTML = s;
  // stroke-draw animation per wilayat
  el.querySelectorAll('.wil').forEach(p => { const L = Math.ceil(p.getTotalLength()); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.style.transition = 'stroke-dashoffset 2.6s cubic-bezier(.2,.8,.2,1), fill 1s ease 1.8s'; });
  listEl.innerHTML = COLLEGES.map(c => `<div data-tip="col-${c.id}" data-c="${c.id}" style="--c:${c.star ? 'var(--amber)' : c.marine ? 'var(--cyan)' : 'var(--blue)'}"><i></i>${c.name}</div>`).join('');
  COLLEGES.forEach(c => { TIPS['col-' + c.id] = { k: c.gov, t: c.full, ar: c.ar, c: c.star ? '#ffb340' : c.marine ? '#64d2ff' : '#2997ff', b: c.b }; });
  const link = (id, on) => {
    el.querySelectorAll(`[data-c="${id}"]`).forEach(n => n.classList.toggle(n.classList.contains('wil') ? 'hot' : 'on', on));
    listEl.querySelectorAll(`[data-c="${id}"]`).forEach(n => n.classList.toggle('on', on));
  };
  [el, listEl].forEach(root => {
    root.addEventListener('pointerover', e => { const t = e.target.closest('[data-c]'); if (t) link(t.dataset.c, true); });
    root.addEventListener('pointerout', e => { const t = e.target.closest('[data-c]'); if (t) link(t.dataset.c, false); });
  });
  return {
    enter() { el.querySelectorAll('.wil').forEach((p, i) => { p.style.transitionDelay = `${(i % 20) * 30}ms, ${1800 + (i % 20) * 20}ms`; p.style.strokeDashoffset = 0; p.style.fillOpacity = 1; }); },
    leave() { el.querySelectorAll('.wil').forEach(p => { p.style.transitionDelay = '0s'; p.style.strokeDashoffset = p.style.strokeDasharray; }); },
  };
}

/* ---------------- SHINAS ZOOM ---------------- */
export function buildShinasZoom(el) {
  const [x0, y0, x1, y1] = MAP_BOUNDS;
  const full = [x0 - 30, y0 - 20, x1 - x0 + 60, y1 - y0 + 40];
  const [sx, sy] = project(56.46, 24.74);
  const zoom = [sx - 120, sy - 70, 230, 250];
  let s = `<svg class="zoom" viewBox="${full.join(' ')}" preserveAspectRatio="xMidYMid meet"><defs><radialGradient id="gl"><stop offset="0" stop-color="#ffb340" stop-opacity=".8"/><stop offset="1" stop-color="#ffb340" stop-opacity="0"/></radialGradient></defs><g>`;
  const near = ['Liwa', 'Sohar', 'Saham', 'Al Khaburah', 'As Suwayq', 'Al Buraymi', 'Mahadah', 'Dank', 'Yanqul', 'Ibri', 'Madha'];
  for (const [name, d] of Object.entries(WILAYATS)) s += `<path class="wil${name === 'Shinas' ? ' focus' : near.includes(name) ? ' near' : ''}" d="${d}" style="stroke-width:${name === 'Shinas' ? .9 : .35}"/>`;
  s += `</g><g id="zlabels" style="opacity:0;transition:opacity 1s">
    <circle cx="${sx}" cy="${sy}" r="26" fill="url(#gl)"><animate attributeName="r" values="14;30;14" dur="2.6s" repeatCount="indefinite"/></circle>
    <circle cx="${sx}" cy="${sy}" r="3.2" fill="#ffb340" stroke="#fff" stroke-width="1.1"/>
    <text x="${sx - 7}" y="${sy - 7}" text-anchor="end" style="font-size:9px;font-weight:800;fill:#ffb340;letter-spacing:.06em">SHINAS</text>
    ${lbl('Liwa', 56.56, 24.52)}${lbl('Sohar', 56.75, 24.33)}${lbl('Saham', 56.92, 24.12)}${lbl('Al Buraimi', 56.0, 24.28)}${lbl('Gulf of Oman', 56.95, 24.85, 1)}${lbl('UAE', 56.15, 24.95)}
  </g></svg>`;
  function lbl(t, lon, lat, sea) { const [x, y] = project(lon, lat); return `<text x="${x}" y="${y}" style="font-size:${sea ? 6.5 : 5.5}px;font-weight:600;fill:${sea ? '#64d2ff' : '#8e8e93'};letter-spacing:.08em;${sea ? 'font-style:italic' : ''}">${t.toUpperCase()}</text>`; }
  el.innerHTML = s;
  const svg = el.querySelector('svg'), labels = el.querySelector('#zlabels');
  let raf;
  const anim = (from, to, dur) => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      // zoom in log space for a natural feel
      const v = from.map((a, i) => i < 2 ? a + (to[i] - a) * e : Math.exp(Math.log(a) + (Math.log(to[i]) - Math.log(a)) * e));
      svg.setAttribute('viewBox', v.join(' '));
      if (k < 1) raf = requestAnimationFrame(step); else labels.style.opacity = 1;
    };
    raf = requestAnimationFrame(step);
  };
  return {
    enter() { labels.style.opacity = 0; svg.setAttribute('viewBox', full.join(' ')); setTimeout(() => anim(full, zoom, 2600), 500); },
    leave() { cancelAnimationFrame(raf); },
  };
}

/* ---------------- LEARNING FLOW ---------------- */
export function buildFlow(el) {
  const W = 1660, H = 210, n = FLOW.length, gap = W / n;
  let svg = `<svg viewBox="0 0 ${W} ${H}">`;
  for (let i = 0; i < n - 1; i++) {
    const xa = gap * i + gap / 2 + 120, xb = gap * (i + 1) + gap / 2 - 120, y = 105;
    const d = `M${xa},${y} L${xb},${y}`;
    svg += `<path d="${d}" stroke="rgba(255,255,255,.18)" stroke-width="3" stroke-dasharray="6 10" fill="none"/>`;
    for (let k = 0; k < 3; k++) svg += `<circle r="7" fill="${FLOW[i + 1].c}" style="filter:drop-shadow(0 0 8px ${FLOW[i + 1].c})"><animateMotion dur="2.4s" begin="${k * 0.8}s" repeatCount="indefinite" path="${d}"/></circle>`;
    svg += `<path d="M${xb - 4},${y - 12} L${xb + 10},${y} L${xb - 4},${y + 12}" stroke="${FLOW[i + 1].c}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  svg += '</svg>';
  el.innerHTML = svg + FLOW.map((f, i) => `<div class="fnode glass hov" data-tip="${f.tip}" style="left:${gap * i + gap / 2 - 150}px;--c:${f.c}"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="${f.c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 10px ${f.c})">${f.ic}</svg><b>${f.k}</b><span>${f.s}</span></div>`).join('');
}

/* ---------------- PROGRAM HUB (spokes with live current) ---------------- */
export function buildOrbit(el) {
  const items = [...PROGRAMS.inner.map(p => ({ ...p, tier: 'Vocational Diploma' })), ...PROGRAMS.outer.map(p => ({ ...p, tier: 'Vocational Efficiency' }))];
  const cx = 470, cy = 400, rx = 300, ry = 300;
  const pos = items.map((_, i) => { const th = -Math.PI / 2 + i * Math.PI * 2 / items.length; return [cx + Math.cos(th) * rx, cy + Math.sin(th) * ry]; });
  let svg = `<svg style="position:absolute;inset:0;width:100%;height:100%;overflow:visible" viewBox="0 0 900 820">`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${rx}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="2" stroke-dasharray="4 10"><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="60s" repeatCount="indefinite"/></circle>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${rx * 0.62}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="2"/>`;
  items.forEach((p, i) => {
    const [x, y] = pos[i], d = `M${cx},${cy} L${x},${y}`;
    svg += `<path class="spoke" data-i="${i}" d="${d}" stroke="${p.c}" stroke-opacity=".25" stroke-width="2.5" fill="none"/>`;
    svg += `<circle r="5" fill="${p.c}" style="filter:drop-shadow(0 0 6px ${p.c})"><animateMotion dur="${2 + (i % 3) * 0.4}s" begin="${i * 0.25}s" repeatCount="indefinite" path="${d}"/></circle>`;
  });
  svg += '</svg>';
  el.innerHTML = svg + `<div class="orb-center" style="left:${cx}px;top:${cy}px" data-tip="svc-core"><div>SVC<small>SHINAS</small></div></div>` +
    items.map((p, i) => `<div class="onode${i >= PROGRAMS.inner.length ? ' eff' : ''}" data-tip="prog-${i}" style="--c:${p.c};left:${pos[i][0]}px;top:${pos[i][1]}px;--d:${i * 0.4}s"><i></i>${p.k}</div>`).join('') +
    `<div class="olegend"><span>● Vocational Diploma</span><span>◌ Vocational Efficiency</span></div>`;
  items.forEach((p, i) => { TIPS['prog-' + i] = { k: p.tier, t: p.k, c: p.c, b: p.b }; });
  const spokes = [...el.querySelectorAll('.spoke')];
  el.querySelectorAll('.onode').forEach((n, i) => {
    n.addEventListener('pointerenter', () => { spokes[i].setAttribute('stroke-opacity', '1'); spokes[i].setAttribute('stroke-width', '5'); });
    n.addEventListener('pointerleave', () => { spokes[i].setAttribute('stroke-opacity', '.25'); spokes[i].setAttribute('stroke-width', '2.5'); });
  });
  return { enter() {}, leave() {} };
}

/* ---------------- INTERACTIVE SCHEMATIC ---------------- */
const NX = [190, 370, 550, 730, 910, 1090];
function zig(x1, y1, x2, y2) { // resistor zigzag between two points (horizontal or vertical)
  const h = y1 === y2, L = h ? x2 - x1 : y2 - y1, n = 6, seg = L / n;
  let d = `M${x1},${y1}`;
  for (let i = 0; i < n; i++) {
    const o = (i % 2 ? -1 : 1) * 16, m = seg * (i + 0.5);
    d += h ? ` L${x1 + m},${y1 + o}` : ` L${x1 + o},${y1 + m}`;
  }
  return d + ` L${x2},${y2}`;
}
export function buildSchematic(el, ro) {
  const RES = [['R1', '1 kΩ'], ['R2', '1 kΩ'], ['R3', '1 kΩ'], ['R4', '1 kΩ'], ['R5', '5.1 kΩ']];
  let s = `<svg viewBox="0 0 1780 700">`;
  // wires
  s += `<path class="w vcc" d="M60,345 V60 H1420 M1090,60 V110 M1090,220 V270 M1300,60 V200 M1420,60 V200"/>`;
  s += `<path class="w gnd" d="M60,375 V660 H1655 M1160,586 V660 M1300,470 V660 M1420,576 V660 M1655,360 V660"/>`;
  s += `<path class="w" d="M${NX[0]},270 H${NX[0] + 35} M${NX[5] - 35},270 H1250 M1160,330 H1250 M1160,400 H1250 M1160,330 V570 M${NX[0]},520 H1160 M1420,470 V560 M1470,335 H1550 M1566,335 H1640"/>`;
  for (let i = 0; i < 4; i++) s += `<path class="w" d="M${NX[i] + 145},270 H${NX[i + 1] + 35}"/>`;
  // resistor ladder
  RES.forEach(([n, v], i) => {
    const x1 = NX[i] + 35, x2 = NX[i + 1] - 35;
    s += `<g data-tip="sc-${n}" class="hit"><rect x="${x1}" y="225" width="${x2 - x1}" height="90" fill="transparent"/>
      <path class="comp res" id="sc${n}" d="${zig(x1, 270, x2, 270)}"/><text class="lbl" x="${(x1 + x2) / 2}" y="215" text-anchor="middle">${n}</text><text class="lbl v" x="${(x1 + x2) / 2}" y="335" text-anchor="middle">${v}</text></g>`;
  });
  s += `<g data-tip="sc-R6"><rect x="1050" y="100" width="90" height="130" fill="transparent"/><path class="comp" id="scR6" d="${zig(1090, 110, 1090, 220)}"/><text class="lbl" x="1122" y="160">R6</text><text class="lbl v" x="1122" y="190">1 kΩ</text></g>`;
  // switches
  KEYS.forEach((k, i) => {
    const x = NX[i];
    s += `<path class="w" d="M${x},270 V365 M${x},425 V520"/>
    <g class="sw" data-k="${i}" data-tip="sc-${k.id}"><rect class="hit" x="${x - 60}" y="340" width="120" height="110"/>
      <circle cx="${x}" cy="365" r="7" class="node"/><circle cx="${x}" cy="425" r="7" class="node"/>
      <line class="comp bar" x1="${x}" y1="425" x2="${x}" y2="365" style="transform-origin:${x}px 425px"/>
      <circle class="knob" cx="${x - 44}" cy="395" r="24"/><text class="lbl" x="${x - 44}" y="404" text-anchor="middle" style="font-size:22px;pointer-events:none">${k.id}</text></g>`;
    s += `<circle class="node" cx="${x}" cy="270" r="7"/><circle class="node" cx="${x}" cy="520" r="7"/>`;
  });
  s += `<circle class="node" cx="1090" cy="270" r="7"/><circle class="node" cx="1160" cy="400" r="7"/><circle class="node" cx="1160" cy="520" r="7"/><circle class="node" cx="1090" cy="60" r="7"/><circle class="node" cx="1300" cy="60" r="7"/>`;
  // C1, C2
  s += `<g data-tip="sc-C1"><rect x="1110" y="545" width="130" height="60" fill="transparent"/><path class="comp" id="scC1" d="M1125,570 H1195 M1125,586 H1195"/><text class="lbl" x="1210" y="574">C1</text><text class="lbl v" x="1210" y="600">100 nF</text></g>`;
  s += `<g data-tip="sc-C2"><rect x="1380" y="540" width="140" height="60" fill="transparent"/><path class="comp" d="M1385,560 H1455 M1385,576 H1455"/><text class="lbl" x="1468" y="565">C2</text><text class="lbl v" x="1468" y="591">10 nF</text></g>`;
  // C3 polarised + speaker
  s += `<g data-tip="sc-C3"><rect x="1530" y="280" width="60" height="110" fill="transparent"/><path class="comp" d="M1550,305 V365"/><path class="comp" d="M1572,305 Q1562,335 1572,365"/><text class="lbl" x="1540" y="292" style="font-size:22px">+</text><text class="lbl" x="1520" y="420">C3</text><text class="lbl v" x="1520" y="446">10 µF</text></g>`;
  s += `<g data-tip="sc-SPK" id="scSpk"><rect x="1630" y="260" width="110" height="150" fill="transparent"/><rect class="comp" x="1640" y="310" width="30" height="50"/><path class="comp" d="M1670,310 L1712,276 V394 L1670,360"/><text class="lbl" x="1690" y="440" text-anchor="middle">8 Ω</text>
    <path id="scWaves" d="M1730,300 q14,35 0,70 M1750,286 q22,49 0,98" class="comp" style="stroke:var(--green);opacity:0;transition:opacity .3s"/></g>`;
  // battery
  s += `<g data-tip="sc-BAT"><rect x="20" y="320" width="120" height="80" fill="transparent"/><path class="comp" d="M30,345 H90" style="stroke-width:5"/><path class="comp" d="M45,375 H75" style="stroke-width:8"/><text class="lbl" x="100" y="368">9 V</text><text class="lbl" x="38" y="335" style="font-size:22px">+</text></g>`;
  // ground symbol
  s += `<path class="w gnd" d="M880,660 V680 M855,680 H905 M865,690 H895 M875,700 H885"/>`;
  // 555
  s += `<g class="ic555" data-tip="sc-555"><rect class="body" x="1250" y="200" width="220" height="270" rx="16"/>
    <text class="lbl" x="1360" y="345" text-anchor="middle" style="font-size:44px;font-weight:800">555</text>
    <text class="lbl pinno" x="1262" y="262">7</text><text class="lbl pinno" x="1262" y="322">6</text><text class="lbl pinno" x="1262" y="392">2</text>
    <text class="lbl pinno" x="1292" y="222">8</text><text class="lbl pinno" x="1412" y="222">4</text><text class="lbl pinno" x="1292" y="462">1</text><text class="lbl pinno" x="1412" y="462">5</text><text class="lbl pinno" x="1450" y="327">3</text></g>`;
  // current-flow overlays
  s += `<path class="flowp chg" id="flChg"/><path class="flowp dis" id="flDis"/><path class="flowp out" id="flOut" d="M1470,335 H1640"/>`;
  s += `<g id="phaseTag" style="opacity:0;transition:opacity .4s"><rect x="1000" y="610" width="140" height="44" rx="22" fill="rgba(255,179,64,.18)" stroke="var(--amber)"/><text id="phaseTxt" x="1070" y="640" text-anchor="middle" class="lbl" style="font-size:20px">CHARGING</text></g>`;
  s += '</svg>';
  el.innerHTML = s;

  // tips
  const T = (k, t, c, b) => { TIPS[k] = { k: 'Component', t, c, b }; };
  T('sc-R1', 'R1 · 1 kΩ', '#64d2ff', ['End of the ladder', 'In R_B only for S1 (lowest note)']);
  T('sc-R2', 'R2 · 1 kΩ', '#64d2ff', ['In R_B for S1 and S2']);
  T('sc-R3', 'R3 · 1 kΩ', '#64d2ff', ['In R_B for S1 – S3']);
  T('sc-R4', 'R4 · 1 kΩ', '#64d2ff', ['In R_B for S1 – S4']);
  T('sc-R5', 'R5 · 5.1 kΩ', '#64d2ff', ['Always part of R_B', 'Alone it gives the highest note']);
  T('sc-R6', 'R6 · 1 kΩ = R_A', '#64d2ff', ['From +9 V to pin 7', 'Only in the charging path']);
  T('sc-C1', 'C1 · 100 nF', '#bf5af2', ['Timing capacitor on pins 6 & 2', 'Swings between 3 V and 6 V']);
  T('sc-C2', 'C2 · 10 nF', '#bf5af2', ['Pin 5 to ground', 'Keeps the 6 V reference quiet']);
  T('sc-C3', 'C3 · 10 µF', '#ffb340', ['Blocks DC from the speaker', 'Lets the tone pass']);
  T('sc-SPK', 'Speaker · 8 Ω', '#30d158', ['Converts the square wave to sound']);
  T('sc-BAT', 'Battery · 9 V', '#30d158', ['+ rail → pins 8 & 4, R6', '− rail → pin 1 & ground']);
  T('sc-555', '555 Timer', '#2997ff', ['Astable mode', 'Pin 3 drives the speaker']);
  KEYS.forEach((k, i) => { const tm = timing(k.RB), nn = nearestNote(tm.f); TIPS['sc-' + k.id] = { k: 'Key ' + (i + 1), t: `${k.id} → ${fmtHz(tm.f)}`, c: '#ffb340', b: [`R_B = ${k.chain.join(' + ')} = ${fmtR(k.RB)}`, `Period ${(tm.T * 1000).toFixed(2)} ms · duty ${(tm.duty * 100).toFixed(0)}%`, `≈ ${nn.name} (${nn.cents >= 0 ? '+' : ''}${nn.cents} cents)`] }; });

  const sws = [...el.querySelectorAll('.sw')];
  const chg = el.querySelector('#flChg'), dis = el.querySelector('#flDis'), out = el.querySelector('#flOut');
  const tag = el.querySelector('#phaseTag'), tagTxt = el.querySelector('#phaseTxt'), waves = el.querySelector('#scWaves');
  const res = ['R1', 'R2', 'R3', 'R4', 'R5'].map(n => el.querySelector('#sc' + n));
  let sel = -1, phaseTimer, demoTimer, userTouched = false;
  function select(i, sound) {
    sel = i;
    sws.forEach((w, j) => w.classList.toggle('on', j === i));
    clearTimeout(phaseTimer);
    if (i < 0) { [chg, dis, out].forEach(p => p.classList.remove('on')); res.forEach(r => r.classList.remove('lit', 'dim')); tag.style.opacity = 0; waves.style.opacity = 0; ro.rb.textContent = '—'; ro.f.textContent = '—'; return; }
    const k = KEYS[i], tm = timing(k.RB), x = NX[i];
    res.forEach((r, j) => { const on = j >= i; r.classList.toggle('lit', on); r.classList.toggle('dim', !on); });
    el.querySelector('#scR6').classList.add('lit');
    chg.setAttribute('d', `M60,345 V60 H1090 V270 H${x} V520 H1160 V570`);
    dis.setAttribute('d', `M1160,570 V520 H${x} V270 H1250`);
    out.classList.add('on'); waves.style.opacity = 1;
    ro.rb.textContent = fmtR(k.RB); ro.f.textContent = fmtHz(tm.f);
    let ph = 0;
    const cycle = () => {
      const c = ph % 2 === 0;
      chg.classList.toggle('on', c); dis.classList.toggle('on', !c);
      el.querySelector('#scR6').classList.toggle('lit', c);
      tag.style.opacity = 1; tagTxt.textContent = c ? 'CHARGING' : 'DISCHARGING';
      tag.querySelector('rect').setAttribute('stroke', c ? 'var(--amber)' : 'var(--cyan)');
      tag.querySelector('rect').setAttribute('fill', c ? 'rgba(255,179,64,.18)' : 'rgba(100,210,255,.18)');
      ph++; phaseTimer = setTimeout(cycle, (c ? tm.duty : 1 - tm.duty) * 2400);
    };
    cycle();
    if (sound) blip('sch', tm.f, tm.duty, 700);
  }
  sws.forEach((w, i) => w.addEventListener('click', () => { userTouched = true; clearInterval(demoTimer); select(i, true); }));
  return {
    select: i => { userTouched = true; clearInterval(demoTimer); select(i, true); },
    enter() { userTouched = false; let j = 0; select(-1); demoTimer = setInterval(() => { if (!userTouched) select(j++ % 5, false); }, 3200); setTimeout(() => { if (!userTouched) select(j++ % 5, false); }, 1400); },
    leave() { clearInterval(demoTimer); clearTimeout(phaseTimer); },
  };
}

/* ---------------- 555 INTERNALS (live block diagram) ---------------- */
export function buildInternal(el) {
  el.innerHTML = `<svg viewBox="0 0 820 660" style="width:100%;height:100%">
  <path class="iw" d="M70,40 H760 M70,40 V75 M70,140 V245 M70,310 V405 M70,470 V620 H760"/>
  <text class="btxt s" x="760" y="24" style="text-anchor:end">VCC · 9 V (8)</text><text class="btxt s" x="760" y="644" style="text-anchor:end">GND (1)</text>
  ${[75, 245, 405].map(y => `<rect x="52" y="${y}" width="36" height="65" rx="6" class="blk" data-tip="in-div"/><text class="btxt s" x="30" y="${y + 33}">5k</text>`).join('')}
  <circle cx="70" cy="180" r="6" fill="#c9d3e3"/><circle cx="70" cy="370" r="6" fill="#c9d3e3"/>
  <text class="btxt" x="115" y="165" style="fill:var(--amber);font-size:22px">6 V</text><text class="btxt" x="115" y="392" style="fill:var(--cyan);font-size:22px">3 V</text>
  <path class="iw" d="M70,180 H230 M70,370 H230"/>
  <path class="iw" id="vcBus" d="M180,220 H230 M180,330 H230 M180,220 V330 M180,275 H150"/>
  <text class="btxt s" x="128" y="276" style="text-anchor:end;fill:var(--violet)" id="vcTxt">C1</text>
  <text class="btxt s" x="200" y="210" style="font-size:16px">6</text><text class="btxt s" x="200" y="320" style="font-size:16px">2</text>
  <path class="blk" id="cmpA" d="M230,150 L330,200 L230,250 Z" data-tip="in-cmpA"/><text class="btxt s" x="264" y="200">TH</text>
  <path class="blk" id="cmpB" d="M230,300 L330,350 L230,400 Z" data-tip="in-cmpB"/><text class="btxt s" x="264" y="350">TR</text>
  <text class="btxt s" x="243" y="181" style="font-size:16px">−</text><text class="btxt s" x="243" y="220" style="font-size:16px">+</text>
  <text class="btxt s" x="243" y="331" style="font-size:16px">−</text><text class="btxt s" x="243" y="370" style="font-size:16px">+</text>
  <path class="iw" id="wR" d="M330,200 H420"/><path class="iw" id="wS" d="M330,350 H420"/>
  <rect class="blk" id="ff" x="420" y="165" width="150" height="220" rx="16" data-tip="in-ff"/>
  <text class="btxt" x="495" y="250">FLIP</text><text class="btxt" x="495" y="280">FLOP</text>
  <text class="btxt s" x="436" y="200">R</text><text class="btxt s" x="436" y="350">S</text>
  <text class="btxt" id="ffQ" x="495" y="330" style="font-size:20px;fill:var(--green)">Q = 1</text>
  <path class="iw" id="wQ" d="M570,275 H620"/>
  <path class="blk" id="buf" d="M620,235 L700,275 L620,315 Z" data-tip="in-out"/>
  <path class="iw" id="wOut" d="M700,275 H760"/>
  <rect x="760" y="252" width="56" height="46" rx="12" fill="rgba(48,209,88,.15)" stroke="var(--green)" stroke-width="2"/><text class="btxt" x="788" y="276" style="font-size:20px">3</text>
  <text class="btxt" id="outTxt" x="730" y="225" style="font-size:22px;fill:var(--green)">HIGH</text>
  <path class="iw" id="wB" d="M495,385 V485 H520"/>
  <circle class="blk" id="q1" cx="560" cy="510" r="44" data-tip="in-q1"/>
  <path class="iw" d="M540,485 V535 M540,500 L580,476 M540,520 L580,544"/>
  <path class="iw" id="wDis" d="M580,476 V440 H760"/><path class="iw" d="M580,544 V620"/>
  <rect x="760" y="417" width="56" height="46" rx="12" fill="rgba(41,151,255,.15)" stroke="var(--blue)" stroke-width="2"/><text class="btxt" x="788" y="441" style="font-size:20px">7</text>
  <text class="btxt" id="q1Txt" x="660" y="520" style="font-size:20px;fill:var(--muted)">OFF</text>
  <text class="btxt s" x="560" y="590">DISCHARGE</text>
  </svg>`;
  Object.assign(TIPS, {
    'in-div': { k: 'Inside the 555', t: 'Voltage divider', c: '#ffb340', b: ['Three equal 5 kΩ resistors', 'Make the ⅔ VCC (6 V) and ⅓ VCC (3 V) references'] },
    'in-cmpA': { k: 'Inside the 555', t: 'Threshold comparator', c: '#ffb340', b: ['Fires when C1 rises above 6 V', 'Resets the flip-flop → output LOW'] },
    'in-cmpB': { k: 'Inside the 555', t: 'Trigger comparator', c: '#64d2ff', b: ['Fires when C1 falls below 3 V', 'Sets the flip-flop → output HIGH'] },
    'in-ff': { k: 'Inside the 555', t: 'SR flip-flop', c: '#2997ff', b: ['1-bit memory of the state', 'Remembers: charging or discharging'] },
    'in-out': { k: 'Inside the 555', t: 'Output stage', c: '#30d158', b: ['Buffers the flip-flop to pin 3', 'Can drive a small speaker'] },
    'in-q1': { k: 'Inside the 555', t: 'Discharge transistor', c: '#2997ff', b: ['ON when output is LOW', 'Pin 7 to ground → C1 drains through R_B'] },
  });
  const $ = id => el.querySelector('#' + id);
  let flashA = 0, flashB = 0;
  return {
    set(state, vc) {
      const high = state === 'charge';
      $('cmpA').classList.toggle('onA', performance.now() < flashA);
      $('cmpB').classList.toggle('on', performance.now() < flashB);
      $('ff').classList.toggle('on', true);
      ['wQ', 'wOut'].forEach(w => $(w).classList.toggle('hi', high));
      $('outTxt').textContent = high ? 'HIGH' : 'LOW'; $('outTxt').style.fill = high ? 'var(--green)' : 'var(--muted)';
      $('ffQ').textContent = high ? 'Q = 1' : 'Q = 0';
      $('q1').classList.toggle('on', !high);
      $('wB').classList.toggle('hi', !high); $('wDis').classList.toggle('hi', !high);
      $('wDis').style.stroke = !high ? 'var(--blue)' : ''; $('wB').style.stroke = !high ? 'var(--blue)' : '';
      $('q1Txt').textContent = high ? 'OFF' : 'ON'; $('q1Txt').style.fill = high ? 'var(--muted)' : 'var(--blue)';
      $('vcTxt').textContent = vc.toFixed(1) + ' V';
      $('wR').classList.toggle('hi', performance.now() < flashA); $('wS').classList.toggle('hi', performance.now() < flashB);
    },
    flash(which) { if (which === 'A') flashA = performance.now() + 380; else flashB = performance.now() + 380; },
  };
}
