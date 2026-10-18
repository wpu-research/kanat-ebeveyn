import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { Ban, Lock, Plus, Minus } from 'lucide-react'
import { appUsage, weekly, fmtMin, type AppUsage, type Child } from '../data'

export default function ScreenTime({ child }: { child: Child }) {
  const [apps, setApps] = useState<Record<string, AppUsage[]>>(appUsage)
  const list = apps[child.id]
  const pct = Math.min(100, Math.round((child.screenToday / child.screenLimit) * 100))
  const week = weekly[child.id]
  const avg = Math.round(week.reduce((s, d) => s + d.dakika, 0) / week.length)

  const update = (name: string, fn: (a: AppUsage) => AppUsage) =>
    setApps((s) => ({ ...s, [child.id]: s[child.id].map((a) => (a.name === name ? fn(a) : a)) }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5 flex flex-col items-center justify-center">
          <Ring pct={pct} />
          <p className="mt-3 font-semibold text-lg">{fmtMin(child.screenToday)}</p>
          <p className="text-sm text-slate-500">Günlük limit: {fmtMin(child.screenLimit)}</p>
          <div className="flex gap-2 mt-4">
            <button className="text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">+15 dk ver</button>
            <button className="text-sm px-3 py-2 rounded-lg bg-slate-900 text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Cihazı kilitle
            </button>
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="flex items-baseline mb-4">
            <h3 className="font-semibold">Bu hafta</h3>
            <span className="ml-auto text-sm text-slate-500">Ortalama {fmtMin(avg)} / gün</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week} margin={{ left: -20 }}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip formatter={(v: number) => fmtMin(v)} cursor={{ fill: '#f1f5f9' }} />
                <ReferenceLine y={child.screenLimit} stroke="#ef4444" strokeDasharray="4 4" />
                <Bar dataKey="dakika" radius={[6, 6, 0, 0]}>
                  {week.map((d) => (
                    <Cell key={d.day} fill={d.dakika > child.screenLimit ? '#f87171' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2">Kırmızı kesikli çizgi günlük limiti gösterir.</p>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">Uygulamalar ve limitler</h3>
        <div className="divide-y divide-slate-100">
          {list.map((a) => (
            <div key={a.name} className="flex flex-wrap items-center gap-3 py-3">
              <span className="w-10 h-10 rounded-xl grid place-items-center text-white font-bold" style={{ background: a.color }}>
                {a.name[0]}
              </span>
              <div className="min-w-0 w-40">
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-xs text-slate-400">{a.category}</p>
              </div>
              <div className="flex-1 min-w-[120px]">
                {a.blocked ? (
                  <span className="text-xs text-red-600 flex items-center gap-1"><Ban className="w-3.5 h-3.5" /> Engellendi</span>
                ) : (
                  <>
                    <div className="flex text-xs text-slate-500 mb-1">
                      {fmtMin(a.minutes)}
                      <span className="ml-auto">{a.limit ? `Limit ${fmtMin(a.limit)}` : 'Limitsiz'}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div
                        className={`h-full rounded-full ${a.limit && a.minutes >= a.limit ? 'bg-red-500' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.min(100, (a.minutes / (a.limit ?? 120)) * 100)}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                {!a.blocked && (
                  <>
                    <IconBtn label="Limiti azalt" onClick={() => update(a.name, (x) => ({ ...x, limit: Math.max(15, (x.limit ?? 60) - 15) }))}>
                      <Minus className="w-3.5 h-3.5" />
                    </IconBtn>
                    <IconBtn label="Limiti artır" onClick={() => update(a.name, (x) => ({ ...x, limit: (x.limit ?? 45) + 15 }))}>
                      <Plus className="w-3.5 h-3.5" />
                    </IconBtn>
                  </>
                )}
                <button
                  onClick={() => update(a.name, (x) => ({ ...x, blocked: !x.blocked }))}
                  className={`text-xs px-3 py-1.5 rounded-lg border ml-1 ${
                    a.blocked ? 'border-slate-200 hover:bg-slate-50' : 'border-red-200 text-red-600 hover:bg-red-50'
                  }`}
                >
                  {a.blocked ? 'İzin ver' : 'Engelle'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IconBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button aria-label={label} onClick={onClick} className="w-7 h-7 grid place-items-center rounded-lg border border-slate-200 hover:bg-slate-50">
      {children}
    </button>
  )
}

function Ring({ pct }: { pct: number }) {
  const r = 54
  const c = 2 * Math.PI * r
  const color = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#6366f1'
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 70 70)"
      />
      <text x="70" y="78" textAnchor="middle" fontSize="26" fontWeight="600" fill="#0f172a">%{pct}</text>
    </svg>
  )
}
