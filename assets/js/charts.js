// Canvas live charts
import { SHINAS_GRADS } from './data.js';
import { KEYS, timing, fmtHz, fmtR, nearestNote, VCC, RA, blip, getAnalyser, activeCount } from './audio.js';

export function fitCanvas(cv, cssH) {
  const w = cv.clientWidth || cv.parentElement.clientWidth;
  const h = cssH || cv.parentElement.clientHeight;
  cv.style.height = h + 'px';
  const r = cv.getBoundingClientRect();
  const scale = r.width && w ? r.width / w : 1;
  const dpr = Math.min(2, window.devicePixelRatio || 1) * scale;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const g = cv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { g, w, h };
}
const ease = t => 1 - Math.pow(1 - t, 3);
const FONT = (s, w = 600) => `${w} ${s}px Inter, sans-serif`;
function rr(g, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function mouseOf(cv, e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * cv.clientWidth, (e.clientY - r.top) / r.height * cv.clientHeight]; }

/* ---------- Shinas graduates per year ---------- */
export function gradChart(cv) {
  let raf, t0, hover = -1, dims;
  cv.addEventListener('pointermove', e => { if (!dims) return; const [mx] = mouseOf(cv, e); const { x0, bw, gap } = dims; const i = Math.floor((mx - x0) / (bw + gap)); hover = i >= 0 && i < SHINAS_GRADS.length ? i : -1; });
  cv.addEventListener('pointerleave', () => hover = -1);
  function draw(now) {
    const { g, w, h } = dims.c; const k = ease(Math.min(1, (now - t0) / 1600));
    g.clearRect(0, 0, w, h);
    const top = 50, bot = h - 50, x0 = 10, n = SHINAS_GRADS.length, gap = 22, bw = (w - x0 * 2 - gap * (n - 1)) / n, max = 180;
    Object.assign(dims, { x0, bw, gap });
    const avg = SHINAS_GRADS.reduce((a, b) => a + b[1], 0) / n;
    SHINAS_GRADS.forEach(([yr, v], i) => {
      const kk = ease(Math.max(0, Math.min(1, (now - t0 - i * 90) / 1100)));
      const bh = (v / max) * (bot - top) * kk, x = x0 + i * (bw + gap), y = bot - bh;
      const best = v === Math.max(...SHINAS_GRADS.map(d => d[1]));
      const gr = g.createLinearGradient(0, y, 0, bot);
      const c = best ? ['#ffd60a', '#ff9f0a'] : hover === i ? ['#8fc9ff', '#2997ff'] : ['rgba(255,179,64,.85)', 'rgba(255,120,40,.25)'];
      gr.addColorStop(0, c[0]); gr.addColorStop(1, c[1]);
      g.fillStyle = gr; rr(g, x, y, bw, bh, 12); g.fill();
      g.fillStyle = hover === i || best ? '#fff' : '#c7c7cc'; g.font = FONT(hover === i ? 30 : 24, 700); g.textAlign = 'center';
      if (kk > .6) g.fillText(Math.round(v * kk), x + bw / 2, y - 14);
      g.fillStyle = hover === i ? '#fff' : '#8e8e93'; g.font = FONT(22, 600); g.fillText(yr, x + bw / 2, bot + 36);
    });
    const ay = bot - (avg / max) * (bot - top) * k;
    g.setLineDash([8, 10]); g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, ay); g.lineTo(w, ay); g.stroke(); g.setLineDash([]);
    g.fillStyle = 'rgba(255,255,255,.75)'; g.font = FONT(20, 600); g.textAlign = 'right'; g.fillText('- - -  average ' + Math.round(avg), w - 4, 20);
    raf = requestAnimationFrame(draw);
  }
  return { enter() { dims = { c: fitCanvas(cv, 420) }; t0 = performance.now() + 500; raf = requestAnimationFrame(draw); }, leave() { cancelAnimationFrame(raf); } };
}

