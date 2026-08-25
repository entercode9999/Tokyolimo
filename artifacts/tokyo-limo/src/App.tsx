import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowUpRight,
  Check,
  Clock3,
  Headphones,
  MapPin,
  Menu,
  Plus,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import './index.css';

type Locale = 'en' | 'ja';
type QuoteFields = {
  name: string;
  email: string;
  service: string;
  date: string;
  passengers: string;
  notes: string;
};

const initialQuote: QuoteFields = {
  name: '',
  email: '',
  service: 'airport',
  date: '',
  passengers: 'small',
  notes: '',
};

const content = {
  en: {
    nav: { services: 'Services', fleet: 'Fleet', standard: 'Our standard', faq: 'FAQ', quote: 'Request a quote' },
    hero: {
      eyebrow: 'Tokyo · Haneda · Narita · 24/7',
      titleA: 'Arrive',
      titleB: 'assured.',
      copy: 'Private airport transportation for international travelers. A calm chauffeur, a clear pickup plan and a warm welcome from runway to hotel.',
      quote: 'Request a quote',
      explore: 'Explore services',
      support: 'English and Japanese support available',
      meta: [['24 / 7', 'Tokyo operations'], ['Flat rate', 'No surprises'], ['EN · JA', 'Bilingual support']],
    },
    form: {
      title: 'Plan the ride.',
      sub: 'Tell us about your airport pickup or Tokyo itinerary. We will reply with a clear recommendation.',
      name: 'Your name',
      namePh: 'First and last name',
      email: 'Email',
      emailPh: 'you@company.com',
      service: 'Service',
      date: 'Preferred date',
      party: 'Party size',
      notes: 'Anything we should know?',
      optional: '(optional)',
      notesPh: 'Flight number, terminal, luggage, timing...',
      submit: 'Get my exact quote',
      note: 'No obligation · We reply within one business hour',
      required: 'Please add your name, email and preferred date.',
      emailError: 'Please check the email address and try again.',
      successTitle: 'We have your route.',
      successBody: 'Thank you, {name}. A Tokyo Limo coordinator will reply to {email} shortly with availability and a clear, all-in quote.',
      again: 'Start another request',
      services: [
        ['airport', 'Airport transfer'],
        ['corporate', 'Corporate travel'],
        ['event', 'Wedding or event'],
        ['hourly', 'Hourly charter'],
        ['tour', 'Tour or group travel'],
        ['city', 'City-to-city transfer'],
      ],
      passengers: [['small', '1–3 guests'], ['medium', '4–5 guests'], ['group', '6–13 guests'], ['large', '14+ guests']],
    },
    trust: {
      lead: 'A better way<br />through Tokyo.',
      items: [['Always on time', 'down to the minute'], ['Clear rates', 'before you ride'], ['Local expertise', 'international ease']],
    },
    standard: { eyebrow: 'Our standard / 01', jp: '静かに、正確に。', titleA: 'The city moves quickly.', titleB: "We don't have to.", copy: 'Tokyo Limo is a private car service built around the details that make a journey feel effortless: a clean cabin, a driver who knows the city, and a plan that holds even when the day changes.' },
    services: {
      eyebrow: 'One service / many reasons',
      title: 'Wherever the day<br />takes you.',
      copy: 'From a first arrival at Haneda to the last guest leaving your reception, we make the in-between feel considered.',
      cards: [
        ['01 / ARRIVE', 'Airport transfers', 'Haneda and Narita, met with a name board and a quiet ride into the city.'],
        ['02 / MOVE', 'Business travel', 'A composed mobile office for executives, assistants and visiting teams.'],
        ['03 / MARK', 'Weddings & events', 'Precise arrivals, discreet coordination and room for the people who matter.'],
        ['04 / STAY', 'Hourly charter', 'Keep a dedicated car close for meetings, shopping, dinners or a full day out.'],
        ['05 / SEE', 'Tours & groups', 'From Tokyo to Hakone, travel farther with a Sprinter for the whole party.'],
      ],
    },
    promise: {
      eyebrow: 'The Tokyo Limo promise / 02',
      titleA: 'A clear plan',
      titleB: 'feels good.',
      copy: 'Your quote is built around your actual itinerary, not a meter. See the fare, vehicle and timing before you commit — then let us handle the road.',
      list: ['Flat-rate pricing, agreed in advance', 'Complimentary flight monitoring', 'A real person on call, day or night'],
      cta: 'Build my itinerary',
      stamp: ['0', 'surprises', 'in your fare'],
    },
    fleet: {
      eyebrow: 'The fleet / 03',
      title: 'Quietly capable.',
      selected: 'Selected vehicle',
      capacity: 'Capacity',
      luggage: 'Luggage',
      tabs: [['executive', 'Sedan'], ['firstclass', 'MPV'], ['group', 'Sprinter']],
      vehicles: {
        executive: ['Executive sedan', 'For one to three guests who value a quiet cabin, generous legroom and an unhurried arrival.', '1–3 guests', '2 large cases'],
        firstclass: ['First-class MPV', 'A private lounge on the move. Ideal for families, principals and airport days with more luggage.', '1–5 guests', '4 large cases'],
        group: ['Sprinter group', 'Keep the conversation together. A spacious, polished solution for teams, weddings and tours.', '6–13 guests', 'Up to 13 cases'],
      },
      compare: [['Best for', 'Solo arrivals, executives'], ['Cabin feel', 'Quiet and discreet'], ['Booking help', 'Vehicle matched to your route']],
    },
    airport: { eyebrow: 'From runway to ryokan', title: 'Your first hour<br />in Tokyo, handled.', copy: 'Meet us at Haneda or Narita. We watch the flight, guide the luggage and take the city at your pace.', cta: 'Arrange airport pickup' },
    routes: {
      eyebrow: 'Airport routes / 05',
      title: 'From the terminal<br />to your door.',
      copy: 'Door-to-door transfers across Tokyo, with route planning for the places international visitors ask for most.',
      cards: [['HND', 'Haneda → Central Tokyo', 'Shinjuku · Shibuya · Ginza · Tokyo Station'], ['NRT', 'Narita → Tokyo', 'City centre · Disney Resort · Yokohama'], ['HND / NRT', 'Airport → Hakone', 'A comfortable start to your onsen stay'], ['TOKYO', 'Tokyo → Yokohama', 'Meetings, hotels and cruise terminals']],
    },
    process: { eyebrow: 'How it works / 04', title: 'Simple by design.', copy: 'No app to learn. No queue to join. Just one thoughtful conversation, followed by a service that remembers the details.', steps: [['01', 'Tell us the plan.', 'Send your route, timing and the little details that matter to you.'], ['02', 'We make it clear.', 'Receive a precise quote and a considered vehicle recommendation.'], ['03', 'Enjoy the quiet.', 'Your chauffeur arrives early, prepared and ready to adapt.']] },
    testimonial: { eyebrow: 'A note from the road', quote: 'The rare service that makes a complicated Tokyo week feel like it has more hours in it.', cite: 'Elena M. · Executive assistant, London' },
    faq: { eyebrow: 'Good to know / 06', title: 'The small<br />assurances.', more: 'Still have a question? Our coordinators can help in English or Japanese.', items: [['How far in advance should I book?', 'For airport and city transfers, 24 hours is usually enough. For weddings, events and multi-day itineraries, we recommend securing your vehicle two to four weeks ahead.'], ['Do you monitor my flight?', 'Yes. Share your flight number in the quote notes and our operations team will track the arrival, adjust the pickup timing and be ready when you are.'], ['What is included in the quoted fare?', 'Your quoted fare includes the vehicle, professional chauffeur, fuel, tolls on the agreed route and a 15-minute arrival wait. There are no surprise surcharges.'], ['Can you arrange child seats or meet-and-greet?', 'Absolutely. Tell us what you need in the notes field and we will confirm the right child seat, name board or terminal meeting point with your itinerary.']] },
    footer: { title: 'Take the<br />scenic route.', copy: 'Private chauffeur service for Tokyo, its airports and the places worth going a little farther for.', explore: 'Explore', reach: 'Reach us', area: 'Service area', edit: 'Editable contact details', places: ['Tokyo 23 wards', 'Haneda · Narita', 'Yokohama · Hakone', 'City-to-city on request'], bottom: '© 2025 Tokyo Limo. Private transportation, thoughtfully arranged.' },
  },
  ja: {
    nav: { services: 'サービス', fleet: '車両', standard: '私たちの基準', faq: 'よくある質問', quote: '見積もりを依頼' },
    hero: {
      eyebrow: '東京 · 羽田 · 成田 · 24時間',
      titleA: '安心して',
      titleB: '東京へ。',
      copy: '海外からのお客様のための空港送迎。到着便を確認し、ネームボードでお迎えし、ホテルまで落ち着いた時間をお届けします。',
      quote: '見積もりを依頼',
      explore: 'サービスを見る',
      support: '英語・日本語でサポートいたします',
      meta: [['24時間', '東京オペレーション'], ['定額料金', '追加料金なし'], ['EN · JA', 'バイリンガル対応']],
    },
    form: {
      title: 'ご移動の相談。',
      sub: '空港送迎や東京でのご予定をお聞かせください。最適なプランを明確にご案内します。',
      name: 'お名前',
      namePh: '姓 名',
      email: 'メールアドレス',
      emailPh: 'you@company.com',
      service: 'ご希望のサービス',
      date: 'ご利用希望日',
      party: '人数',
      notes: 'お知らせください',
      optional: '（任意）',
      notesPh: '便名、ターミナル、荷物、時間など',
      submit: '正確な見積もりを見る',
      note: 'ご依頼は無料 · 1営業時間以内に返信',
      required: 'お名前、メールアドレス、ご利用希望日をご入力ください。',
      emailError: 'メールアドレスをご確認のうえ、もう一度お試しください。',
      successTitle: 'ご予定を承りました。',
      successBody: '{name}様、ありがとうございます。{email}へ空き状況と明確な料金を担当者よりお送りします。',
      again: '別の依頼を作成',
      services: [['airport', '空港送迎'], ['corporate', 'ビジネス利用'], ['event', 'ウェディング・イベント'], ['hourly', '時間貸しチャーター'], ['tour', '観光・グループ'], ['city', '都市間送迎']],
      passengers: [['small', '1～3名'], ['medium', '4～5名'], ['group', '6～13名'], ['large', '14名以上']],
    },
    trust: { lead: '東京をもっと<br />心地よく。', items: [['時間に正確', '分単位で対応'], ['明朗な料金', 'ご乗車前に確定'], ['土地の知識', '海外のお客様にも安心']] },
    standard: { eyebrow: '私たちの基準 / 01', jp: '静かに、正確に。', titleA: '東京は速く動く。', titleB: '私たちは、急がせません。', copy: '清潔な車内、街を知り尽くした乗務員、予定変更にも対応できる計画。旅を心地よくする細部を大切にした、東京のハイヤーサービスです。' },
    services: { eyebrow: 'ひとつのサービス / 多彩な用途', title: '一日の行き先へ<br />丁寧に。', copy: '羽田での最初のお迎えから、パーティーの最後のお見送りまで。移動の時間も心地よく整えます。', cards: [['01 / ARRIVE', '空港送迎', '羽田・成田でネームボードを持ってお迎えし、静かな車内で都心へ。'], ['02 / MOVE', 'ビジネス利用', 'エグゼクティブやご出張チームのための、落ち着いた移動オフィス。'], ['03 / MARK', 'ウェディング・イベント', '正確な送迎と控えめな進行。大切な方々を安心してお任せください。'], ['04 / STAY', '時間貸しチャーター', '会議、ショッピング、会食、終日のご予定まで専用車で。'], ['05 / SEE', '観光・グループ', '東京から箱根まで、グループ全員で快適にお出かけいただけます。']] },
    promise: { eyebrow: 'Tokyo Limoの約束 / 02', titleA: '明確な計画は', titleB: '心を軽くします。', copy: 'メーターではなく、実際の行程に合わせてお見積もりします。料金、車両、時間を事前に確認してから、道中は私たちにお任せください。', list: ['事前に確定する定額料金', 'フライトの到着状況を無料で確認', '昼夜を問わず担当者が対応'], cta: '行程を相談する', stamp: ['0', '料金の', 'サプライズ'] },
    fleet: { eyebrow: '車両 / 03', title: '静かな実力。', selected: '選択中の車両', capacity: '定員', luggage: '荷物', tabs: [['executive', 'セダン'], ['firstclass', 'MPV'], ['group', 'スプリンター']], vehicles: { executive: ['エグゼクティブ・セダン', '1～3名様に。静かな車内、ゆとりある足元、余裕のある到着をお約束します。', '1～3名', '大型2個'], firstclass: ['ファーストクラスMPV', '移動するプライベートラウンジ。ご家族やお荷物の多い空港送迎に最適です。', '1～5名', '大型4個'], group: ['スプリンター・グループ', '会話をひとつに。チーム、ウェディング、観光にゆとりある一台です。', '6～13名', '最大13個'] }, compare: [['おすすめ', '空港到着、役員送迎'], ['車内の雰囲気', '静かで控えめ'], ['ご予約時', '行程に合わせてご提案']] },
    airport: { eyebrow: '空港から旅館まで', title: '東京での最初の一時間を<br />私たちに。', copy: '羽田・成田でお待ちしています。フライトを確認し、荷物をお手伝いしながら、お客様のペースで街へ向かいます。', cta: '空港送迎を相談する' },
    routes: { eyebrow: '空港ルート / 05', title: 'ターミナルから<br />目的地まで。', copy: '海外からのお客様に人気のルートを中心に、東京のホテルや周辺都市までドア・ツー・ドアでご案内します。', cards: [['HND', '羽田 → 東京中心部', '新宿 · 渋谷 · 銀座 · 東京駅'], ['NRT', '成田 → 東京', '都心 · 舞浜 · 横浜'], ['HND / NRT', '空港 → 箱根', '温泉宿での滞在を心地よく始める'], ['TOKYO', '東京 → 横浜', 'ホテル、会議、クルーズターミナル']] },
    process: { eyebrow: 'ご利用の流れ / 04', title: 'シンプルに、丁寧に。', copy: 'アプリも待ち行列も必要ありません。一度のご相談から、細部まで覚えているサービスをお届けします。', steps: [['01', '予定をお聞かせください。', 'ルート、時間、ご希望の細部をお送りください。'], ['02', '明確にご案内します。', '正確な見積もりと、最適な車両をご提案します。'], ['03', '静かな時間をどうぞ。', '乗務員が早めに到着し、準備を整えてお待ちします。']] },
    testimonial: { eyebrow: 'お客様の声', quote: '複雑な東京出張にも、時間にゆとりが生まれたように感じました。', cite: 'Elena M. · エグゼクティブアシスタント、ロンドン' },
    faq: { eyebrow: 'ご利用前に / 06', title: '小さな安心を、<br />ひとつずつ。', more: 'ご不明な点は、英語・日本語の担当者へお気軽にご相談ください。', items: [['何日前までに予約すればよいですか？', '空港送迎・市内送迎は通常24時間前までで承ります。ウェディング、イベント、複数日程のご利用は2～4週間前のご予約をおすすめします。'], ['フライトの到着を確認してもらえますか？', 'はい。見積もりの備考欄に便名をお知らせください。到着状況を確認し、お迎え時間を調整してお待ちします。'], ['見積もり料金に含まれるものは？', '車両、プロの乗務員、燃料、合意したルートの通行料、到着後15分の待機を含みます。予想外の追加料金はありません。'], ['チャイルドシートやミート＆グリートは手配できますか？', 'もちろんです。備考欄にご希望をお書きください。チャイルドシート、ネームボード、ターミナル内のお待ち合わせ場所を確認します。']] },
    footer: { title: '少し遠回りの<br />東京へ。', copy: '東京と空港、そして少し足を延ばしたい場所へ。心を配したプライベート送迎です。', explore: 'メニュー', reach: 'お問い合わせ', area: 'サービスエリア', edit: '連絡先は編集可能です', places: ['東京23区', '羽田 · 成田', '横浜 · 箱根', '都市間送迎（要相談）'], bottom: '© 2025 Tokyo Limo. 心を配したプライベート送迎。' },
  },
} as const;

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Brand() {
  return <a href="#top" className="brand" data-testid="link-brand"><span className="brand-mark"><span>T</span></span><span className="brand-copy"><span className="brand-name">TOKYO LIMO</span><span className="brand-tagline">private transportation</span></span></a>;
}

