// All presentation content: short on-screen labels + richer hover details
export const COLLEGES = [
  { id: 'seeb', name: 'Seeb', full: 'Seeb Vocational College', ar: 'الكلية المهنية بالسيب', gov: 'Muscat Governorate', lat: 23.6272, lon: 58.2486, dx: 22, dy: -14,
    b: ['Al Hail North, Wilayat Al Seeb', 'Largest Vocational Efficiency intake for 2026–27: 270 trainees'] },
  { id: 'saham', name: 'Saham', full: 'Saham Vocational College', ar: 'الكلية المهنية بصحم', gov: 'North Al Batinah', lat: 24.1392, lon: 56.8814, dx: 22, dy: 4,
    b: ['Agricultural technology & plant production', 'Water & wastewater treatment'] },
  { id: 'shinas', name: 'Shinas', full: 'Shinas Vocational College', ar: 'الكلية المهنية بشناص', gov: 'North Al Batinah', lat: 24.74, lon: 56.46, dx: 22, dy: -8, star: true,
    b: ['Al Aqar, Wilayat Shinas', 'Strong focus on electrical & electronics', 'Spotlight of this presentation'] },
  { id: 'ibri', name: 'Ibri', full: 'Ibri Vocational College', ar: 'الكلية المهنية بعبري', gov: 'Al Dhahirah', lat: 23.23, lon: 56.51, dx: -22, dy: 6, anchor: 'end',
    b: ['Serves Al Dhahirah Governorate', 'Diploma + Vocational Efficiency programmes'] },
  { id: 'sur', name: 'Sur', full: 'Sur Vocational College', ar: 'الكلية المهنية بصور', gov: 'South Al Sharqiyah', lat: 22.57, lon: 59.53, dx: -22, dy: 30, anchor: 'end',
    b: ['Coastal city of South Al Sharqiyah', 'Offers Specialised Sales & Marketing'] },
  { id: 'buraimi', name: 'Al Buraimi', full: 'Al Buraimi Vocational College', ar: 'الكلية المهنية بالبريمي', gov: 'Al Buraimi', lat: 24.2352, lon: 55.9091, dx: -22, dy: 6, anchor: 'end',
    b: ['Serves Al Buraimi Governorate', 'Close to the UAE border'] },
  { id: 'salalah', name: 'Salalah', full: 'Salalah Vocational College', ar: 'الكلية المهنية بصلالة', gov: 'Dhofar', lat: 17.02, lon: 54.09, dx: 22, dy: 6,
    b: ['Southern hub in Dhofar', 'Formerly the Fishermen Rehabilitation Institute'] },
  { id: 'khaburah', name: 'Al Khaburah', full: 'Vocational College for Marine Sciences', ar: 'الكلية المهنية للعلوم البحرية بالخابورة', gov: 'North Al Batinah', lat: 23.97, lon: 57.10, dx: -16, dy: 36, anchor: 'end', marine: true,
    b: ['Aquaculture · seafood safety & quality', 'Marine engine mechanics · vessel navigation'] },
];