/* ---------- Frequency per key (bars) with selectable C1 ---------- */
export function freqChart(cv, segEl) {
  const CAPS = [47e-9, 68e-9, 100e-9, 150e-9, 220e-9];
  let C = 100e-9, raf, dims, hover = -1, flash = [0, 0, 0, 0, 0];
  const cur = KEYS.map(() => 0); let curMax = 1600;
  segEl.innerHTML = CAPS.map(c => `<button data-c="${c}" class="${c === C ? 'on' : ''}">${Math.round(c * 1e9)} nF</button>`).join('');
  segEl.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; C = +b.dataset.c; segEl.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); });
  cv.addEventListener('pointermove', e => { if (!dims) return; const [mx] = mouseOf(cv, e); const i = Math.floor((mx - dims.x0) / (dims.bw + dims.gap)); hover = i >= 0 && i < 5 ? i : -1; cv.style.cursor = hover >= 0 ? 'pointer' : 'default'; });
  cv.addEventListener('pointerleave', () => hover = -1);
  cv.addEventListener('click', () => { if (hover >= 0) { const tm = timing(KEYS[hover].RB, C); blip('fq', tm.f, tm.duty, 600); flash[hover] = performance.now(); } });
  const COLS = ['#ff453a', '#ff9f0a', '#ffd60a', '#30d158', '#64d2ff'];
  function draw(now) {
    const { g, w, h } = dims.c;
    g.clearRect(0, 0, w, h);
    const vals = KEYS.map(k => timing(k.RB, C).f);
    const target = Math.ceil(Math.max(...vals) * 1.25 / 500) * 500;
    curMax += (target - curMax) * 0.08;
    const top = 70, bot = h - 110, left = 90, x0 = left + 10, gap = 26, bw = (w - x0 - 10 - gap * 4) / 5;
    Object.assign(dims, { x0, bw, gap });
    // grid
    g.font = FONT(20, 500); g.textAlign = 'right';
    const step = curMax > 2600 ? 1000 : 500;
    for (let v = 0; v <= curMax; v += step) {
      const y = bot - v / curMax * (bot - top);
      g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 1; g.beginPath(); g.moveTo(left, y); g.lineTo(w, y); g.stroke();
      g.fillStyle = '#8e8e93'; g.fillText(v >= 1000 ? (v / 1000) + 'k' : v, left - 14, y + 7);
    }
    g.save(); g.translate(24, (top + bot) / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.fillStyle = '#8e8e93'; g.font = FONT(20, 600); g.fillText('FREQUENCY (Hz)', 0, 0); g.restore();
    KEYS.forEach((k, i) => {
      cur[i] += (vals[i] - cur[i]) * 0.09;
      const bh = cur[i] / curMax * (bot - top), x = x0 + i * (bw + gap), y = bot - bh;
      const fl = Math.max(0, 1 - (now - flash[i]) / 700);
      const gr = g.createLinearGradient(0, y, 0, bot);
      gr.addColorStop(0, COLS[i]); gr.addColorStop(1, COLS[i] + '22');
      g.shadowColor = COLS[i]; g.shadowBlur = hover === i ? 40 : 18 + fl * 40;
      g.fillStyle = gr; rr(g, x, y, bw, bh, 16); g.fill(); g.shadowBlur = 0;
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = FONT(hover === i ? 36 : 30, 750);
      g.fillText(Math.round(Math.abs(cur[i] - vals[i]) < 3 ? vals[i] : cur[i]), x + bw / 2, y - 18);
      g.font = FONT(26, 750); g.fillText(k.id, x + bw / 2, bot + 40);
      g.font = FONT(19, 500); g.fillStyle = '#8e8e93'; g.fillText(fmtR(k.RB), x + bw / 2, bot + 70);
      if (hover === i) {
        const tm = timing(k.RB, C), nn = nearestNote(tm.f);
        const lines = [`${k.id} · ${fmtHz(tm.f)}`, `R_B ${fmtR(k.RB)} · T ${(tm.T * 1000).toFixed(2)} ms`, `≈ ${nn.name} · click to hear`];
        const bx = Math.min(w - 380, Math.max(left, x + bw / 2 - 190)), by = Math.max(4, y - 190);
        g.fillStyle = 'rgba(28,28,32,.95)'; rr(g, bx, by, 380, 130, 18); g.fill(); g.strokeStyle = COLS[i]; g.lineWidth = 2; g.stroke();
        g.textAlign = 'left'; g.fillStyle = '#fff'; g.font = FONT(28, 750); g.fillText(lines[0], bx + 22, by + 42);
        g.fillStyle = '#c7c7cc'; g.font = FONT(21, 500); g.fillText(lines[1], bx + 22, by + 78); g.fillText(lines[2], bx + 22, by + 108);
      }
    });
    g.textAlign = 'left'; g.fillStyle = '#c7c7cc'; g.font = FONT(24, 650);
    g.fillText(`C1 = ${Math.round(C * 1e9)} nF  ·  R6 = 1 kΩ`, left, 34);
    raf = requestAnimationFrame(draw);
  }
  return { enter() { dims = { c: fitCanvas(cv) }; cur.fill(0); raf = requestAnimationFrame(draw); }, leave() { cancelAnimationFrame(raf); } };
}

