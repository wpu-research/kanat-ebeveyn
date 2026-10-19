import {
  Shield, MapPin, Smartphone, ShieldAlert, Phone, EyeOff, Lock, School, Baby,
  Check, ArrowRight, Heart, Brain, Languages, BatteryCharging, Apple, Bot, Star,
} from 'lucide-react'

export default function Landing({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <div className="min-h-full bg-white text-slate-800">
      <Nav onEnterDemo={onEnterDemo} />
      <Hero onEnterDemo={onEnterDemo} />
      <Promise />
      <Features />
      <Transparency />
      <AgeTiers />
      <WhyLocal />
      <Pricing onEnterDemo={onEnterDemo} />
      <FAQ />
      <CTA onEnterDemo={onEnterDemo} />
      <Footer />
    </div>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-indigo-500 grid place-items-center">
        <Shield className="w-4 h-4 text-white" />
      </div>
      <span className={`font-bold text-lg ${light ? 'text-white' : 'text-slate-900'}`}>Kanat</span>
    </div>
  )
}

function Nav({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center">
        <Logo />
        <nav className="ml-auto hidden md:flex items-center gap-7 text-sm text-slate-600">
          <a href="#ozellikler" className="hover:text-slate-900">Özellikler</a>
          <a href="#mahremiyet" className="hover:text-slate-900">Mahremiyet</a>
          <a href="#fiyat" className="hover:text-slate-900">Fiyat</a>
          <a href="#sss" className="hover:text-slate-900">SSS</a>
        </nav>
        <button onClick={onEnterDemo} className="ml-5 text-sm font-medium px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">
          Canlı demo
        </button>
      </div>
    </header>
  )
}

function Hero({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white" />
      <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-20 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-700 shadow-sm">
          <Lock className="w-3.5 h-3.5" /> Cihaz-içi yapay zekâ · KVKK uyumlu
        </span>
        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
          Çocuğunuzu koruyun,<br /><span className="text-indigo-600">gözetlemeden.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
          Kanat, çocuğunuzun mesajlarını okumaz. Yapay zekâ telefonun içinde çalışır; yalnızca bir risk
          belirdiğinde — zorbalık, taciz, kendine zarar — sizi uyarır. Konum, ekran süresi ve güvenli
          bölgeler de cabası.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onEnterDemo} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
            Canlı demoyu dene <ArrowRight className="w-4 h-4" />
          </button>
          <a href="#fiyat" className="px-6 py-3 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50 flex items-center justify-center">
            Fiyatları gör
          </a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><Bot className="w-4 h-4" /> Android</span>
          <span className="flex items-center gap-1.5"><Apple className="w-4 h-4" /> iOS</span>
          <span className="flex items-center gap-1.5"><BatteryCharging className="w-4 h-4" /> Düşük pil tüketimi</span>
        </div>
      </div>
    </section>
  )
}

