import { useState } from 'react'
import { Eye, EyeOff, ShieldAlert, Check, HeartCrack, Heart } from 'lucide-react'
import { Reveal, SectionHead } from './common'
import { tierInfo, type AgeTier } from '../data'

/* ── Gizlilik karşılaştırması ─────────────────────────────── */

const noisyLog = [
  ['Zeynep', 'ödevi yaptın mı?'],
  ['Elif', 'yarın maça geliyor musun'],
  ['Zeynep', 'annem izin vermedi :('],
  ['Elif', 'sana sonra anlatırım ☺'],
  ['Mert', 'şu şarkıyı dinle'],
]

export function PrivacyCompare() {
  const [mode, setMode] = useState<'old' | 'kanat'>('kanat')
  const kanat = mode === 'kanat'

  return (
    <section id="mahremiyet" className="max-w-6xl mx-auto px-5 py-24">
      <Reveal>
        <SectionHead
          kicker="Mahremiyet"
          title={<>İki ebeveyn telefonu.<br />Biri izler, biri <span className="text-shine">korur.</span></>}
          sub="Aşağıdan geçiş yapın ve aynı olayı iki farklı yaklaşımla görün."
        />
      </Reveal>

      <Reveal delay={100} className="mt-10 flex justify-center">
        <div className="glass rounded-2xl p-1.5 flex gap-1">
          {([['old', 'Geleneksel izleme', EyeOff], ['kanat', 'Kanat', Eye]] as const).map(([k, label, Icon]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                mode === k ? (k === 'kanat' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30') : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={200} className="mt-8 grid md:grid-cols-[1.1fr_1fr] gap-6 items-stretch">
        <div className={`rounded-3xl p-6 border transition-colors duration-500 ${kanat ? 'bg-indigo-500/[0.07] border-indigo-400/25' : 'bg-rose-500/[0.07] border-rose-400/25'}`}>
          <p className="text-xs uppercase tracking-widest text-slate-400">Ebeveynin ekranında</p>

          {kanat ? (
            <div key="k" className="mt-4 animate-pop">
              <div className="rounded-2xl bg-white text-slate-900 p-4 shadow-xl">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-orange-500" /> Siber zorbalık sinyali
                </p>
                <p className="text-sm text-slate-600 mt-1">Instagram · Bugün 14:22</p>
                <p className="mt-2 text-[13px] italic text-slate-500 bg-slate-100 rounded-lg px-3 py-2">"…sen ●●●● gibisin, kimse seni ●●●● istemiyor…"</p>
                <p className="mt-2 text-[13px] text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">Nasıl konuşmalı: Suçlamadan başlayın, yalnız olmadığını hissettirin.</p>
              </div>
              <p className="mt-4 text-slate-300 text-sm leading-relaxed">Kısa, maskelenmiş bir bağlam ve ne yapacağınıza dair yönlendirme. Gerisi çocuğunuzun özel alanı.</p>
            </div>
          ) : (
            <div key="o" className="mt-4 animate-pop">
              <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 space-y-2">
                {noisyLog.map(([who, text], i) => (
                  <p key={i} className="text-[13px]"><span className="text-rose-300 font-semibold">{who}:</span> <span className="text-slate-300">{text}</span></p>
                ))}
                <p className="text-[11px] text-slate-500 pt-1">… ve 1.243 mesaj daha</p>
              </div>
              <p className="mt-4 text-slate-300 text-sm leading-relaxed">Her şey okunur; arkadaşları dahil, çocuğun tüm özel yazışmaları. Rıza vermeyen üçüncü kişiler de içinde.</p>
            </div>
          )}
        </div>

        <div className="glass rounded-3xl p-6 flex flex-col">
          <p className="text-xs uppercase tracking-widest text-slate-400">Sonuç</p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <Metric label="Okunan mesaj" value={kanat ? '0' : '1.248'} tone={kanat ? 'good' : 'bad'} />
            <Metric label="Çocuk haberdar mı?" value={kanat ? 'Evet' : 'Genelde hayır'} tone={kanat ? 'good' : 'bad'} />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">{kanat ? <Heart className="w-3.5 h-3.5 text-emerald-400" /> : <HeartCrack className="w-3.5 h-3.5 text-rose-400" />} Aile güveni</span>
              <span>{kanat ? 'yüksek' : 'zedelenir'}</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${kanat ? 'w-[88%] bg-gradient-to-r from-emerald-400 to-sky-400' : 'w-[18%] bg-gradient-to-r from-rose-500 to-orange-400'}`} />
            </div>
          </div>

          <ul className="mt-6 space-y-2.5 text-sm text-slate-300 mt-auto pt-2">
            {(kanat
              ? ['İçerik cihazdan çıkmaz', 'Çocuk neyin paylaşıldığını görür', 'Yalnızca risk sinyali iletilir']
              : ['İçerik sunucuya taşınır', 'Çoğu zaman gizli çalışır', 'Üçüncü kişilerin yazışmaları da okunur']
            ).map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check className={`w-4 h-4 mt-0.5 shrink-0 ${kanat ? 'text-emerald-400' : 'text-rose-400'}`} /> {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <p className="mt-4 text-center text-xs text-slate-500">Örnek senaryo. Kanat'ın risk motoru demo sürümde henüz bağlı değildir.</p>
    </section>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone: 'good' | 'bad' }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone === 'good' ? 'text-emerald-300' : 'text-rose-300'}`}>{value}</p>
    </div>
  )
}

/* ── Yaşa göre kayan koruma ↔ güven ────────────────────────── */

const tierOf = (age: number): AgeTier => (age <= 12 ? 'kucuk' : age <= 15 ? 'ergen' : 'genc')

export function AgeSlider() {
  const [age, setAge] = useState(11)
  const tier = tierOf(age)
  const info = tierInfo[tier]
  const trust = Math.round(((age - 8) / 9) * 100)

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/40 to-transparent" />
      <div className="relative max-w-4xl mx-auto px-5">
        <Reveal>
          <SectionHead
            kicker="Kademeli güven"
            title={<>Çocuk büyür, <span className="text-shine">kurallar gevşer.</span></>}
            sub="12 yaşla 16 yaş aynı kurallara tabi olmamalı. Çubuğu kaydırıp Kanat'ın yaşla nasıl değiştiğini görün."
          />
        </Reveal>

        <Reveal delay={150} className="mt-12 glass rounded-[2rem] p-6 sm:p-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Çocuğun yaşı</p>
              <p className="text-7xl sm:text-8xl font-bold text-white leading-none mt-1 tabular-nums">{age}</p>
            </div>
            <div className="text-right pb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-semibold">{info.label} profili</span>
              <p className="text-xs text-slate-400 mt-1.5">{info.range}</p>
            </div>
          </div>

          <input
            type="range"
            min={8}
            max={17}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="age-range mt-8"
            aria-label="Çocuğun yaşı"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500 tabular-nums">
            {Array.from({ length: 10 }, (_, i) => <span key={i}>{8 + i}</span>)}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Gauge label="Koruma" value={100 - trust} color="from-indigo-500 to-violet-400" />
            <Gauge label="Güven & özerklik" value={trust} color="from-sky-400 to-emerald-300" />
          </div>

          <p className="mt-8 text-slate-300">{info.desc}</p>
          <div key={tier} className="mt-4 flex flex-wrap gap-2">
            {info.rules.map((r, i) => (
              <span
                key={r}
                style={{ animationDelay: `${i * 70}ms` }}
                className="animate-pop px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-slate-200 flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5 text-emerald-300" /> {r}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        <span>{label}</span>
        <span className="tabular-nums text-slate-200">%{value}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