/* ---------- Astable simulation: Vc + output, synced to the internal diagram ---------- */
export function astableChart(cv, keysEl, slowEl, internal) {
  let ki = 2, raf, dims, last, vc = 3, state = 'charge', hist = [], hoverX = -1;
  const SLOW = 2000;
  keysEl.innerHTML = KEYS.map((k, i) => `<button class="${i === ki ? 'on' : ''}" data-i="${i}">${k.id}</button>`).join('');
  const setKey = i => { ki = i; keysEl.querySelectorAll('button').forEach((b, j) => b.classList.toggle('on', j === i)); const tm = timing(KEYS[i].RB); slowEl.textContent = `Slow motion ×${SLOW} · real period ${(tm.T * 1000).toFixed(2)} ms`; };
  keysEl.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { setKey(+b.dataset.i); const tm = timing(KEYS[ki].RB); blip('ast', tm.f, tm.duty, 500); } });
  cv.addEventListener('pointermove', e => { hoverX = mouseOf(cv, e)[0]; });
  cv.addEventListener('pointerleave', () => hoverX = -1);
  setKey(ki);
  function step(dt) {
    const RB = KEYS[ki].RB, C = 100e-9, rt = dt / SLOW;
    if (state === 'charge') { const tau = (RA + RB) * C; vc = VCC - (VCC - vc) * Math.exp(-rt / tau); if (vc >= VCC * 2 / 3) { vc = VCC * 2 / 3; state = 'discharge'; internal.flash('A'); } }
    else { const tau = RB * C; vc = vc * Math.exp(-rt / tau); if (vc <= VCC / 3) { vc = VCC / 3; state = 'charge'; internal.flash('B'); } }
  }
  function draw(now) {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
    const sub = 8; for (let i = 0; i < sub; i++) step(dt / sub);
    hist.push([vc, state === 'charge' ? 1 : 0]); if (hist.length > 900) hist.shift();
    internal.set(state, vc);
    const { g, w, h } = dims.c;
    g.clearRect(0, 0, w, h);
    const L = 70, R = w - 20, aTop = 60, aBot = h * 0.58, oTop = h * 0.70, oBot = h - 40;
    const yV = v => aBot - (v / VCC) * (aBot - aTop);
    // labels
    g.font = FONT(24, 700); g.textAlign = 'left'; g.fillStyle = '#bf5af2'; g.fillText('C1 voltage', L, 30);
    g.fillStyle = '#30d158'; g.fillText('Output · pin 3', L, oTop - 18);
    // grid + thresholds
    g.font = FONT(19, 600); g.textAlign = 'right';
    [[0, '#8e8e93', '0 V'], [3, '#64d2ff', '3 V · ⅓'], [6, '#ffb340', '6 V · ⅔'], [9, '#8e8e93', '9 V']].forEach(([v, c, t]) => {
      const y = yV(v); g.strokeStyle = v === 3 || v === 6 ? c + 'aa' : 'rgba(255,255,255,.1)'; g.setLineDash(v === 3 || v === 6 ? [10, 8] : []); g.lineWidth = 2;
      g.beginPath(); g.moveTo(L, y); g.lineTo(R, y); g.stroke(); g.setLineDash([]);
      g.fillStyle = c; g.fillText(t.split(' · ')[0], L - 12, y + 7);
    });
    const n = hist.length, dx = (R - L) / 900;
    // Vc curve
    g.beginPath(); hist.forEach(([v], i) => { const x = R - (n - 1 - i) * dx, y = yV(v); i ? g.lineTo(x, y) : g.moveTo(x, y); });
    g.strokeStyle = '#bf5af2'; g.lineWidth = 5; g.shadowColor = '#bf5af2'; g.shadowBlur = 18; g.stroke(); g.shadowBlur = 0;
    // fill under
    g.lineTo(R, aBot); g.lineTo(R - (n - 1) * dx, aBot); g.closePath();
    const fg = g.createLinearGradient(0, aTop, 0, aBot); fg.addColorStop(0, 'rgba(191,90,242,.25)'); fg.addColorStop(1, 'rgba(191,90,242,0)'); g.fillStyle = fg; g.fill();
    // output square
    const yO = s => s ? oTop + 10 : oBot;
    g.beginPath(); hist.forEach(([, s], i) => { const x = R - (n - 1 - i) * dx, y = yO(s); if (!i) g.moveTo(x, y); else { g.lineTo(x, yO(hist[i - 1][1])); g.lineTo(x, y); } });
    g.strokeStyle = '#30d158'; g.lineWidth = 5; g.shadowColor = '#30d158'; g.shadowBlur = 16; g.stroke(); g.shadowBlur = 0;
    g.font = FONT(19, 600); g.fillStyle = '#8e8e93'; g.textAlign = 'right'; g.fillText('HIGH', L - 12, oTop + 17); g.fillText('LOW', L - 12, oBot + 6);
    // live head
    const hx = R, hy = yV(vc);
    g.fillStyle = '#fff'; g.beginPath(); g.arc(hx, hy, 8, 0, Math.PI * 2); g.fill();
    // phase pill
    const ch = state === 'charge';
    g.font = FONT(24, 750); const txt = ch ? 'CHARGING ↑' : 'DISCHARGING ↓'; const tw = g.measureText(txt).width + 40;
    g.fillStyle = ch ? 'rgba(255,179,64,.18)' : 'rgba(100,210,255,.18)'; rr(g, R - tw, 8, tw, 42, 21); g.fill();
    g.strokeStyle = ch ? '#ffb340' : '#64d2ff'; g.lineWidth = 2; g.stroke();
    g.fillStyle = ch ? '#ffb340' : '#64d2ff'; g.textAlign = 'center'; g.fillText(txt, R - tw / 2, 38);
    // hover crosshair
    if (hoverX > L && hoverX < R) {
      const i = Math.round(n - 1 - (R - hoverX) / dx);
      if (hist[i]) {
        g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(hoverX, aTop); g.lineTo(hoverX, oBot); g.stroke();
        const [v, s] = hist[i]; const bx = Math.min(R - 230, hoverX + 14), by = yV(v) - 90;
        g.fillStyle = 'rgba(28,28,32,.95)'; rr(g, bx, by, 220, 76, 14); g.fill();
        g.fillStyle = '#fff'; g.textAlign = 'left'; g.font = FONT(24, 750); g.fillText(`Vc = ${v.toFixed(2)} V`, bx + 16, by + 32);
        g.fillStyle = s ? '#30d158' : '#8e8e93'; g.font = FONT(20, 600); g.fillText(`Output ${s ? 'HIGH' : 'LOW'}`, bx + 16, by + 60);
      }
    }
    raf = requestAnimationFrame(draw);
  }
  return {
    setKey: i => { setKey(i); const tm = timing(KEYS[i].RB); blip('ast', tm.f, tm.duty, 500); },
    enter() { dims = { c: fitCanvas(cv) }; last = 0; hist = []; vc = 3; state = 'charge'; for (let i = 0; i < 900; i++) { for (let k = 0; k < 8; k++) step(1 / 60 / 8); hist.push([vc, state === 'charge' ? 1 : 0]); } raf = requestAnimationFrame(draw); },
    leave() { cancelAnimationFrame(raf); },
  };
}

