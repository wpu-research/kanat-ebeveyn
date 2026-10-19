import type { ReactNode } from 'react'
import { PhoneIncoming, PhoneMissed, PhoneOutgoing, ShieldAlert, Siren, Lock } from 'lucide-react'
import { Reveal, SectionHead, useInView } from './common'

function Tile({ title, desc, children, className = '' }: { title: string; desc: string; children: ReactNode; className?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl glass p-6 hover:border-indigo-400/40 hover:bg-white/[0.07] transition duration-300 ${className}`}>
      <div className="relative">{children}</div>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}

export default function Bento() {
  return (
    <section id="ozellikler" className="max-w-6xl mx-auto px-5 py-24">
      <Reveal>
        <SectionHead
          kicker="Özellikler"
          title="Bir aile için gereken her şey. Fazlası değil."
        />
      </Reveal>

      <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:auto-rows-fr">
        <Reveal className="lg:col-span-2 lg:row-span-2">
          <Tile
            className="h-full"
            title="Canlı konum ve güvenli bölgeler"
            desc="Ev, okul, servis durağı, kurs: çocuğunuz girdiğinde veya çıktığında bildirim alın."
          >
            <MapArt />
          </Tile>
        </Reveal>
        <Reveal delay={80}><Tile className="h-full" title="Ekran süresi" desc="Günlük ve uygulama bazında limitler. Tek dokunuşla ek süre ver veya cihazı kilitle."><Ring /></Tile></Reveal>
        <Reveal delay={160}><Tile className="h-full" title="Açıklamalı risk uyarıları" desc="Yalnızca sinyal ve kısa bağlam. Yanında ne yapacağınıza dair yönlendirme."><Alerts /></Tile></Reveal>
        <Reveal delay={80}><Tile className="h-full" title="Arama kayıtları" desc="Kiminle, ne zaman, ne kadar. Ses kaydı ve dinleme yok."><Calls /></Tile></Reveal>
        <Reveal delay={160}><Tile className="h-full" title="Okul saati modu" desc="Ders saatinde oyun ve sosyal medya kapanır; arama ve eğitim açık kalır."><School24 /></Tile></Reveal>
        <Reveal delay={240}><Tile className="h-full" title="Çocuk için SOS" desc="Tek dokunuşla ailesine konumunu ve acil durum bildirimini gönderir."><Sos /></Tile></Reveal>
      </div>
    </section>
  )
}

function MapArt() {
  return (
    <svg viewBox="0 0 520 280" className="w-full rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-950 border border-white/5">
      <defs>
        <pattern id="mg" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="rgba(255,255,255,0.05)" />
        </pattern>
      </defs>
      <rect width="520" height="280" fill="url(#mg)" />
      <path d="M0 210 C120 170 200 240 320 190 S 470 120 520 140" stroke="rgba(148,163,184,0.18)" strokeWidth="14" fill="none" />
      <path d="M90 0 C110 90 150 160 140 280" stroke="rgba(148,163,184,0.14)" strokeWidth="10" fill="none" />
      {/* güvenli bölgeler */}
      <circle cx="120" cy="205" r="46" fill="rgba(99,102,241,0.14)" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="120" y="150" textAnchor="middle" fill="#a5b4fc" fontSize="11">Ev</text>
      <circle cx="400" cy="100" r="54" fill="rgba(16,185,129,0.13)" stroke="#34d399" strokeWidth="1.5" />
      <text x="400" y="36" textAnchor="middle" fill="#6ee7b7" fontSize="11">Okul</text>
      <circle cx="285" cy="205" r="26" fill="rgba(245,158,11,0.13)" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="285" y="250" textAnchor="middle" fill="#fcd34d" fontSize="11">Servis</text>
      {/* yol ve hareket eden çocuk */}
      <path id="route" d="M120 205 C 190 175, 235 215, 285 205 S 360 140, 400 100" stroke="#a5b4fc" strokeWidth="3" fill="none" strokeDasharray="2 9" strokeLinecap="round" />
      <g>
        <circle r="16" fill="rgba(236,72,153,0.3)">
          <animate attributeName="r" values="12;24;12" dur="2.4s" repeatCount="indefinite" />
          <animateMotion dur="9s" repeatCount="indefinite" rotate="0"><mpath href="#route" /></animateMotion>
        </circle>
        <circle r="9" fill="#ec4899" stroke="#fff" strokeWidth="2.5">
          <animateMotion dur="9s" repeatCount="indefinite" rotate="0"><mpath href="#route" /></animateMotion>
        </circle>
      </g>
    </svg>
  )
}

function Ring() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4)
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <div ref={ref} className="flex justify-center py-1">
      <svg width="132" height="132" viewBox="0 0 132 132">
        <circle cx="66" cy="66" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="11" />
        <circle
          cx="66" cy="66" r={r} fill="none" stroke="url(#ringg)" strokeWidth="11" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={seen ? c * 0.21 : c} transform="rotate(-90 66 66)"
          style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)' }}
        />
        <defs>
          <linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#818cf8" /><stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <text x="66" y="64" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="700">%79</text>
        <text x="66" y="82" textAnchor="middle" fill="#94a3b8" fontSize="10">2 sa 22 dk</text>
      </svg>
    </div>
  )
}

function Alerts() {
  return (
    <div className="space-y-2">
      <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3 flex gap-2.5 items-start">
        <ShieldAlert className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
        <div><p className="text-[13px] text-white font-medium">Siber zorbalık</p><p className="text-[11px] text-slate-400">Instagram · 14:22</p></div>
        <span className="ml-auto w-2 h-2 rounded-full bg-rose-500 mt-1.5" />
      </div>
      <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 flex gap-2.5 items-start opacity-70">
        <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <div><p className="text-[13px] text-slate-200">İçerik cihazda kaldı</p><p className="text-[11px] text-slate-500">Gönderilen: yalnızca sinyal</p></div>
      </div>
    </div>
  )
}

function Calls() {
  const rows = [
    { i: PhoneIncoming, c: 'text-emerald-400', n: 'Anne', d: '3 dk' },
    { i: PhoneMissed, c: 'text-rose-400', n: 'Bilinmeyen numara', d: 'Cevapsız', tag: true },
    { i: PhoneOutgoing, c: 'text-sky-400', n: 'Zeynep', d: '7 dk' },
  ]
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.n} className="flex items-center gap-2.5 rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2">
          <r.i className={`w-4 h-4 ${r.c}`} />
          <span className="text-[13px] text-slate-200">{r.n}</span>
          {r.tag && <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">riskli</span>}
          <span className="ml-auto text-[11px] text-slate-500">{r.d}</span>
        </div>
      ))}
    </div>
  )
}

function School24() {
  // 24 saatlik çubuk: 08:30–15:10 vurgulu
  const start = (8.5 / 24) * 100
  const width = ((15.17 - 8.5) / 24) * 100
  return (
    <div className="pt-3">
      <div className="relative h-8 rounded-lg bg-white/[0.06] overflow-hidden">
        <div className="absolute inset-y-0 bg-gradient-to-r from-emerald-500/70 to-teal-400/70 rounded" style={{ left: `${start}%`, width: `${width}%` }} />
        <div className="absolute inset-y-0 left-0 w-[27%] bg-indigo-500/20" />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-slate-500"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
      <p className="mt-2 text-xs text-emerald-300">08:30 – 15:10 · oyun ve sosyal medya kapalı</p>
    </div>
  )
}

function Sos() {
  return (
    <div className="flex justify-center py-3">
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-rose-500/50 animate-ping-slow" />
        <span className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-red-600 grid place-items-center shadow-[0_0_40px_rgba(244,63,94,0.6)]">
          <Siren className="w-9 h-9 text-white" />
        </span>
      </div>
    </div>
  )
}
