import { useState } from 'react'
import { GraduationCap, Moon, Globe, Download, Check } from 'lucide-react'
import { tierInfo, type AgeTier, type Child } from '../data'
import { Switch } from './LocationPage'

const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum']

export default function Rules({ child }: { child: Child }) {
  const [tier, setTier] = useState<AgeTier>(child.tier)
  const [schoolMode, setSchoolMode] = useState(true)
  const [schoolDays, setSchoolDays] = useState(days)
  const [bedtime, setBedtime] = useState(true)
  const [approval, setApproval] = useState(child.tier === 'kucuk')
  const [filter, setFilter] = useState(child.tier === 'genc' ? 'temel' : 'siki')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Yaş profili */}
      <section className="card p-5">
        <h3 className="font-semibold">Yaş profili</h3>
        <p className="text-sm text-slate-500 mb-4">Çocuk büyüdükçe kurallar gevşer. Profil seçince varsayılan kurallar uygulanır.</p>
        <div className="grid md:grid-cols-3 gap-3">
          {(Object.keys(tierInfo) as AgeTier[]).map((t) => {
            const info = tierInfo[t]
            const active = tier === t
            return (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`text-left p-4 rounded-xl border-2 transition ${active ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-center">
                  <span className="font-semibold">{info.label}</span>
                  <span className="ml-2 text-xs text-slate-500">{info.range}</span>
                  {active && <Check className="w-4 h-4 text-indigo-600 ml-auto" />}
                </div>
                <p className="text-xs text-slate-500 mt-1">{info.desc}</p>
                <ul className="mt-3 space-y-1">
                  {info.rules.map((r) => (
                    <li key={r} className="text-xs text-slate-600 flex gap-1.5">
                      <span className="text-indigo-500">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>
      </section>

      {/* Okul saati */}
      <section className="card p-5">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg grid place-items-center bg-emerald-50 text-emerald-600">
            <GraduationCap className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-semibold">Okul saati modu</h3>
            <p className="text-xs text-slate-500">Ders saatlerinde oyun ve sosyal medya kapanır. Arama, mesaj ve eğitim uygulamaları açık kalır.</p>
          </div>
          <Switch on={schoolMode} onChange={() => setSchoolMode(!schoolMode)} />
        </div>
        {schoolMode && (
          <div className="mt-4 flex flex-wrap items-center gap-4 pl-12">
            <div className="flex gap-1">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setSchoolDays((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d]))}
                  className={`w-10 h-9 text-xs rounded-lg border ${schoolDays.includes(d) ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200'}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <TimeRange from="08:30" to="15:10" />
            <span className="text-xs text-slate-500">📍 Okul bölgesine girince de otomatik başlar</span>
          </div>
        )}
      </section>

      {/* Yatma saati */}
      <section className="card p-5">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg grid place-items-center bg-indigo-50 text-indigo-600">
            <Moon className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-semibold">Yatma saati</h3>
            <p className="text-xs text-slate-500">Cihaz yalnızca arama ve alarm için açık kalır.</p>
          </div>
          <Switch on={bedtime} onChange={() => setBedtime(!bedtime)} />
        </div>
        {bedtime && (
          <div className="mt-4 pl-12">
            <TimeRange from={tier === 'kucuk' ? '21:30' : tier === 'ergen' ? '22:30' : '23:30'} to="07:00" />
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="card p-5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg grid place-items-center bg-sky-50 text-sky-600">
              <Download className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-semibold">Uygulama yükleme onayı</h3>
              <p className="text-xs text-slate-500">Yeni uygulama için izin istenir.</p>
            </div>
            <Switch on={approval} onChange={() => setApproval(!approval)} />
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-9 h-9 rounded-lg grid place-items-center bg-amber-50 text-amber-600">
              <Globe className="w-4 h-4" />
            </span>
            <h3 className="font-semibold">Web filtresi</h3>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
            {[['temel', 'Temel'], ['orta', 'Orta'], ['siki', 'Sıkı']].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`text-sm py-1.5 rounded-md ${filter === v ? 'bg-white shadow-sm font-medium' : 'text-slate-500'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
          {child.name} için kaydet
        </button>
      </div>
    </div>
  )
}

function TimeRange({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <input type="time" defaultValue={from} className="border border-slate-200 rounded-lg px-2 py-1.5" />
      <span className="text-slate-400">–</span>
      <input type="time" defaultValue={to} className="border border-slate-200 rounded-lg px-2 py-1.5" />
    </div>
  )
}
