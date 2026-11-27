// English ⇄ Arabic switch.
// - Headings and rich lines carry their Arabic HTML in a `data-ar` attribute (index.html).
// - Every other piece of text is looked up in AR below, including text that scripts write later
//   (a MutationObserver keeps it translated) and canvas labels (charts call t()).

const AR = {
  // ---------- chrome ----------
  'navigate': 'للتنقّل', 'full screen · hover for details': 'ملء الشاشة · مرّر المؤشّر لعرض التفاصيل',
  'Shinas Vocational College': 'الكلية المهنية بشناص',

  // ---------- 1 · hero ----------
  'Vocational Education · Sultanate of Oman': 'التعليم المهني · سلطنة عُمان',
  'Omani Vocational Colleges': 'الكليات المهنية العُمانية',
  'The 555 Electronic Piano': 'البيانو الإلكتروني بمؤقّت 555',

  // ---------- 2 · overview ----------
  'The Network': 'الشبكة',
  'Diploma & Vocational Efficiency': 'الدبلوم المهني والكفايات المهنية',
  'Colleges nationwide': 'كليات في أنحاء السلطنة', 'Practical training': 'تدريب عملي',
  'Graduates in 2026': 'خرّيج في عام 2026', 'Diploma specialisations': 'تخصّصًا في الدبلوم',

  // ---------- 3 · map ----------
  'Across the Sultanate': 'في ربوع السلطنة', 'Vocational College': 'كلية مهنية', 'Marine Sciences': 'العلوم البحرية', 'Spotlight': 'تحت الضوء',
  'Seeb': 'السيب', 'Saham': 'صحم', 'Shinas': 'شناص', 'Ibri': 'عبري', 'Sur': 'صور', 'Al Buraimi': 'البريمي', 'Salalah': 'صلالة', 'Al Khaburah': 'الخابورة',
  'Seeb Vocational College': 'الكلية المهنية بالسيب', 'Saham Vocational College': 'الكلية المهنية بصحم', 'Ibri Vocational College': 'الكلية المهنية بعبري',
  'Sur Vocational College': 'الكلية المهنية بصور', 'Al Buraimi Vocational College': 'الكلية المهنية بالبريمي', 'Salalah Vocational College': 'الكلية المهنية بصلالة',
  'Vocational College for Marine Sciences': 'الكلية المهنية للعلوم البحرية بالخابورة',
  'Muscat Governorate': 'محافظة مسقط', 'North Al Batinah': 'شمال الباطنة', 'Al Dhahirah': 'محافظة الظاهرة', 'South Al Sharqiyah': 'محافظة جنوب الشرقية', 'Dhofar': 'محافظة ظفار',
  'Al Hail North, Wilayat Al Seeb': 'الحيل الشمالية، ولاية السيب',
  'Largest Vocational Efficiency intake for 2026–27: 270 trainees': 'أكبر قبول في برامج الكفايات المهنية لعام 2026–27: ‏270 متدرّبًا',
  'Agricultural technology & plant production': 'التقنيات الزراعية والإنتاج النباتي', 'Water & wastewater treatment': 'معالجة المياه والصرف الصحي',
  'Al Aqar, Wilayat Shinas': 'العقر، ولاية شناص', 'Strong focus on electrical & electronics': 'تركيز قوي على الكهرباء والإلكترونيات', 'Spotlight of this presentation': 'محور هذا العرض',
  'Serves Al Dhahirah Governorate': 'تخدم محافظة الظاهرة', 'Diploma + Vocational Efficiency programmes': 'برامج الدبلوم والكفايات المهنية',
  'Coastal city of South Al Sharqiyah': 'مدينة ساحلية في جنوب الشرقية', 'Offers Specialised Sales & Marketing': 'تطرح تخصّص المبيعات والتسويق',
  'Serves Al Buraimi Governorate': 'تخدم محافظة البريمي', 'Close to the UAE border': 'قريبة من الحدود الإماراتية',
  'Southern hub in Dhofar': 'المركز الجنوبي في ظفار', 'Formerly the Fishermen Rehabilitation Institute': 'كانت سابقًا معهد تأهيل الصيادين',
  'Aquaculture · seafood safety & quality': 'الاستزراع السمكي · سلامة المأكولات البحرية وجودتها',
  'Marine engine mechanics · vessel navigation': 'ميكانيكا المحرّكات البحرية · الملاحة',

  // ---------- 4 · what they do ----------
  'What they do': 'ماذا تقدّم',
  'Learners': 'المتعلّمون', 'Grade 10–12 graduates': 'خرّيجو الصفوف 10–12', 'Workshops': 'الورش', '85%+ hands-on': 'أكثر من 85% تطبيق عملي',
  'Qualification': 'المؤهّل', 'Diploma · Efficiency': 'دبلوم · كفايات', 'Workforce': 'سوق العمل', 'Industry-ready': 'جاهزون لسوق العمل',
  'Specialisation': 'تخصّص',
  'Electricity': 'الكهرباء', 'Electronics': 'الإلكترونيات', 'Mechatronics': 'الميكاترونكس', 'Automotive': 'السيارات', 'Refrigeration & AC': 'التبريد والتكييف',
  'Welding & Fabrication': 'اللحام والتشكيل', 'Architecture & Interiors': 'العمارة والتصميم الداخلي', 'Sales & Logistics': 'المبيعات والخدمات اللوجستية',
  'Agriculture & Water': 'الزراعة والمياه',
  'Industrial Electricity': 'الكهرباء الصناعية', 'Building Electricity': 'كهرباء المباني', 'Electronic Devices Maintenance': 'صيانة الأجهزة الإلكترونية',
  'Circuits, testing & repair': 'الدوائر والفحص والإصلاح', 'Mechanics + electronics + control': 'ميكانيكا + إلكترونيات + تحكّم', 'Automation & robotics basics': 'أساسيات الأتمتة والروبوتات',
  'Automotive Technology': 'تقنية السيارات', 'Light vehicles · body repair & paint': 'المركبات الخفيفة · السمكرة والطلاء',
  'Installation & maintenance of AC units': 'تركيب وحدات التكييف وصيانتها', '202 Vocational Efficiency seats (2026–27)': '202 مقعد في الكفايات المهنية (2026–27)',
  'Largest trade intake: 260 seats': 'أكبر قبول بين المهن: 260 مقعدًا', 'Metal fabrication & joining': 'تشكيل المعادن ووصلها',
  'Architectural Drawing': 'الرسم المعماري', 'Interior Design': 'التصميم الداخلي',
  'Specialised Sales & Marketing': 'المبيعات والتسويق المتخصّص', 'Logistics & warehouse management': 'الخدمات اللوجستية وإدارة المستودعات',
  'Plant production · agri-technology': 'الإنتاج النباتي · التقنيات الزراعية', 'Water & wastewater treatment (Saham)': 'معالجة المياه والصرف الصحي (صحم)',
  'Aquaculture · seafood quality': 'الاستزراع السمكي · جودة المأكولات البحرية', 'Marine engines · navigation (Al Khaburah)': 'المحرّكات البحرية · الملاحة (الخابورة)',

  // ---------- 5 · Shinas ----------
  '24.74° N · 56.46° E': '24.74° شمالًا · 56.46° شرقًا', 'Ministry of Labour': 'وزارة العمل',
  'SHINAS': 'شناص', 'LIWA': 'لوى', 'SOHAR': 'صحار', 'SAHAM': 'صحم', 'AL BURAIMI': 'البريمي', 'GULF OF OMAN': 'بحر عُمان', 'UAE': 'الإمارات',

  // ---------- 6 · programmes ----------
  'Shinas · Programs': 'شناص · البرامج', 'Graduates per year': 'الخرّيجون سنويًا', 'NCSI · 2017–2024': 'المركز الوطني للإحصاء · 2017–2024',
  'Engineering projects exhibition': 'معرض المشاريع الهندسية',
  'Vocational Diploma': 'الدبلوم المهني', 'Vocational Efficiency': 'الكفايات المهنية',
  '● Vocational Diploma': '● الدبلوم المهني', '◌ Vocational Efficiency': '◌ الكفايات المهنية',
  'Electronic Devices': 'الأجهزة الإلكترونية', 'Sales & Marketing': 'المبيعات والتسويق', 'Operational Mechanics': 'الميكانيكا التشغيلية',
  'Motors, control panels & industrial wiring': 'المحرّكات ولوحات التحكّم والتمديدات الصناعية', 'Residential & commercial installations': 'التمديدات السكنية والتجارية',
  'Where circuits like our 555 piano are studied': 'هنا تُدرَّس دوائر مثل بيانو 555', 'Sensors, actuators & automation': 'الحسّاسات والمشغّلات والأتمتة',
  'Vocational Efficiency programme': 'برنامج الكفايات المهنية', 'Machines & maintenance': 'الآلات والصيانة', 'Metal fabrication': 'تشكيل المعادن', 'Cooling systems service': 'صيانة أنظمة التبريد',

  // ---------- 7–9 · project, parts, build ----------
  'The Project': 'المشروع', 'Components': 'المكوّنات', 'Original parts list': 'قائمة القطع الأصلية', 'The Build': 'التنفيذ',
  'No soldering': 'دون لحام', 'Tap a key to hear it': 'اضغط مفتاحًا لتسمعه', 'Easy to modify': 'سهل التعديل',
  '9 V Battery': 'بطارية 9 V', '555 Timer': 'مؤقّت 555', 'Speaker': 'مكبّر الصوت', 'Resistor': 'مقاومة', 'Electrolytic cap': 'مكثّف كهروكيميائي',
  'Ceramic cap': 'مكثّف سيراميكي', 'Push button': 'زر ضغط', 'Momentary': 'لحظي', '6F22 · 9 V DC': '6F22 · 9 V تيار مستمر',
  'Powers the circuit': 'تغذّي الدائرة', 'Generates the tone': 'يولّد النغمة', 'Turns signal into sound': 'يحوّل الإشارة إلى صوت', 'Sets the pitch steps': 'تحدّد درجات النغمة',
  'Base of the ladder': 'قاعدة سلّم المقاومات', 'Blocks DC to speaker': 'يحجب التيار المستمر عن المكبّر', 'Steadies pin 5': 'يُثبّت الطرف 5',
  'The timing capacitor': 'مكثّف التوقيت', 'Each key picks a resistance': 'كل مفتاح يختار مقاومة',
  '+9 V feeds pin 8 (VCC) and pin 4 (RESET)': '+9 V تغذّي الطرف 8 (VCC) والطرف 4 (RESET)', 'Sets the switching levels: 6 V and 3 V': 'تحدّد مستويَي التبديل: 6 V و 3 V',
  'Runs in astable (free-running) mode': 'يعمل في الوضع اللامستقر (التذبذب الحر)', 'Outputs a square wave on pin 3': 'يُخرج موجة مربّعة على الطرف 3',
  'Cone moves with each pulse': 'يتحرّك المخروط مع كل نبضة', 'Driven from pin 3 through C3': 'يُغذّى من الطرف 3 عبر C3',
  'R1–R4: the key ladder': 'R1–R4: سلّم المفاتيح', 'R6: R_A, from +9 V to pin 7': 'R6: هي R_A، من +9 V إلى الطرف 7',
  'Bands: brown · black · black · brown': 'الحلقات: بنّي · أسود · أسود · بنّي', 'R5: always in R_B': 'R5: دائمًا ضمن R_B', 'Sets the highest note (S5)': 'تحدّد أعلى نغمة (S5)',
  'Bands: green · brown · black · brown': 'الحلقات: أخضر · بنّي · أسود · بنّي', 'C3: couples pin 3 to the speaker': 'C3: يربط الطرف 3 بالمكبّر',
  'Passes the tone, blocks the DC offset': 'يمرّر النغمة ويحجب الإزاحة المستمرة', 'Polarised: + side to pin 3': 'له قطبية: الطرف + نحو الطرف 3',
  'C2: pin 5 (control) to ground': 'C2: من الطرف 5 (التحكّم) إلى الأرضي', 'Filters noise on the 6 V reference': 'يرشّح الضجيج عن مرجع 6 V',
  'C1: charges 3 V ↔ 6 V': 'C1: يُشحن بين 3 V و 6 V', 'With R_A & R_B it sets the frequency': 'يحدّد التردّد مع R_A و R_B',
  'S1–S5: one per note': 'S1–S5: مفتاح لكل نغمة', 'Pressed → connects a ladder node to C1': 'عند الضغط ← يوصل عقدة من السلّم بـ C1',
  'Output': 'الخرج', 'Power': 'التغذية', 'The brain': 'العقل المدبّر', 'Coupling': 'الربط', 'Timing & filtering': 'التوقيت والترشيح', 'Pitch ladder': 'سلّم النغمات', 'Wiring': 'التوصيلات',
  '8 Ω speaker': 'مكبّر صوت 8 Ω', '9 V battery (6F22)': 'بطارية 9 V (6F22)', '555 timer IC': 'دائرة المؤقّت 555', '10 µF electrolytic': 'مكثّف كهروكيميائي 10 µF',
  'Ceramic capacitors': 'مكثّفات سيراميكية', '6 resistors': '6 مقاومات', 'Power rails': 'خطوط التغذية',
  'Oval speaker, wired by the white leads': 'مكبّر بيضاوي موصول بالسلكين الأبيضين', 'Plays the square-wave tone': 'يعزف نغمة الموجة المربّعة',
  'Red → + rail, blue → − rail': 'الأحمر ← الخط +، الأزرق ← الخط −', 'Feeds the whole breadboard': 'تغذّي لوحة التجارب كلها',
  '8-pin DIP across the centre gap': 'شريحة DIP بثمانية أطراف فوق الفاصل الأوسط', 'Generates the oscillation': 'تولّد التذبذب',
  'C3 between pin 3 and the speaker': 'C3 بين الطرف 3 والمكبّر', 'Mind the polarity': 'انتبه للقطبية',
  'C1 100 nF — timing': 'C1 ‏100 nF — للتوقيت', 'C2 10 nF — pin 5 noise filter': 'C2 ‏10 nF — مرشّح ضجيج الطرف 5',
  '5 × 1 kΩ + 1 × 5.1 kΩ': '5 × 1 kΩ + 1 × 5.1 kΩ', 'Blue metal-film, 5 colour bands': 'غشاء معدني أزرق بخمس حلقات ملوّنة',
  '+ and − rails along the edges': 'خطّا + و − على الحافتين', 'Jumper wires link everything': 'أسلاك التوصيل تربط كل شيء', 'Click to hear this key': 'انقر لسماع هذا المفتاح',

  // ---------- 10 · schematic ----------
  'Circuit Diagram': 'مخطّط الدائرة', 'Frequency': 'التردّد', 'Original diagram': 'المخطّط الأصلي', 'CHARGING': 'شحن', 'DISCHARGING': 'تفريغ',
  'Component': 'مكوّن', 'Speaker · 8 Ω': 'مكبّر الصوت · 8 Ω', 'Battery · 9 V': 'البطارية · 9 V',
  'End of the ladder': 'نهاية السلّم', 'In R_B only for S1 (lowest note)': 'ضمن R_B مع S1 فقط (أخفض نغمة)', 'In R_B for S1 and S2': 'ضمن R_B مع S1 و S2',
  'In R_B for S1 – S3': 'ضمن R_B مع S1 – S3', 'In R_B for S1 – S4': 'ضمن R_B مع S1 – S4', 'Always part of R_B': 'جزء دائم من R_B',
  'Alone it gives the highest note': 'وحدها تعطي أعلى نغمة', 'From +9 V to pin 7': 'من +9 V إلى الطرف 7', 'Only in the charging path': 'في مسار الشحن فقط',
  'Timing capacitor on pins 6 & 2': 'مكثّف التوقيت على الطرفين 6 و 2', 'Swings between 3 V and 6 V': 'يتأرجح جهده بين 3 V و 6 V',
  'Pin 5 to ground': 'من الطرف 5 إلى الأرضي', 'Keeps the 6 V reference quiet': 'يُبقي مرجع 6 V هادئًا', 'Blocks DC from the speaker': 'يحجب التيار المستمر عن المكبّر',
  'Lets the tone pass': 'ويمرّر النغمة', 'Converts the square wave to sound': 'يحوّل الموجة المربّعة إلى صوت',
  '+ rail → pins 8 & 4, R6': 'الخط + ← الطرفان 8 و 4، و R6', '− rail → pin 1 & ground': 'الخط − ← الطرف 1 والأرضي',
  'Astable mode': 'الوضع اللامستقر', 'Pin 3 drives the speaker': 'الطرف 3 يشغّل المكبّر',
  'Live value': 'قيمة مباشرة', 'R_B — the key resistance': 'R_B — مقاومة المفتاح', 'Resistors between pin 7 and the pressed key': 'المقاومات بين الطرف 7 والمفتاح المضغوط',
  'S5 → 5.1 kΩ … S1 → 9.1 kΩ': 'S5 ← 5.1 kΩ … S1 ← 9.1 kΩ', 'Output frequency': 'تردّد الخرج', 'Higher R_B → lower note': 'R_B أكبر ← نغمة أخفض',

  // ---------- 11 · pinout ----------
  'The Brain': 'العقل المدبّر', '8 pins': '8 أطراف', 'Square-wave output': 'خرج بموجة مربّعة',
  'Ground': 'الأرضي', 'Trigger': 'القدح', 'Reset': 'إعادة الضبط', 'Control Voltage': 'جهد التحكّم', 'Threshold': 'العتبة', 'Discharge': 'التفريغ', 'Supply': 'التغذية',
  '0 V reference': 'مرجع 0 V', 'Connected to battery −': 'موصول بالقطب − للبطارية', 'Below ⅓ VCC (3 V) → output HIGH': 'تحت ⅓ VCC ‏(3 V) ← الخرج مرتفع',
  'Wired to C1': 'موصول بـ C1', 'Square wave, 0 ↔ ~9 V': 'موجة مربّعة، 0 ↔ ~9 V', 'Feeds C3 → speaker': 'يغذّي C3 ← المكبّر',
  'Active-low reset': 'إعادة ضبط فعّالة عند المستوى المنخفض', 'Tied to +9 V: always running': 'موصول بـ +9 V: يعمل دائمًا', 'Internal ⅔ VCC reference': 'مرجع داخلي عند ⅔ VCC',
  'Decoupled by C2 (10 nF)': 'مفصول بالمكثّف C2 ‏(10 nF)', 'Above ⅔ VCC (6 V) → output LOW': 'فوق ⅔ VCC ‏(6 V) ← الخرج منخفض',
  'Shorts to ground when output LOW': 'يُقصَر إلى الأرضي عندما يكون الخرج منخفضًا', 'Drains C1 through R_B': 'يفرّغ C1 عبر R_B',
  '+9 V from the battery': '+9 V من البطارية', 'NE555 range: 4.5 – 16 V': 'مدى NE555: ‏4.5 – 16 V',

  // ---------- 12 · astable ----------
  'How it oscillates': 'كيف يتذبذب', 'Slow motion': 'حركة بطيئة', 'C1 voltage': 'جهد C1', 'Output · pin 3': 'الخرج · الطرف 3',
  'HIGH': 'مرتفع', 'LOW': 'منخفض', 'OFF': 'مُطفأ', 'ON': 'يعمل', 'DISCHARGE': 'التفريغ', 'FLIP': 'قلّاب', 'FLOP': 'SR',
  'CHARGING ↑': 'شحن ↑', 'DISCHARGING ↓': 'تفريغ ↓', 'Output HIGH': 'الخرج مرتفع', 'Output LOW': 'الخرج منخفض',
  'Inside the 555': 'داخل المؤقّت 555', 'Voltage divider': 'مقسّم الجهد', 'Three equal 5 kΩ resistors': 'ثلاث مقاومات متساوية 5 kΩ',
  'Make the ⅔ VCC (6 V) and ⅓ VCC (3 V) references': 'تصنع مرجعَي ⅔ VCC ‏(6 V) و ⅓ VCC ‏(3 V)',
  'Threshold comparator': 'مقارِن العتبة', 'Fires when C1 rises above 6 V': 'ينشط عندما يتجاوز جهد C1 قيمة 6 V', 'Resets the flip-flop → output LOW': 'يُعيد ضبط القلّاب ← الخرج منخفض',
  'Trigger comparator': 'مقارِن القدح', 'Fires when C1 falls below 3 V': 'ينشط عندما ينخفض جهد C1 تحت 3 V', 'Sets the flip-flop → output HIGH': 'يضبط القلّاب ← الخرج مرتفع',
  'SR flip-flop': 'القلّاب SR', '1-bit memory of the state': 'ذاكرة من بت واحد للحالة', 'Remembers: charging or discharging': 'يتذكّر: شحن أم تفريغ',
  'Output stage': 'مرحلة الخرج', 'Buffers the flip-flop to pin 3': 'تنقل حالة القلّاب إلى الطرف 3', 'Can drive a small speaker': 'تستطيع تشغيل مكبّر صغير',
  'Discharge transistor': 'ترانزستور التفريغ', 'ON when output is LOW': 'يعمل عندما يكون الخرج منخفضًا', 'Pin 7 to ground → C1 drains through R_B': 'الطرف 7 إلى الأرضي ← يتفرّغ C1 عبر R_B',

  // ---------- 13 · frequency ----------
  'The Math': 'المعادلة', 'Try C1': 'جرّب C1', 'FREQUENCY (Hz)': 'التردّد (Hz)', 'click to hear': 'انقر للاستماع',
  'f — frequency': 'f — التردّد', 'Tones per second, in hertz (Hz)': 'عدد الاهتزازات في الثانية، بالهرتز (Hz)', 'Our keys: ≈ 750 Hz → 1.29 kHz': 'مفاتيحنا: ≈ 750 Hz ← 1.29 kHz',
  'Fixed': 'ثابتة', 'R_A = R6 = 1 kΩ': 'R_A = R6 = 1 kΩ', 'Between +9 V and pin 7': 'بين +9 V والطرف 7', 'Only used while C1 charges': 'تعمل فقط أثناء شحن C1',
  'Changes per key': 'تتغيّر مع كل مفتاح', 'Set by which button is pressed': 'يحدّدها الزر المضغوط', 'Used for both charge & discharge': 'تُستخدم في الشحن والتفريغ معًا',
  'C = C1 = 100 nF': 'C = C1 = 100 nF', '1.44 ≈ 1 / ln 2': '1.44 ≈ 1 / ln 2',

  // ---------- 14 · piano ----------
  'Live Demo': 'عرض حيّ', 'Tap a key or press 1–5': 'اضغط مفتاحًا أو الأرقام 1–5', 'OSCILLOSCOPE · speaker signal': 'راسم الإشارة · إشارة المكبّر', 'idle': 'في الانتظار',

  // ---------- 15 · skills ----------
  'Why it matters': 'لماذا يهمّ ذلك',
  'Read schematics': 'قراءة المخطّطات', 'Build & wire': 'التركيب والتوصيل', 'Calculate': 'الحساب', 'Test & debug': 'الفحص وتتبّع الأعطال', 'Present': 'العرض والتقديم',
  'Symbols, nodes & signal paths': 'الرموز والعُقد ومسارات الإشارة', 'From paper to real wiring': 'من الورق إلى التوصيل الفعلي', 'Breadboard layout': 'ترتيب لوحة التجارب',
  'Polarity & pin orientation': 'القطبية واتجاه الأطراف', 'Predict each frequency': 'توقّع كل تردّد', 'Choose R & C values': 'اختيار قيم R و C',
  'Multimeter checks': 'القياس بالملتيميتر', 'Find & fix faults step by step': 'اكتشاف الأعطال وإصلاحها خطوة بخطوة', 'Explain how it works': 'شرح آلية العمل', 'Teamwork & communication': 'العمل الجماعي والتواصل',

  // ---------- hover cards (data.js TIPS) ----------
  'Governance': 'الحوكمة', 'Directorate General of Vocational Colleges': 'المديرية العامة للكليات المهنية', 'Until 2020: Ministry of Manpower': 'حتى 2020: وزارة القوى العاملة',
  '2020–2024: Ministry of Higher Education': '2020–2024: وزارة التعليم العالي', 'Royal Decree 61/2024 → Ministry of Labour': 'المرسوم السلطاني 61/2024 ← وزارة العمل',
  'Method': 'المنهج', 'Learning by doing': 'التعلّم بالممارسة', 'Over 85% of programme content is practical': 'أكثر من 85% من محتوى البرامج عملي',
  'Real workshops & labs for every trade': 'ورش ومختبرات حقيقية لكل مهنة', 'Industry visits and partnerships': 'زيارات وشراكات مع القطاع الصناعي', 'Source: Al Wisal, 2026': 'المصدر: الوصال، 2026',
  'Pathways': 'المسارات', 'Two ways in': 'مساران للالتحاق', 'Vocational Diploma — for General Education Diploma holders': 'الدبلوم المهني — لحمَلة دبلوم التعليم العام',
  'Vocational Efficiency — Level 1 & 2, for Grade 10/11 job-seekers': 'الكفايات المهنية — المستويان 1 و 2، للباحثين عن عمل من الصفين 10 و 11',
  'Aligned with the Oman Qualifications Framework': 'متوافقة مع الإطار الوطني العُماني للمؤهلات',
  'Diploma seats filled 2026/27': 'مقعدًا في الدبلوم 2026/27', 'Efficiency seats 2026/27': 'مقعدًا في الكفايات 2026/27',
  'Network': 'الشبكة', '7 + 1 colleges': '7 + 1 كليات', '7 Vocational Colleges': '7 كليات مهنية', '1 Vocational College for Marine Sciences': 'كلية مهنية واحدة للعلوم البحرية',
  'Renamed from training centres in 2017 (Decision 406/2017)': 'تحوّلت من مراكز تدريب إلى كليات عام 2017 (القرار 406/2017)',
  'Training': 'التدريب', '85%+ practical': 'أكثر من 85% عملي', 'Most learning happens in workshops': 'معظم التعلّم يجري في الورش', 'Skills employers can use from day one': 'مهارات يستفيد منها أصحاب العمل من اليوم الأول',
  'Outcomes': 'المخرجات', 'Graduates': 'الخرّيجون', '2026: more than 1,400 graduates': '2026: أكثر من 1,400 خرّيج', 'May 2025 cohort: 1,166 graduates': 'دفعة مايو 2025: ‏1,166 خرّيجًا',
  'Male (2025)': 'ذكور (2025)', 'Female (2025)': 'إناث (2025)',
  'Programmes': 'البرامج', '16 specialisations': '16 تخصّصًا', 'Engineering · business · construction': 'الهندسة · الأعمال · البناء', 'Agriculture & water · marine sciences': 'الزراعة والمياه · العلوم البحرية',
  'Development plan 2026–30': 'خطة التطوير 2026–30', 'RO 20M': '20 مليون ر.ع',
  'Step 1': 'الخطوة 1', 'General Education Diploma holders → Vocational Diploma': 'حمَلة دبلوم التعليم العام ← الدبلوم المهني',
  'Grade 10/11 job-seekers → Vocational Efficiency': 'الباحثون عن عمل من الصفين 10 و 11 ← الكفايات المهنية', 'Admission via the Unified Admission Centre': 'القبول عبر مركز القبول الموحّد',
  'Step 4': 'الخطوة 4', 'Into the workforce': 'إلى سوق العمل', 'Graduates join industry & services': 'ينضمّ الخرّيجون إلى الصناعة والخدمات',
  'e.g. a Shinas graduate at National Gas Company': 'مثل خرّيج من شناص يعمل في الشركة الوطنية للغاز', 'Supports Oman Vision 2040': 'تدعم رؤية عُمان 2040',
  'Location': 'الموقع', 'Al Aqar, Shinas': 'العقر، شناص', 'North Al Batinah Governorate': 'محافظة شمال الباطنة', 'P.O. Box 482, Postcode 324': 'ص.ب 482، الرمز البريدي 324',
  'Not to be confused with UTAS-Shinas': 'وهي غير جامعة التقنية والعلوم التطبيقية بشناص',
  'History': 'النشأة', 'From centre to college': 'من مركز إلى كلية', 'Began as Shinas Vocational Training Centre': 'بدأت باسم مركز التدريب المهني بشناص',
  'Operating as a centre by 2011': 'تعمل مركزًا منذ 2011', 'Became a college in 2017 (Decision 406/2017)': 'أصبحت كلية عام 2017 (القرار 406/2017)',
  'Strength': 'نقطة القوة', 'Industrial & Building Electricity': 'الكهرباء الصناعية وكهرباء المباني', 'Electrical core': 'تخصّصات كهربائية في الصميم',
  'Achievement': 'إنجاز', 'Engineering projects exhibition organised by the college': 'معرض للمشاريع الهندسية تنظّمه الكلية',
  'Held at Liwa Science & Innovation Centre': 'أُقيم في مركز لوى للعلوم والابتكار', 'Joined by UTAS-Sohar · covered by Oman TV': 'بمشاركة جامعة التقنية بصحار · وتغطية تلفزيون عُمان',
};