/* ---------- Oscilloscope for the live piano ---------- */
export function scope(cv, labelFn) {
  let raf, dims, buf;
  function draw() {
    const { g, w, h } = dims.c;
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 1;
    for (let x = 0; x <= w; x += w / 10) { g.beginPath(); g.moveTo(x, 40); g.lineTo(x, h); g.stroke(); }
    for (let y = 40; y <= h; y += (h - 40) / 4) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.font = FONT(22, 700); g.fillStyle = '#30d158'; g.textAlign = 'left'; g.fillText('OSCILLOSCOPE · speaker signal', 0, 24);
    const lab = labelFn(); g.textAlign = 'right'; g.fillStyle = '#8e8e93'; g.fillText(lab, w, 24);
    const an = getAnalyser(); const mid = 40 + (h - 40) / 2, amp = (h - 60) / 2;
    g.beginPath();
    if (an && activeCount()) {
      if (!buf || buf.length !== an.fftSize) buf = new Float32Array(an.fftSize);
      an.getFloatTimeDomainData(buf);
      let s = 0; for (let i = 1; i < buf.length / 2; i++) if (buf[i - 1] < 0 && buf[i] >= 0) { s = i; break; }
      const N = 700;
      for (let i = 0; i < N; i++) { const x = i / N * w, y = mid - Math.max(-1, Math.min(1, buf[s + i] * 1.6)) * amp; i ? g.lineTo(x, y) : g.moveTo(x, y); }
    } else { g.moveTo(0, mid); g.lineTo(w, mid); }
    g.strokeStyle = '#30d158'; g.lineWidth = 4; g.shadowColor = '#30d158'; g.shadowBlur = 16; g.stroke(); g.shadowBlur = 0;
    raf = requestAnimationFrame(draw);
  }
  return { enter() { dims = { c: fitCanvas(cv) }; raf = requestAnimationFrame(draw); }, leave() { cancelAnimationFrame(raf); } };
}
