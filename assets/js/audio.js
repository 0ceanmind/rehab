// Circuit math + live 555-accurate synthesiser (pulse wave with the real duty cycle)
export const VCC = 9;
export const RA = 1000;            // R6
export const C1_DEFAULT = 100e-9;  // C1
// R_B for each key = resistors between pin 7 node and the pressed switch's node
export const KEYS = [
  { id: 'S1', RB: 9100, chain: ['R5', 'R4', 'R3', 'R2', 'R1'] },
  { id: 'S2', RB: 8100, chain: ['R5', 'R4', 'R3', 'R2'] },
  { id: 'S3', RB: 7100, chain: ['R5', 'R4', 'R3'] },
  { id: 'S4', RB: 6100, chain: ['R5', 'R4'] },
  { id: 'S5', RB: 5100, chain: ['R5'] },
];
export const LN2 = Math.log(2);
export function timing(RB, C = C1_DEFAULT, Ra = RA) {
  const tH = LN2 * (Ra + RB) * C;
  const tL = LN2 * RB * C;
  const T = tH + tL;
  return { tH, tL, T, f: 1 / T, duty: tH / T };
}
const NOTE = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
export function nearestNote(f) {
  const n = 12 * Math.log2(f / 440) + 69;
  const r = Math.round(n);
  const cents = Math.round((n - r) * 100);
  return { name: NOTE[(r % 12 + 12) % 12] + (Math.floor(r / 12) - 1), cents };
}
export const fmtHz = f => f >= 1000 ? (f / 1000).toFixed(2) + ' kHz' : Math.round(f) + ' Hz';
export const fmtR = r => r >= 1000 ? (r / 1000).toFixed(1).replace('.0', '') + ' kΩ' : r + ' Ω';

let ctx, master, analyser, hp, voices = new Map(), waveCache = new Map();
function ensure() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.gain.value = 0.22;
  hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 180; // small-speaker roll-off
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7000;
  analyser = ctx.createAnalyser(); analyser.fftSize = 4096; analyser.smoothingTimeConstant = 0.6;
  master.connect(hp); hp.connect(lp); lp.connect(analyser); analyser.connect(ctx.destination);
  return ctx;
}
function pulseWave(duty) {
  const key = duty.toFixed(3);
  if (waveCache.has(key)) return waveCache.get(key);
  const N = 64, real = new Float32Array(N), imag = new Float32Array(N);
  for (let n = 1; n < N; n++) {
    real[n] = Math.sin(2 * Math.PI * n * duty) / (n * Math.PI);
    imag[n] = (1 - Math.cos(2 * Math.PI * n * duty)) / (n * Math.PI);
  }
  const w = ctx.createPeriodicWave(real, imag);
  waveCache.set(key, w); return w;
}
export function noteOn(id, f, duty = 0.53) {
  ensure();
  noteOff(id, 0.01);
  const o = ctx.createOscillator();
  o.setPeriodicWave(pulseWave(duty));
  o.frequency.value = f;
  const g = ctx.createGain(); g.gain.value = 0;
  g.gain.setTargetAtTime(1, ctx.currentTime, 0.006);
  o.connect(g); g.connect(master); o.start();
  voices.set(id, { o, g });
}
export function noteOff(id, rel = 0.06) {
  const v = voices.get(id); if (!v) return;
  voices.delete(id);
  v.g.gain.cancelScheduledValues(ctx.currentTime);
  v.g.gain.setTargetAtTime(0, ctx.currentTime, rel / 3);
  v.o.stop(ctx.currentTime + rel * 3);
}
export function blip(id, f, duty, ms = 650) { noteOn(id, f, duty); setTimeout(() => noteOff(id), ms); }
export function getAnalyser() { return analyser; }
export function getCtx() { return ctx; }
export function activeCount() { return voices.size; }
let lvlBuf;
export function level() {
  if (!analyser) return 0;
  if (!lvlBuf) lvlBuf = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(lvlBuf);
  let s = 0; for (let i = 0; i < lvlBuf.length; i += 4) s += lvlBuf[i] * lvlBuf[i];
  return Math.min(1, Math.sqrt(s / (lvlBuf.length / 4)) * 3.2);
}
