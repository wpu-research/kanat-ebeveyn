import { ArrowRight, Check, Minus, Star } from 'lucide-react'
import Wing from './Wing'
import Hero from './landing/Hero'
import Bento from './landing/Bento'
import WingArt from './landing/WingArt'
import { AgeSlider, PrivacyCompare } from './landing/Interactive'
import { Reveal, SectionHead, useCountUp, useInView } from './landing/common'

export default function Landing({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <div className="landing-bg min-h-full text-slate-200 overflow-x-clip">
      <Nav onEnterDemo={onEnterDemo} />
      <Hero onEnterDemo={onEnterDemo} />
      <Marquee />
      <Stats />
      <PrivacyCompare />
      <Bento />
      <AgeSlider />
      <Compare />
      <Pricing onEnterDemo={onEnterDemo} />
      <FAQ />
      <CTA onEnterDemo={onEnterDemo} />
      <Footer />
    </div>
  )
}

function Nav({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070714]/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center">
        <a href="#" className="flex items-center gap-2.5">
          <Wing size={32} radius={8} />
          <span className="font-bold text-lg text-white tracking-tight">Kanat</span>
        </a>
        <nav className="ml-auto hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#mahremiyet" className="hover:text-white transition">Mahremiyet</a>
          <a href="#ozellikler" className="hover:text-white transition">Özellikler</a>
          <a href="#fiyat" className="hover:text-white transition">Fiyat</a>
          <a href="#sss" className="hover:text-white transition">SSS</a>
        </nav>
        <button onClick={onEnterDemo} className="ml-6 text-sm font-semibold px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-indigo-50 transition">
          Canlı demo
        </button>
      </div>
    </header>
  )
}

const risks = ['Siber zorbalık', 'Şüpheli yetişkin teması', 'Kendine zarar', 'Madde kullanımı', 'Uygunsuz içerik', 'Dolandırıcılık', 'Okul saatinde oyun', 'Bilinmeyen arama']

function Marquee() {
  const row = [...risks, ...risks]
  return (
    <div className="border-y border-white/5 py-4 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max gap-10 animate-marquee">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-sm text-slate-500 whitespace-nowrap">
            {t}
            <Wing size={14} radius={4} />
          </span>
        ))}
      </div>
    </div>
  )
}

function Stat({ value, decimals, suffix, label, active }: { value: number; decimals: number; suffix: string; label: string; active: boolean }) {
  const v = useCountUp(value, active, decimals)
  return (
    <div className="text-center">
      <p className="text-5xl sm:text-6xl font-bold text-white tabular-nums tracking-tight">
        <span className="text-shine">%{v}</span>
        <span className="text-2xl text-slate-500">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-slate-400 max-w-[15rem] mx-auto">{label}</p>
    </div>
  )
}

function Stats() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  return (
    <section className="max-w-5xl mx-auto px-5 py-24">
      <Reveal>
        <SectionHead kicker="Neden şimdi" title={<>Çocuklar çoktan <span className="text-shine">çevrimiçi.</span></>} />
      </Reveal>
      <div ref={ref} className="mt-14 grid sm:grid-cols-3 gap-10">
        <Stat active={seen} value={91.3} decimals={1} suffix="" label="6–15 yaş çocukların internet kullanım oranı" />
        <Stat active={seen} value={86.2} decimals={1} suffix="" label="11–15 yaşta akıllı telefon kullanan çocuk" />
        <Stat active={seen} value={79} decimals={0} suffix="" label="11–15 yaşta sosyal medya kullanan çocuk" />
      </div>
      <p className="mt-10 text-center text-xs text-slate-600">Kaynak: TÜİK, Çocuklarda Bilişim Teknolojileri Kullanım Araştırması, 2024.</p>
    </section>
  )
}

const rows: [string, boolean, boolean][] = [
  ['Mesaj içeriğini ebeveyne gösterir', true, false],
  ['Çocuk neyin paylaşıldığını görebilir', false, true],
  ['Gizli (görünmez) çalışır', true, false],
  ['Yaşa göre kademeli gevşer', false, true],
  ['Analiz çocuğun cihazında yapılır', false, true],
  ['Türkçe bağlama odaklı tasarım', false, true],
]