function Promise() {
  const items = [
    { icon: EyeOff, title: 'Mesajları okumayız', desc: 'İçerik size veya sunucuya gitmez. Yalnızca risk kategorisi ve maskelenmiş kısa bağlam.' },
    { icon: Brain, title: 'Yapay zekâ cihazda', desc: 'Analiz çocuğun telefonunda yapılır. Veri dışarı çıkmaz, mahremiyet korunur.' },
    { icon: Heart, title: 'Güvene dayalı', desc: 'Çocuk neyin paylaşıldığını görür. Gizli casusluk değil, ortak güvenlik.' },
  ]
  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.title} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
            <span className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 grid place-items-center">
              <it.icon className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-semibold text-lg">{it.title}</h3>
            <p className="mt-1.5 text-slate-600 text-sm leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Features() {
  const feats = [
    { icon: MapPin, title: 'Konum & güvenli bölgeler', desc: 'Canlı konum; ev, okul, servis için "vardı/çıktı" bildirimleri.' },
    { icon: Smartphone, title: 'Ekran süresi', desc: 'Günlük limitler, uygulama bazında kısıt, tek dokunuşla cihaz kilidi.' },
    { icon: ShieldAlert, title: 'Risk uyarıları', desc: 'Zorbalık, taciz, kendine zarar sinyalleri — açıklamalı ve yönlendirmeli.' },
    { icon: Phone, title: 'Arama kayıtları', desc: 'Kiminle, ne zaman, ne kadar. Ses kaydı ve dinleme yok.' },
    { icon: School, title: 'Okul saati modu', desc: 'Ders saatinde oyun ve sosyal medya kapanır; arama ve eğitim açık.' },
    { icon: Baby, title: 'Yaşa göre kademeli güven', desc: 'Çocuk büyüdükçe kurallar gevşer; 15+ için şeffaf "güven modu".' },
  ]
  return (
    <section id="ozellikler" className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead kicker="Özellikler" title="Bir ailenin ihtiyacı olan her şey" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {feats.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition">
              <span className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center">
                <f.icon className="w-5 h-5" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Transparency() {
  return (
    <section id="mahremiyet" className="max-w-6xl mx-auto px-5 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHead kicker="Mahremiyet" title="Casus yazılım değil, güvenlik ortağı" align="left" />
          <p className="mt-5 text-slate-600 leading-relaxed">
            Life360 konum verisi satmakla, mSpy gizli dinlemeyle kategoriyi "ürkütücü" hale getirdi. Kanat
            tam tersini yapar: çocuk neyin paylaşıldığını bilir, içerik hiçbir yere gönderilmez, analiz
            cihazdan çıkmaz.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Mesaj içeriği değil, yalnızca risk sinyali iletilir',
              'Analiz çocuğun cihazında — bulutta değil',
              'Çocuk "neler paylaşılıyor" ekranından her şeyi görür',
              'Veri satışı yok, reklam izleme yok',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-slate-700">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white">
          <EyeOff className="w-8 h-8 text-indigo-200" />
          <blockquote className="mt-4 text-xl font-medium leading-relaxed">
            "Instagram'da zorbalık içerebilecek bir mesaj algılandı."
          </blockquote>
          <p className="mt-4 text-indigo-200 text-sm">
            Ebeveynin gördüğü tek şey bu — mesajın tamamı değil. Yanında ne yapması gerektiğine dair
            yönlendirme de gelir.
          </p>
        </div>
      </div>
    </section>
  )
}

function AgeTiers() {
  const tiers = [
    { label: 'Çocuk', range: '8–12 yaş', desc: 'Sıkı koruma, yüklemelerde onay, sosyal medya kısıtlı.' },
    { label: 'Ergen', range: '13–15 yaş', desc: 'Dengeli; kategori bazlı limitler, risk uyarıları açık.' },
    { label: 'Genç', range: '16–17 yaş', desc: 'Güvene dayalı; yalnızca konum ve ciddi risk uyarıları.' },
  ]
  return (
    <section className="bg-slate-900 text-white py-20">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead kicker="Kademeli güven" title="Çocuk büyür, kurallar gevşer" dark />
        <p className="text-slate-400 text-center max-w-2xl mx-auto mt-3">
          12 yaşla 16 yaş aynı kurallara tabi olmamalı. Kanat yaşa göre otomatik ayarlanır — 13'te aniden
          biten denetim yok, kademeli bir geçiş var.
        </p>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {tiers.map((t, i) => (
            <div key={t.label} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{i + 1}</span>
                <div>
                  <p className="font-semibold">{t.label}</p>
                  <p className="text-xs text-slate-400">{t.range}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyLocal() {
  const items = [
    { icon: Languages, title: 'Türkçe risk tespiti', desc: 'Türkçe zorbalık, argo ve dolandırıcılık kalıplarını anlar — yabancı uygulamaların kaçırdığı şey.' },
    { icon: Lock, title: 'KVKK uyumlu, veri Türkiye\'de', desc: 'Cihaz-içi işleme ve yurt içi veri. Yabancı uygulamaların veremeyeceği güven.' },
    { icon: School, title: 'Okul takvimine duyarlı', desc: 'Sınav dönemi, tatil ve ders saatine göre otomatik kurallar.' },
  ]
  return (
    <section className="max-w-6xl mx-auto px-5 py-20">
      <SectionHead kicker="Neden Kanat" title="Türkiye için, Türkiye'den" />
      <div className="grid md:grid-cols-3 gap-5 mt-10">
        {items.map((it) => (
          <div key={it.title} className="p-6 rounded-2xl border border-slate-100">
            <span className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
              <it.icon className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-slate-600 text-sm leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Pricing({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <section id="fiyat" className="bg-slate-50 py-20">
      <div className="max-w-5xl mx-auto px-5">
        <SectionHead kicker="Fiyatlandırma" title="Tek fiyat, tüm çocuklar" />
        <p className="text-center text-slate-500 mt-3">Cihaz başına ücret yok. 14 gün ücretsiz deneyin.</p>
        <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-3xl mx-auto">
          <div className="p-7 rounded-2xl bg-white border border-slate-200">
            <h3 className="font-semibold text-lg">Ücretsiz</h3>
            <p className="text-slate-500 text-sm mt-1">Temel koruma</p>
            <p className="mt-5 text-3xl font-bold">₺0</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {['Canlı konum', 'Temel ekran süresi', 'Güvenli bölge (1 adet)', 'Web filtresi (temel)'].map((t) => (
                <li key={t} className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />{t}</li>
              ))}
            </ul>
            <button onClick={onEnterDemo} className="mt-7 w-full py-2.5 rounded-xl border border-slate-200 font-medium hover:bg-slate-50">
              Demoyu gör
            </button>
          </div>
          <div className="p-7 rounded-2xl bg-indigo-600 text-white relative shadow-xl">
            <span className="absolute top-5 right-5 text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> Önerilen
            </span>
            <h3 className="font-semibold text-lg">Premium</h3>
            <p className="text-indigo-200 text-sm mt-1">Tam koruma, sınırsız çocuk</p>
            <p className="mt-5 text-3xl font-bold">₺149<span className="text-base font-normal text-indigo-200">/ay</span></p>
            <p className="text-xs text-indigo-200 mt-1">Yıllık ödemede ₺99/ay</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {['Ücretsiz\'deki her şey', 'Cihaz-içi risk uyarıları', 'Sınırsız güvenli bölge', 'Arama kayıtları', 'Okul saati modu', 'Yaşa göre kademeli güven', 'Öncelikli Türkçe destek'].map((t) => (
                <li key={t} className="flex gap-2"><Check className="w-4 h-4 text-indigo-200 shrink-0" />{t}</li>
              ))}
            </ul>
            <button onClick={onEnterDemo} className="mt-7 w-full py-2.5 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50">
              14 gün ücretsiz dene
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">Fiyatlar demo amaçlıdır; lansmanda netleşecektir.</p>
      </div>
    </section>
  )
}

function FAQ() {
  const qa = [
    { q: 'Çocuğumun mesajlarını okuyabilecek miyim?', a: 'Hayır — ve bu bilinçli bir tercih. İçeriği okumak hem çocuğun güvenini zedeler hem de hukuken sorunludur. Bunun yerine yapay zekâ cihazda bir risk görürse (zorbalık, taciz, kendine zarar) size kategori ve kısa bir bağlam gönderir.' },
    { q: 'iPhone\'da çalışıyor mu?', a: 'Evet; konum, ekran süresi (Screen Time) ve web filtresi iOS\'ta tam çalışır. Ancak Apple hiçbir uygulamanın başka uygulamaların mesajlarını okumasına izin vermez, bu yüzden risk analizi iOS\'ta sınırlıdır. Uygulama bunu açıkça belirtir.' },
    { q: 'Çocuğum uygulamadan haberdar olacak mı?', a: 'Evet. Kanat gizli casus yazılım değil. Çocuğun telefonunda görünür ve "neler paylaşılıyor" ekranından her şeyi görebilir. Güven, gizlilikten daha iyi korur.' },
    { q: 'Verilerim güvende mi?', a: 'Analiz çocuğun cihazında yapılır, mesaj içeriği dışarı çıkmaz. KVKK uyumlu çalışırız, veri satmayız, reklam için izleme yapmayız.' },
    { q: 'Pil tüketimi yüksek mi?', a: 'Hayır. İşlemeyi cihazda ve toplu yaptığımız için pil etkisi düşük tutulur — çocuğun telefonu öğlene kalmadan bitmez.' },
  ]
  return (
    <section id="sss" className="max-w-3xl mx-auto px-5 py-20">
      <SectionHead kicker="SSS" title="Sık sorulan sorular" />
      <div className="mt-10 space-y-4">
        {qa.map((item) => (
          <details key={item.q} className="group rounded-xl border border-slate-200 p-5 [&_summary]:cursor-pointer">
            <summary className="font-medium flex items-center list-none">
              {item.q}
              <span className="ml-auto text-slate-400 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function CTA({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <section className="max-w-6xl mx-auto px-5 pb-20">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white px-8 py-14 text-center">
        <h2 className="text-3xl font-bold">Çocuğunuzun dijital kanadı olun</h2>
        <p className="mt-3 text-indigo-200 max-w-xl mx-auto">Gözetlemeden koruyan ebeveyn uygulaması. Bugün canlı demoyu deneyin.</p>
        <button onClick={onEnterDemo} className="mt-7 px-7 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 inline-flex items-center gap-2">
          Canlı demoyu aç <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-500">
        <Logo />
        <p className="sm:ml-auto">© {new Date().getFullYear()} Kanat · Gözetlemeden koruyan ebeveyn uygulaması</p>
        <span className="text-slate-300">Demo · Mock veri</span>
      </div>
    </footer>
  )
}

function SectionHead({ kicker, title, align = 'center', dark = false }: { kicker: string; title: string; align?: 'center' | 'left'; dark?: boolean }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <span className="text-sm font-semibold text-indigo-500">{kicker}</span>
      <h2 className={`mt-2 text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
    </div>
  )
}