// Templated strings
const RULES = [
  [/^Key (\d)$/, 'المفتاح $1'], [/^Skill (\d)$/, 'المهارة $1'], [/^Pin (\d) · (\w+)$/, 'الطرف $1 · $2'],
  [/^Period ([\d.]+) ms · duty (\d+)%$/, 'الزمن الدوري $1 ms · دورة العمل $2%'],
  [/^≈ (\S+) \(([+-]?\d+) cents\)$/, '≈ $1 ($2 سنت)'],
  [/^Slow motion ×(\d+) · real period ([\d.]+) ms$/, 'حركة بطيئة ×$1 · الزمن الدوري الفعلي $2 ms'],
  [/^- - -  average (\d+)$/, '- - -  المتوسط $1'],
];

const LATIN = /[A-Za-z]/;
export let lang = 'en';
const listeners = [];
export const onLang = fn => listeners.push(fn);

function lookup(s) {
  if (s in AR) return AR[s];
  for (const [re, out] of RULES) if (re.test(s)) return s.replace(re, out);
  if (s.includes(' · ')) { // translate each part of "a · b" labels
    const parts = s.split(' · '), tr = parts.map(p => (p in AR ? AR[p] : p));
    if (tr.some((p, i) => p !== parts[i])) return tr.join(' · ');
  }
  return null;
}
// keep "1 kΩ", "+9 V", "1.05 ms" in reading order inside Arabic sentences
const UNIT = /\+?\d[\d.,]*\s?(?:kΩ|Ω|nF|µF|kHz|Hz|ms|V)(?![A-Za-z])/g;
const iso = s => s.replace(UNIT, m => '⁦' + m + '⁩');
export function t(s) {
  if (lang !== 'ar' || typeof s !== 'string' || !LATIN.test(s)) return s;
  const r = lookup(s.trim());
  return iso(r == null ? s : r);
}