function Navigation({ locale, setLocale }: { locale: Locale; setLocale: (locale: Locale) => void }) {
  const [open, setOpen] = useState(false);
  const t = content[locale];
  const links = [[t.nav.services, '#services'], [t.nav.fleet, '#fleet'], [t.nav.standard, '#standard'], [t.nav.faq, '#faq']];
  return <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
    <Brand />
    <div className="nav-links">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} data-testid={`link-nav-${href.slice(1)}`}>{label}</a>)}</div>
    <div className="nav-contact">
      <div className="language-switch" role="group" aria-label="Language">
        <button className={locale === 'en' ? 'active' : ''} onClick={() => setLocale('en')} aria-pressed={locale === 'en'} data-testid="button-language-en">EN</button>
        <button className={locale === 'ja' ? 'active' : ''} onClick={() => setLocale('ja')} aria-pressed={locale === 'ja'} data-testid="button-language-ja">日本語</button>
      </div>
      <a className="nav-phone" href="tel:+81300000000" data-testid="link-nav-phone">+81 3 0000 0000</a>
      <a className="button primary" href="#quote" onClick={() => setOpen(false)} data-testid="link-nav-quote">{t.nav.quote} <ArrowUpRight size={14} /></a>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
    </div>
  </nav>;
}

function QuoteForm({ locale }: { locale: Locale }) {
  const t = content[locale].form;
  const [fields, setFields] = useState<QuoteFields>(initialQuote);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const update = (key: keyof QuoteFields, value: string) => setFields((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fields.name.trim() || !fields.email.trim() || !fields.date) { setError(t.required); return; }
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) { setError(t.emailError); return; }
    setError('');
    setSubmitted(true);
  };
  const firstName = fields.name.split(' ')[0] || fields.name;
  return <div className="quick-quote" id="quote">
    {!submitted ? <><div className="quick-quote-head"><h2>{t.title}</h2><span className="quote-number">TL / 001</span></div><p className="quick-quote-sub">{t.sub}</p>
      <form onSubmit={submit} noValidate><div className="form-grid">
        <div className="field"><label htmlFor="quote-name">{t.name}</label><input id="quote-name" value={fields.name} onChange={(e) => update('name', e.target.value)} placeholder={t.namePh} data-testid="input-quote-name" /></div>
        <div className="field"><label htmlFor="quote-email">{t.email}</label><input id="quote-email" type="email" value={fields.email} onChange={(e) => update('email', e.target.value)} placeholder={t.emailPh} data-testid="input-quote-email" /></div>
        <div className="field full"><label htmlFor="quote-service">{t.service}</label><select id="quote-service" value={fields.service} onChange={(e) => update('service', e.target.value)} data-testid="select-quote-service">{t.services.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        <div className="field"><label htmlFor="quote-date">{t.date}</label><input id="quote-date" type="date" value={fields.date} onChange={(e) => update('date', e.target.value)} data-testid="input-quote-date" /></div>
        <div className="field"><label htmlFor="quote-passengers">{t.party}</label><select id="quote-passengers" value={fields.passengers} onChange={(e) => update('passengers', e.target.value)} data-testid="select-quote-passengers">{t.passengers.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        <div className="field full"><label htmlFor="quote-notes">{t.notes} <span>{t.optional}</span></label><textarea id="quote-notes" value={fields.notes} onChange={(e) => update('notes', e.target.value)} placeholder={t.notesPh} data-testid="textarea-quote-notes" /></div>
      </div>{error && <p className="form-error" role="alert" data-testid="status-quote-error">{error}</p>}<button className="button dark" type="submit" data-testid="button-submit-quote">{t.submit} <ArrowUpRight size={14} /></button><p className="form-note">{t.note}</p></form></>
      : <div className="success" role="status" data-testid="status-quote-success"><div className="success-icon"><Check size={22} /></div><h3>{t.successTitle}</h3><p>{t.successBody.replace('{name}', firstName).replace('{email}', fields.email)}</p><button className="button dark" onClick={() => { setSubmitted(false); setFields(initialQuote); }} data-testid="button-new-quote">{t.again}</button></div>}
  </div>;
}

function ServiceCard({ card, index }: { card: readonly [string, string, string]; index: number }) {
  return <article className="service-card" data-testid={`card-service-${index + 1}`}><span className="service-index">{card[0]}</span><ArrowUpRight className="service-arrow" size={20} /><h3>{card[1]}</h3><p>{card[2]}</p></article>;
}

function Fleet({ locale }: { locale: Locale }) {
  const t = content[locale].fleet;
  const [active, setActive] = useState<'executive' | 'firstclass' | 'group'>('executive');
  const vehicle = t.vehicles[active];
  return <section className="fleet section-pad" id="fleet"><div className="container"><Reveal className="fleet-top"><div><span className="eyebrow">{t.eyebrow}</span><h2 className="display">{t.title}</h2></div><div className="fleet-tabs" role="tablist" aria-label="Fleet types">{t.tabs.map(([key, label]) => <button className={`fleet-tab ${active === key ? 'active' : ''}`} key={key} onClick={() => setActive(key as typeof active)} role="tab" aria-selected={active === key} data-testid={`button-fleet-${key}`}>{label}</button>)}</div></Reveal>
    <Reveal><div className="fleet-content" data-testid="panel-fleet-details"><div className="fleet-visual" aria-label={`${vehicle[0]} vehicle illustration`}><div className="fleet-car" /></div><div className="fleet-spec"><span className="eyebrow light">{t.selected}</span><h3 className="display">{vehicle[0]}</h3><p>{vehicle[1]}</p><div className="specs"><div><span>{t.capacity}</span><strong>{vehicle[2]}</strong></div><div><span>{t.luggage}</span><strong>{vehicle[3]}</strong></div></div></div></div></Reveal>
    <div className="fleet-compare">{t.compare.map(([label, value]) => <div className="compare-note" key={label}><strong>{label}</strong><span>{value}</span></div>)}</div>
  </div></section>;
}

function FAQ({ locale }: { locale: Locale }) {
  const t = content[locale].faq;
  const [active, setActive] = useState(0);
  return <section className="faq section-pad" id="faq"><div className="container faq-layout"><Reveal><span className="eyebrow">{t.eyebrow}</span><h2 className="display" dangerouslySetInnerHTML={{ __html: t.title }} /><p className="faq-more">{t.more}</p></Reveal><Reveal className="faq-list">{t.items.map(([question, answer], index) => { const isOpen = active === index; return <div className="faq-item" key={question}><button className={`faq-question ${isOpen ? 'open' : ''}`} onClick={() => setActive(isOpen ? -1 : index)} aria-expanded={isOpen} data-testid={`button-faq-${index + 1}`}><span>{question}</span><Plus size={18} /></button>{isOpen && <div className="faq-answer" data-testid={`text-faq-answer-${index + 1}`}>{answer}</div>}</div>; })}</Reveal></div></section>;
}

function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const t = content[locale];
  useEffect(() => { document.documentElement.lang = locale === 'ja' ? 'ja' : 'en'; }, [locale]);
  return <main className="site" id="top">
    <section className="hero"><img className="hero-image" src={`${import.meta.env.BASE_URL}images/tokyo-limo-hero.jpg`} alt="Black executive sedan on a rain-lit Tokyo street at night" /><div className="hero-shade" /><div className="noise" /><div className="container"><Navigation locale={locale} setLocale={setLocale} /><div className="hero-content"><div className="hero-copy"><span className="eyebrow light">{t.hero.eyebrow}</span><h1 className="display">{t.hero.titleA}<br /><em>{t.hero.titleB}</em></h1><p>{t.hero.copy}</p><span className="hero-support"><Headphones size={14} />{t.hero.support}</span><div className="hero-actions"><a className="button primary" href="#quote" data-testid="link-hero-quote">{t.hero.quote} <ArrowUpRight size={14} /></a><a className="button ghost" href="#services" data-testid="link-hero-services">{t.hero.explore}</a></div><div className="hero-meta">{t.hero.meta.map(([strong, label]) => <span key={strong}><strong>{strong}</strong>{label}</span>)}</div></div><div className="hero-form-wrap"><QuoteForm locale={locale} /></div></div></div></section>
    <section className="trust-strip" aria-label="Tokyo Limo standards"><div className="container trust-inner"><div className="trust-lead" dangerouslySetInnerHTML={{ __html: t.trust.lead }} />{t.trust.items.map(([strong, label], index) => <div className="trust-item" key={strong}>{index === 0 ? <Clock3 size={20} /> : index === 1 ? <ShieldCheck size={20} /> : <Star size={20} />}<span><strong>{strong}</strong><br />{label}</span></div>)}</div></section>
    <section className="intro section-pad" id="standard"><div className="container intro-grid"><Reveal className="section-kicker"><span className="eyebrow">{t.standard.eyebrow}</span><span className="jp">{t.standard.jp}</span></Reveal><Reveal className="intro-copy"><h2 className="display">{t.standard.titleA}<br /><em>{t.standard.titleB}</em></h2><p>{t.standard.copy}</p><div className="intro-rule" /></Reveal></div></section>
    <section className="services section-pad" id="services"><div className="container"><Reveal className="service-heading"><div><span className="eyebrow light">{t.services.eyebrow}</span><h2 className="display" dangerouslySetInnerHTML={{ __html: t.services.title }} /></div><p>{t.services.copy}</p></Reveal><Reveal className="service-grid">{t.services.cards.map((card, index) => <ServiceCard key={card[1]} card={card} index={index} />)}</Reveal></div></section>
    <section className="quote-band section-pad"><div className="container quote-layout"><Reveal><span className="eyebrow">{t.promise.eyebrow}</span><h2 className="display">{t.promise.titleA}<br /><em>{t.promise.titleB}</em></h2><p>{t.promise.copy}</p><ul className="quote-list">{t.promise.list.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul><a className="button dark" href="#quote" data-testid="link-promise-quote">{t.promise.cta} <ArrowUpRight size={14} /></a></Reveal><Reveal className="quote-stamp"><div className="quote-stamp-inner"><div><strong>{t.promise.stamp[0]}</strong><span>{t.promise.stamp[1]}<br />{t.promise.stamp[2]}</span></div></div></Reveal></div></section>
    <Fleet locale={locale} />
    <section className="airport section-pad"><div className="container airport-layout"><Reveal><span className="eyebrow light">{t.airport.eyebrow}</span><h2 className="display" dangerouslySetInnerHTML={{ __html: t.airport.title }} /></Reveal><Reveal><p>{t.airport.copy}</p><a className="button ghost" href="#quote" data-testid="link-airport-quote">{t.airport.cta} <ArrowUpRight size={14} /></a></Reveal></div></section>
    <section className="airport-routes section-pad" id="routes"><div className="container"><Reveal className="routes-heading"><div><span className="eyebrow">{t.routes.eyebrow}</span><h2 className="display" dangerouslySetInnerHTML={{ __html: t.routes.title }} /></div><p>{t.routes.copy}</p></Reveal><Reveal className="route-grid">{t.routes.cards.map(([code, title, copy]) => <article className="route-card" key={title} data-testid={`card-route-${code.replace(/\W/g, '-').toLowerCase()}`}><span className="route-code">{code}</span><ArrowUpRight className="route-arrow" size={18} /><h3>{title}</h3><p>{copy}</p></article>)}</Reveal></div></section>
    <section className="process section-pad"><div className="container"><Reveal className="process-heading"><div><span className="eyebrow">{t.process.eyebrow}</span><h2 className="display">{t.process.title}</h2></div><p>{t.process.copy}</p></Reveal><Reveal className="process-grid">{t.process.steps.map(([num, title, copy]) => <div className="process-step" key={num}><span className="step-num">{num}</span><h3 className="display">{title}</h3><p>{copy}</p></div>)}</Reveal></div></section>
    <section className="testimonial section-pad"><div className="container testimonial-layout"><Reveal><div className="testimonial-mark">“</div><span className="eyebrow light">{t.testimonial.eyebrow}</span></Reveal><Reveal><blockquote>“{t.testimonial.quote}”</blockquote><cite>— {t.testimonial.cite}</cite></Reveal></div></section>
    <FAQ locale={locale} />
    <footer className="footer"><div className="container"><div className="footer-top"><div className="footer-intro"><Brand /><h2 className="display" dangerouslySetInnerHTML={{ __html: t.footer.title }} /><p>{t.footer.copy}</p></div><div className="footer-col"><h3>{t.footer.explore}</h3><a href="#services" data-testid="link-footer-services">{t.nav.services}</a><a href="#fleet" data-testid="link-footer-fleet">{t.nav.fleet}</a><a href="#standard" data-testid="link-footer-standard">{t.nav.standard}</a><a href="#faq" data-testid="link-footer-faq">{t.nav.faq}</a></div><div className="footer-col"><h3>{t.footer.reach}</h3><a href="tel:+81300000000" data-testid="link-footer-phone">+81 3 0000 0000</a><a href="mailto:hello@tokyolimo.jp" data-testid="link-footer-email">hello@tokyolimo.jp</a><p>{t.footer.edit}<br />Tokyo, Japan</p></div><div className="footer-col"><h3>{t.footer.area}</h3>{t.footer.places.map((place, index) => <p key={place}>{index === 0 && <MapPin size={13} />} {place}</p>)}</div></div><div className="footer-bottom"><span>{t.footer.bottom}</span><span>正確さ · 静けさ · 信頼</span></div></div></footer>
  </main>;
}

export default App;