export const SPECS = [
  { k: 'Electricity', c: '#ffd60a', ic: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>', b: ['Industrial Electricity', 'Building Electricity'] },
  { k: 'Electronics', c: '#2997ff', ic: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>', b: ['Electronic Devices Maintenance', 'Circuits, testing & repair'] },
  { k: 'Mechatronics', c: '#bf5af2', ic: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>', b: ['Mechanics + electronics + control', 'Automation & robotics basics'] },
  { k: 'Automotive', c: '#ff453a', ic: '<path d="M3 16v-4l2-5h14l2 5v4"/><path d="M3 16h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>', b: ['Automotive Technology', 'Light vehicles · body repair & paint'] },
  { k: 'Refrigeration & AC', c: '#64d2ff', ic: '<path d="M12 2v20M4 6l16 12M20 6 4 18"/><path d="m9 3 3 3 3-3M9 21l3-3 3 3"/>', b: ['Installation & maintenance of AC units', '202 Vocational Efficiency seats (2026–27)'] },
  { k: 'Welding & Fabrication', c: '#ff9f0a', ic: '<path d="M4 20 14 10"/><path d="m14 10 3-3 3 3-3 3z"/><path d="M6 14l-2-1M8 17l-1 2M5 17H3"/>', b: ['Largest trade intake: 260 seats', 'Metal fabrication & joining'] },
  { k: 'Architecture & Interiors', c: '#ac8e68', ic: '<path d="M3 21h18M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/>', b: ['Architectural Drawing', 'Interior Design'] },
  { k: 'Sales & Logistics', c: '#30d158', ic: '<path d="M3 7h13v10H3zM16 10h4l1 3v4h-5"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>', b: ['Specialised Sales & Marketing', 'Logistics & warehouse management'] },
  { k: 'Agriculture & Water', c: '#a2e86b', ic: '<path d="M12 22V12"/><path d="M12 12C12 7 8 4 4 4c0 5 3 8 8 8zM12 14c0-4 3-7 8-7 0 4-3 7-8 7z"/>', b: ['Plant production · agri-technology', 'Water & wastewater treatment (Saham)'] },
  { k: 'Marine Sciences', c: '#5ac8fa', ic: '<path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><path d="M5 14l2-6h10l2 6M12 8V3l4 2"/>', b: ['Aquaculture · seafood quality', 'Marine engines · navigation (Al Khaburah)'] },
];

export const FLOW = [
  { k: 'Learners', s: 'Grade 10–12 graduates', c: '#30d158', ic: '<circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>', tip: 'fl-learners' },
  { k: 'Workshops', s: '85%+ hands-on', c: '#64d2ff', ic: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>', tip: 'practical' },
  { k: 'Qualification', s: 'Diploma · Efficiency', c: '#2997ff', ic: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>', tip: 'pathways' },
  { k: 'Workforce', s: 'Industry-ready', c: '#bf5af2', ic: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 13h18"/>', tip: 'fl-work' },
];

export const PROGRAMS = {
  inner: [
    { k: 'Industrial Electricity', c: '#ffd60a', b: ['Motors, control panels & industrial wiring', 'Vocational Diploma'] },
    { k: 'Building Electricity', c: '#ff9f0a', b: ['Residential & commercial installations', 'Vocational Diploma'] },
    { k: 'Electronic Devices', c: '#2997ff', b: ['Electronic Devices Maintenance', 'Where circuits like our 555 piano are studied'] },
    { k: 'Mechatronics', c: '#bf5af2', b: ['Sensors, actuators & automation', 'Vocational Diploma'] },
    { k: 'Sales & Marketing', c: '#30d158', b: ['Specialised Sales & Marketing', 'Vocational Diploma'] },
  ],
  outer: [
    { k: 'Operational Mechanics', c: '#64d2ff', b: ['Vocational Efficiency programme', 'Machines & maintenance'] },
    { k: 'Welding & Fabrication', c: '#ff453a', b: ['Vocational Efficiency programme', 'Metal fabrication'] },
    { k: 'Refrigeration & AC', c: '#5ac8fa', b: ['Vocational Efficiency programme', 'Cooling systems service'] },
  ],
};

export const SHINAS_GRADS = [[2017, 151], [2018, 109], [2019, 110], [2020, 116], [2021, 155], [2022, 68], [2023, 98], [2024, 159]];

export const PART_INFO = {
  battery: { n: '9 V Battery', v: '6F22 · 9 V DC', q: 1, role: 'Powers the circuit', c: '#30d158',
    tip: ['+9 V feeds pin 8 (VCC) and pin 4 (RESET)', 'Sets the switching levels: 6 V and 3 V'] },
  ic555: { n: '555 Timer', v: 'NE555 · DIP-8', q: 1, role: 'Generates the tone', c: '#2997ff',
    tip: ['Runs in astable (free-running) mode', 'Outputs a square wave on pin 3'] },
  speaker: { n: 'Speaker', v: '8 Ω', q: 1, role: 'Turns signal into sound', c: '#bf5af2',
    tip: ['Cone moves with each pulse', 'Driven from pin 3 through C3'] },
  r1k: { n: 'Resistor', v: '1 kΩ', q: 5, role: 'Sets the pitch steps', c: '#64d2ff',
    tip: ['R1–R4: the key ladder', 'R6: R_A, from +9 V to pin 7', 'Bands: brown · black · black · brown'] },
  r51k: { n: 'Resistor', v: '5.1 kΩ', q: 1, role: 'Base of the ladder', c: '#64d2ff',
    tip: ['R5: always in R_B', 'Sets the highest note (S5)', 'Bands: green · brown · black · brown'] },
  c10u: { n: 'Electrolytic cap', v: '10 µF', q: 1, role: 'Blocks DC to speaker', c: '#ffb340',
    tip: ['C3: couples pin 3 to the speaker', 'Passes the tone, blocks the DC offset', 'Polarised: + side to pin 3'] },
  c10n: { n: 'Ceramic cap', v: '10 nF · “103”', q: 1, role: 'Steadies pin 5', c: '#ffb340',
    tip: ['C2: pin 5 (control) to ground', 'Filters noise on the 6 V reference'] },
  c100n: { n: 'Ceramic cap', v: '100 nF · “104”', q: 1, role: 'The timing capacitor', c: '#ffb340',
    tip: ['C1: charges 3 V ↔ 6 V', 'With R_A & R_B it sets the frequency'] },
  button: { n: 'Push button', v: 'Momentary', q: 5, role: 'Each key picks a resistance', c: '#ff453a',
    tip: ['S1–S5: one per note', 'Pressed → connects a ladder node to C1'] },
};

export const PINS = [
  { n: 1, k: 'GND', c: '#8e8e93', t: 'Ground', b: ['0 V reference', 'Connected to battery −'] },
  { n: 2, k: 'TRIG', c: '#64d2ff', t: 'Trigger', b: ['Below ⅓ VCC (3 V) → output HIGH', 'Wired to C1'] },
  { n: 3, k: 'OUT', c: '#30d158', t: 'Output', b: ['Square wave, 0 ↔ ~9 V', 'Feeds C3 → speaker'] },
  { n: 4, k: 'RESET', c: '#ff453a', t: 'Reset', b: ['Active-low reset', 'Tied to +9 V: always running'] },
  { n: 5, k: 'CTRL', c: '#bf5af2', t: 'Control Voltage', b: ['Internal ⅔ VCC reference', 'Decoupled by C2 (10 nF)'] },
  { n: 6, k: 'THRES', c: '#ffb340', t: 'Threshold', b: ['Above ⅔ VCC (6 V) → output LOW', 'Wired to C1'] },
  { n: 7, k: 'DISCH', c: '#2997ff', t: 'Discharge', b: ['Shorts to ground when output LOW', 'Drains C1 through R_B'] },
  { n: 8, k: 'VCC', c: '#ff375f', t: 'Supply', b: ['+9 V from the battery', 'NE555 range: 4.5 – 16 V'] },
];

export const SKILLS = [
  { k: 'Read schematics', c: '#2997ff', ic: '<path d="M3 12h4l2-5 3 10 2-5h7"/>', b: ['Symbols, nodes & signal paths', 'From paper to real wiring'] },
  { k: 'Build & wire', c: '#ffb340', ic: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h.01M11 14h.01M15 14h.01"/>', b: ['Breadboard layout', 'Polarity & pin orientation'] },
  { k: 'Calculate', c: '#bf5af2', ic: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h4"/>', b: ['Predict each frequency', 'Choose R & C values'] },
  { k: 'Test & debug', c: '#30d158', ic: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>', b: ['Multimeter checks', 'Find & fix faults step by step'] },
  { k: 'Present', c: '#ff375f', ic: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/>', b: ['Explain how it works', 'Teamwork & communication'] },
];

export const REFS = [
  ['Lindevs — 5 Tones Electronic Piano Using 555 Timer (2021)', 'https://lindevs.com/5-tones-electronic-piano-using-555-timer'],
  ['Texas Instruments — NE555 Precision Timer datasheet', 'https://www.ti.com/lit/ds/symlink/ne555.pdf'],
  ['Oman Observer — Vocational college intake reaches 2,272 (2026)', 'https://www.omanobserver.om/article/1195784'],
  ['Oman Observer — Vocational Efficiency programmes 2026–27', 'https://www.omanobserver.om/article/1196339'],
  ['Oman Daily — 8th graduating cohort of vocational colleges (2025)', 'https://www.omandaily.om/article/1178629'],
  ['Al Wisal — 85%+ of vocational programmes are practical (2026)', 'https://alwisal.om/2026/05/11/'],
  ['NCSI Oman Data Portal — Vocational education statistics', 'https://data.gov.om/vfpyzhc/vocational-education'],
  ['Qanoon.om — Ministerial Decision 406/2017 (renaming to colleges)', 'https://qanoon.om/p/2017/momp20170406/'],
  ['MoHERI — Vocational diploma specialisations', 'https://www.moheri.gov.om'],
  ['Oman Daily — Royal Decree 61/2024 (vocational sector to Ministry of Labour)', 'https://www.omandaily.om/article/1168859'],
  ['Times of Oman — RO 20M vocational training plan 2026–2030', 'https://timesofoman.com/article/177190'],
  ['Shinas Vocational College — official site & @Shinas_VC', 'https://svcomancc.wixsite.com/shinasvc'],
  ['Dirasa Abroad — Shinas Vocational College programmes', 'https://www.dirasaabroad.com/shinas-vocational-college/'],
  ['Muscat Daily — Summer skills programme in Shinas (2025)', 'https://www.muscatdaily.com/2025/07/09/'],
  ['iMOVE Germany — Oman vocational training system (2013)', 'https://www.imove-germany.de'],
  ['geoBoundaries — Oman ADM2 boundaries (CC BY 4.0)', 'https://www.geoboundaries.org'],
];

// Rich hover cards. k = kicker, t = title, b = bullets, s = stats, c = colour, src = source note
export const TIPS = {
  authority: { k: 'Governance', t: 'Ministry of Labour', ar: 'وزارة العمل', c: '#30d158',
    b: ['Directorate General of Vocational Colleges', 'Until 2020: Ministry of Manpower', '2020–2024: Ministry of Higher Education', 'Royal Decree 61/2024 → Ministry of Labour'] },
  practical: { k: 'Method', t: 'Learning by doing', c: '#64d2ff',
    b: ['Over 85% of programme content is practical', 'Real workshops & labs for every trade', 'Industry visits and partnerships'], src: 'Source: Al Wisal, 2026' },
  pathways: { k: 'Pathways', t: 'Two ways in', c: '#2997ff',
    b: ['Vocational Diploma — for General Education Diploma holders', 'Vocational Efficiency — Level 1 & 2, for Grade 10/11 job-seekers', 'Aligned with the Oman Qualifications Framework'],
    s: [['2,272', 'Diploma seats filled 2026/27'], ['1,195', 'Efficiency seats 2026/27']] },
  'st-colleges': { k: 'Network', t: '7 + 1 colleges', c: '#30d158',
    b: ['7 Vocational Colleges', '1 Vocational College for Marine Sciences', 'Renamed from training centres in 2017 (Decision 406/2017)'] },
  'st-practical': { k: 'Training', t: '85%+ practical', c: '#64d2ff', b: ['Most learning happens in workshops', 'Skills employers can use from day one'] },
  'st-grads': { k: 'Outcomes', t: 'Graduates', c: '#2997ff', b: ['2026: more than 1,400 graduates', 'May 2025 cohort: 1,166 graduates'], s: [['504', 'Male (2025)'], ['662', 'Female (2025)']] },
  'st-spec': { k: 'Programmes', t: '16 specialisations', c: '#bf5af2', b: ['Engineering · business · construction', 'Agriculture & water · marine sciences'], s: [['RO 20M', 'Development plan 2026–30']] },
  'fl-learners': { k: 'Step 1', t: 'Learners', c: '#30d158', b: ['General Education Diploma holders → Vocational Diploma', 'Grade 10/11 job-seekers → Vocational Efficiency', 'Admission via the Unified Admission Centre'] },
  'fl-work': { k: 'Step 4', t: 'Into the workforce', c: '#bf5af2', b: ['Graduates join industry & services', 'e.g. a Shinas graduate at National Gas Company', 'Supports Oman Vision 2040'] },
  'svc-loc': { k: 'Location', t: 'Al Aqar, Shinas', ar: 'العقر، شناص', c: '#ffb340', b: ['North Al Batinah Governorate', 'P.O. Box 482, Postcode 324', 'Not to be confused with UTAS-Shinas'] },
  'svc-history': { k: 'History', t: 'From centre to college', c: '#2997ff', b: ['Began as Shinas Vocational Training Centre', 'Operating as a centre by 2011', 'Became a college in 2017 (Decision 406/2017)'] },
  'svc-core': { k: 'Strength', t: 'Electrical core', c: '#30d158', b: ['Industrial & Building Electricity', 'Electronic Devices Maintenance', 'Mechatronics'] },
  innovoex: { k: 'Achievement', t: 'INNOVOEX 2025', c: '#ffb340', b: ['Engineering projects exhibition organised by the college', 'Held at Liwa Science & Innovation Centre', 'Joined by UTAS-Sohar · covered by Oman TV'] },
  rb: { k: 'Live value', t: 'R_B — the key resistance', c: '#2997ff', b: ['Resistors between pin 7 and the pressed key', 'S5 → 5.1 kΩ … S1 → 9.1 kΩ'] },
  freq: { k: 'Live value', t: 'Output frequency', c: '#ffb340', b: ['f = 1.44 / ((R_A + 2R_B) · C1)', 'Higher R_B → lower note'] },
  'f-f': { k: 'Output', t: 'f — frequency', c: '#ffb340', b: ['Tones per second, in hertz (Hz)', 'Our keys: ≈ 750 Hz → 1.29 kHz'] },
  'f-ra': { k: 'Fixed', t: 'R_A = R6 = 1 kΩ', c: '#64d2ff', b: ['Between +9 V and pin 7', 'Only used while C1 charges'] },
  'f-rb': { k: 'Changes per key', t: 'R_B = 5.1 → 9.1 kΩ', c: '#2997ff', b: ['Set by which button is pressed', 'Used for both charge & discharge'] },
  'f-c': { k: 'Fixed', t: 'C = C1 = 100 nF', c: '#bf5af2', b: ['The timing capacitor', '1.44 ≈ 1 / ln 2'] },
};