function Compare() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-24">
      <Reveal>
        <SectionHead kicker="Fark" title={<>Aynı kaygı, <span className="text-shine">farklı yaklaşım.</span></>} />
      </Reveal>
      <Reveal delay={120} className="mt-12 glass rounded-3xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] text-sm">
          <div className="px-5 py-4 text-xs uppercase tracking-widest text-slate-500">Yaklaşım</div>
          <div className="px-5 py-4 text-xs uppercase tracking-widest text-slate-500 w-36 text-center">Geleneksel izleme</div>
          <div className="px-5 py-4 text-xs uppercase tracking-widest text-indigo-300 w-28 text-center bg-indigo-500/10">Kanat</div>
          {rows.map(([label, old, kanat]) => (
            <div key={label} className="contents">
              <div className="px-5 py-4 border-t border-white/5 text-slate-200">{label}</div>
              <div className="px-5 py-4 border-t border-white/5 w-36 grid place-items-center">
                {old ? <Check className="w-4 h-4 text-slate-400" /> : <Minus className="w-4 h-4 text-slate-700" />}
              </div>
              <div className="px-5 py-4 border-t border-white/5 w-28 grid place-items-center bg-indigo-500/10">
                {kanat ? <Check className="w-4 h-4 text-emerald-300" /> : <Minus className="w-4 h-4 text-slate-700" />}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
      <p className="mt-4 text-center text-xs text-slate-600">Kanat'ın tasarım ilkeleri. Demo sürümde risk motoru henüz bağlı değildir.</p>
    </section>
  )
}

function Pricing({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <section id="fiyat" className="max-w-5xl mx-auto px-5 py-24">
      <Reveal>
        <SectionHead kicker="Fiyat" title={<>Tek fiyat. <span className="text-shine">Tüm çocuklar.</span></>} sub="Cihaz başına ücret yok." />
      </Reveal>
      <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Reveal>
          <div className="h-full glass rounded-3xl p-8">
            <h3 className="font-semibold text-white text-lg">Ücretsiz</h3>
            <p className="mt-4 text-4xl font-bold text-white">₺0</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {['Canlı konum', 'Temel ekran süresi', '1 güvenli bölge', 'Temel web filtresi'].map((t) => (
                <li key={t} className="flex gap-2.5"><Check className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />{t}</li>
              ))}
            </ul>
            <button onClick={onEnterDemo} className="mt-8 w-full py-3 rounded-xl glass font-semibold text-white hover:bg-white/10 transition">Demoyu gör</button>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative h-full rounded-3xl p-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_30px_80px_-20px_rgba(99,102,241,0.7)]">
            <span className="absolute top-6 right-6 text-xs bg-white/20 px-2.5 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Önerilen</span>
            <h3 className="font-semibold text-lg">Premium</h3>
            <p className="mt-4 text-4xl font-bold">₺149<span className="text-base font-normal text-indigo-100">/ay</span></p>
            <p className="text-xs text-indigo-100 mt-1">Yıllıkta ₺99/ay · tahmini fiyat</p>
            <ul className="mt-6 space-y-3 text-sm">
              {['Ücretsiz\'deki her şey', 'Cihaz-içi risk uyarıları', 'Sınırsız güvenli bölge', 'Arama kayıtları', 'Okul saati modu', 'Yaşa göre kademeli güven'].map((t) => (
                <li key={t} className="flex gap-2.5"><Check className="w-4 h-4 mt-0.5 shrink-0" />{t}</li>
              ))}
            </ul>
            <button onClick={onEnterDemo} className="mt-8 w-full py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition">Demoyu gör</button>
          </div>
        </Reveal>
      </div>
      <p className="mt-6 text-center text-xs text-slate-600">Fiyatlar tahminidir; lansmanda netleşecektir.</p>
    </section>
  )
}

const faq = [
  ['Çocuğumun mesajlarını okuyabilecek miyim?', 'Hayır, bu bilinçli bir tercih. İçeriği okumak çocuğun güvenini zedeler ve rıza vermeyen üçüncü kişilerin yazışmalarını da kapsar. Bunun yerine Kanat, cihazda bir risk görürse (zorbalık, taciz, kendine zarar) size kategori ve kısa, maskelenmiş bir bağlam gönderir.'],
  ['iPhone\'da çalışıyor mu?', 'Konum, ekran süresi ve web filtresi iOS\'ta çalışır. Ancak Apple, bir uygulamanın başka uygulamaların mesajlarına erişmesine izin vermez; bu yüzden mesaj tabanlı risk analizi iOS\'ta sınırlıdır ve uygulama bunu açıkça belirtir.'],
  ['Çocuğum uygulamadan haberdar olacak mı?', 'Evet. Kanat gizli çalışmaz. Çocuğun telefonunda görünür ve "neler paylaşılıyor" ekranından hangi verilerin ailesine gittiğini görebilir.'],
  ['Verilerim nerede tutulur?', 'Tasarım ilkemiz, mesaj içeriğinin cihazdan çıkmamasıdır. Veri saklama ve KVKK süreçleri lansman öncesi netleştirilecek ve burada yayımlanacaktır.'],
  ['Şu an gerçekten çalışıyor mu?', 'Bu bir demo sürümdür: arayüz ve akışlar örnek verilerle çalışır, risk motoru ve gerçek cihaz bağlantısı henüz yoktur. Ne gördüğünüzü saklamıyoruz.'],
]

function FAQ() {
  return (
    <section id="sss" className="max-w-3xl mx-auto px-5 py-24">
      <Reveal><SectionHead kicker="SSS" title="Sık sorulan sorular" /></Reveal>
      <div className="mt-12 space-y-3">
        {faq.map(([q, a]) => (
          <Reveal key={q}>
            <details className="group glass rounded-2xl px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center cursor-pointer list-none font-medium text-white">
                {q}
                <span className="ml-auto text-2xl leading-none text-slate-500 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function CTA({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <section className="max-w-6xl mx-auto px-5 pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-8 py-20 text-center">
          <WingArt className="absolute -right-16 -bottom-24 w-[420px] h-[420px] opacity-30" />
          <WingArt className="absolute -left-20 -top-28 w-[360px] h-[360px] opacity-20 -scale-x-100" />
          <div className="relative">
            <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.05]">Çocuğunuzun<br />dijital kanadı olun.</h2>
            <p className="mt-5 text-indigo-100 text-lg max-w-xl mx-auto">Gözetlemeden koruyan ebeveyn uygulaması. Demoyu şimdi açın, her ekranı gezin.</p>
            <button onClick={onEnterDemo} className="mt-9 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-semibold inline-flex items-center gap-2 hover:bg-indigo-50 transition">
              Canlı demoyu aç <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2.5"><Wing size={26} radius={7} /><span className="font-semibold text-slate-300">Kanat</span></div>
        <p className="sm:ml-auto text-center">Gözetlemeden koruyan ebeveyn uygulaması · © {new Date().getFullYear()}</p>
      </div>
      <p className="pb-8 text-center text-xs text-slate-600 px-5">Bu sayfa ve demo ürün vizyonunu gösterir. Veriler örnektir; risk motoru ve cihaz bağlantısı henüz yoktur.</p>
    </footer>
  )
}
