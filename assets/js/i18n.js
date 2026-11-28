// Bilingual support (English / Arabic) with RTL layout
const qs = new URLSearchParams(location.search).get('lang');
let saved = null;
try { saved = localStorage.getItem('deck-lang'); } catch (e) { /* storage unavailable */ }
export let lang = qs === 'ar' || qs === 'en' ? qs : saved === 'ar' ? 'ar' : 'en';

const subs = new Set();
export const isAr = () => lang === 'ar';
/** pick a literal: t('Hello', 'مرحبا') */
export const t = (en, ar) => (lang === 'ar' && ar != null ? ar : en);
/** pick a localised field of an object: L(obj, 'k') → obj.k_ar in Arabic mode */
export const L = (o, f) => (lang === 'ar' && o[f + '_ar'] != null ? o[f + '_ar'] : o[f]);
export const onLang = fn => subs.add(fn);

const AR_RE = /[؀-ۿ]/;
/** in Arabic mode, isolate purely Latin/technical strings so formulas and units keep their order */
export const iso = s => (lang !== 'ar' || !s ? s : !AR_RE.test(String(s).replace(/<[^>]+>/g, '')) ? `<bdi dir="ltr">${s}</bdi>` : fixRanges(s));
// numeric ranges (2017–2024, 10–12, 1–5) would read backwards inside Arabic text: isolate them
const RANGE_RE = /(\d[\d.,]*\s?[–-]\s?\d[\d.,]*)/g;
export function fixRanges(s) { return s ? String(s).replace(RANGE_RE, '<bdi dir="ltr">$1</bdi>') : s; }

/** swap every element carrying data-ar between its English and Arabic markup */
export function applyDoc(root = document) {
  const html = document.documentElement;
  html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  root.querySelectorAll('[data-ar]').forEach(el => {
    if (el.dataset.en == null) el.dataset.en = el.innerHTML;
    el.innerHTML = lang === 'ar' ? fixRanges(el.dataset.ar) : el.dataset.en;
  });
  root.querySelectorAll('[data-ar-alt]').forEach(el => {
    if (el.dataset.enAlt == null) el.dataset.enAlt = el.getAttribute('alt') || '';
    el.setAttribute('alt', lang === 'ar' ? el.dataset.arAlt : el.dataset.enAlt);
  });
  document.title = t('From Skills to Sound — Omani Vocational Colleges & the 555 Piano', 'من المهارة إلى الصوت — الكليات المهنية العُمانية وبيانو 555');
}
export function setLang(l) {
  if (l === lang) return;
  lang = l;
  try { localStorage.setItem('deck-lang', l); } catch (e) { /* ignore */ }
  const u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u);
  applyDoc();
  subs.forEach(f => f(l));
}
