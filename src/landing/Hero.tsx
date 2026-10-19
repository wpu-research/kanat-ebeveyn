import { useEffect, useState } from 'react'
import { ArrowRight, Lock, ShieldAlert, MapPin, Smartphone, Apple, Bot, ScanLine } from 'lucide-react'
import { prefersReducedMotion } from './common'
import WingArt from './WingArt'
import Wing from '../Wing'

export default function Hero({ onEnterDemo }: { onEnterDemo: () => void }) {
  // 0 boş · 1 mesaj gelir · 2 cihazda taranır · 3 ebeveyne uyarı · 4 bekle
  const [step, setStep] = useState(prefersReducedMotion() ? 3 : 0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => setStep((s) => (s + 1) % 5), 2300)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-indigo-600/30 blur-[120px] animate-aurora" />
      <div className="absolute top-40 -left-24 w-[420px] h-[420px] rounded-full bg-sky-500/20 blur-[120px] animate-aurora-slow" />

      <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-24 lg:pt-24 grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full glass text-indigo-200">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping-slow" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            Demo sürüm · örnek verilerle çalışır
          </span>

          <h1 className="mt-6 text-[2.6rem] sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.02]">
            Koruyun.
            <br />
            <span className="text-shine">Gözetlemeyin.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg sm:text-xl text-slate-300 leading-relaxed">
            Kanat, çocuğunuzun mesajlarını <strong className="text-white font-semibold">okumaz</strong>. Tarama telefonun içinde
            yapılır; yalnızca bir risk belirdiğinde sizi uyarır. Konum, ekran süresi ve güvenli bölgeler yanında.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onEnterDemo}
              className="group px-7 py-4 rounded-2xl bg-white text-slate-900 font-semibold flex items-center justify-center gap-2 hover:bg-indigo-50 transition shadow-[0_0_50px_-8px_rgba(165,180,252,0.7)]"
            >
              Canlı demoyu dene
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
            <a href="#mahremiyet" className="px-7 py-4 rounded-2xl glass text-white font-semibold flex items-center justify-center hover:bg-white/10 transition">
              Nasıl çalışır?
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><Bot className="w-4 h-4" /> Android</span>
            <span className="flex items-center gap-1.5"><Apple className="w-4 h-4" /> iOS</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> İçerik cihazdan çıkmaz</span>
          </div>
        </div>

        <Scene step={step} />
      </div>
    </section>
  )
}

function Scene({ step }: { step: number }) {
  return (
    <div className="relative h-[600px] sm:h-[620px] w-full max-w-[400px] sm:max-w-none mx-auto min-w-0">
      <WingArt className="absolute -right-24 -top-28 w-[660px] h-[660px] opacity-60 animate-float-slow pointer-events-none" />

      {/* Ebeveynin telefonu */}
      <div className="absolute right-0 sm:right-4 top-0 w-[265px] h-[540px] rounded-[42px] border-[9px] border-slate-800 bg-slate-950 shadow-[0_30px_80px_-20px_rgba(79,70,229,0.55)] overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black z-20" />
        <div className="pt-9 px-4 text-[11px] flex text-slate-400"><span>09:41</span><span className="ml-auto">●●● 5G</span></div>

        {/* Gelen uyarı */}
        <div
          className={`absolute top-12 inset-x-3 z-10 rounded-2xl p-3 bg-white text-slate-900 shadow-xl transition-all duration-500 ${
            step >= 3 ? 'opacity-100 translate-y-0 animate-pop' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Wing size={16} radius={4} /> KANAT · şimdi
          </div>
          <p className="mt-1.5 text-[13px] font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-orange-500" /> Siber zorbalık sinyali
          </p>
          <p className="text-[11.5px] text-slate-600 leading-snug mt-0.5">
            Elif'in Instagram sohbetinde zorbalık içerebilecek bir mesaj algılandı. Mesajın tamamı gösterilmez.
          </p>
        </div>

        <div className="px-4 mt-5">
          <div className="flex items-center gap-2">
            <Wing size={26} radius={7} />
            <span className="text-white font-semibold text-sm">Elif</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">çevrimiçi</span>
          </div>

          <div className="mt-4 rounded-2xl p-3 bg-slate-900 border border-white/5">
            <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Şu an</p>
            <p className="text-white text-sm font-semibold">Moda İlkokulu</p>
            <div className="mt-2 h-24 rounded-xl bg-gradient-to-br from-indigo-900/60 to-slate-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-60" />
              <span className="absolute left-[46%] top-[40%] w-3 h-3 rounded-full bg-indigo-400">
                <span className="absolute inset-0 rounded-full bg-indigo-400 animate-ping-slow" />
              </span>
              <span className="absolute left-[30%] top-[22%] w-14 h-14 rounded-full border border-emerald-400/60 bg-emerald-400/10" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl p-3 bg-slate-900 border border-white/5">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <p className="text-[10px] text-slate-500 mt-1.5">Ekran süresi</p>
              <p className="text-white text-[13px] font-semibold whitespace-nowrap">2 sa 22 dk</p>
            </div>
            <div className="rounded-2xl p-3 bg-slate-900 border border-white/5">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <p className="text-[10px] text-slate-500 mt-1.5">Açık uyarı</p>
              <p className="text-white text-sm font-semibold">{step >= 3 ? 3 : 2}</p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl p-3 bg-slate-900 border border-white/5 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-300 grid place-items-center text-xs font-bold">A</span>
            <div>
              <p className="text-white text-[13px] font-semibold">Anne · gelen arama</p>
              <p className="text-[10px] text-slate-500">3 dk · ses kaydı yok</p>
            </div>
          </div>
        </div>
      </div>

      {/* Çocuğun telefonu: içerik cihazda kalır */}
      <div className="absolute left-0 bottom-0 sm:bottom-6 w-[240px] sm:w-[255px] rounded-3xl glass p-4 shadow-2xl animate-float">
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <span className="w-6 h-6 rounded-full bg-pink-500 grid place-items-center text-white text-[10px] font-bold">E</span>
          Elif'in telefonu
          <span className="ml-auto flex items-center gap-1 text-emerald-300"><Lock className="w-3 h-3" /> cihaz içi</span>
        </div>

        <div className="relative mt-3 space-y-2 min-h-[120px]">
          <Bubble show={step >= 1} side="left" />
          <Bubble show={step >= 1} side="left" short />
          <Bubble show={step >= 1} side="right" />
          {step === 2 && (
            <span className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent animate-scan" />
          )}
        </div>

        <div className="mt-3 text-[11px] flex items-center gap-1.5">
          {step < 2 && <span className="text-slate-500">Mesaj bekleniyor…</span>}
          {step === 2 && <span className="text-indigo-300 flex items-center gap-1.5"><ScanLine className="w-3.5 h-3.5" /> Cihazda taranıyor…</span>}
          {step >= 3 && <span className="text-orange-300 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> 1 sinyal gönderildi · içerik gitmedi</span>}
        </div>
      </div>
    </div>
  )
}

function Bubble({ show, side, short = false }: { show: boolean; side: 'left' | 'right'; short?: boolean }) {
  return (
    <div className={`flex ${side === 'right' ? 'justify-end' : ''} transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <span
        className={`h-7 rounded-2xl ${short ? 'w-24' : 'w-40'} ${side === 'right' ? 'bg-indigo-500/60' : 'bg-white/15'} backdrop-blur-sm`}
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 6px, transparent 6px 11px)' }}
      />
    </div>
  )
}