/* ---------- DOM ---------- */
const root = () => document.getElementById('stage');
function trNode(n) {
  if (n.__ar === n.data) return; // already ours
  const raw = n.data, key = raw.trim();
  if (!key || !LATIN.test(key)) return;
  const lk = lookup(key), r = iso(lk == null ? key : lk); if (r === key) return;
  n.__en = raw; n.__ar = raw.replace(key, r); n.data = n.__ar;
}
function walk(el) {
  if (el.nodeType === 3) return trNode(el);
  if (el.nodeType !== 1 || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
  if (el.dataset?.ar != null && el.__enHTML == null) { el.__enHTML = el.innerHTML; el.innerHTML = el.dataset.ar; }
  for (const c of el.childNodes) walk(c);
}
function unwalk(el) {
  if (el.nodeType === 3) { if (el.__ar != null && el.data === el.__ar) el.data = el.__en; el.__ar = null; return; }
  if (el.nodeType !== 1) return;
  if (el.__enHTML != null) { el.innerHTML = el.__enHTML; el.__enHTML = null; return; }
  for (const c of el.childNodes) unwalk(c);
}
const mo = new MutationObserver(muts => {
  if (lang !== 'ar') return;
  for (const m of muts) {
    if (m.type === 'characterData') trNode(m.target);
    else m.addedNodes.forEach(walk);
  }
});

const TITLE = { en: document.title, ar: 'من المهارة إلى الصوت — الكليات المهنية العُمانية وبيانو 555' };
export function setLang(l) {
  lang = l === 'ar' ? 'ar' : 'en';
  const html = document.documentElement;
  html.lang = lang; document.body.classList.toggle('lang-ar', lang === 'ar');
  document.title = TITLE[lang];
  if (lang === 'ar') { walk(root()); mo.observe(root(), { subtree: true, childList: true, characterData: true }); document.fonts?.load('700 40px Kufi'); }
  else { mo.disconnect(); unwalk(root()); }
  document.querySelectorAll('#langBtn [data-l]').forEach(s => s.classList.toggle('on', s.dataset.l === lang));
  try { localStorage.setItem('deck-lang', lang); } catch (e) {}
  listeners.forEach(fn => fn(lang));
}
export function initLang() {
  const btn = document.getElementById('langBtn');
  btn?.addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar'));
  let saved = null; try { saved = localStorage.getItem('deck-lang'); } catch (e) {}
  const q = new URLSearchParams(location.search).get('lang');
  setLang(q || saved || 'en');
}
