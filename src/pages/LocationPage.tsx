import { useState } from 'react'
import { Home, School, Bus, Dumbbell, Plus, Navigation, Clock } from 'lucide-react'
import MapView from '../components/MapView'
import { geofences, timeline, type Child, type Geofence } from '../data'

const kindIcon = { ev: Home, okul: School, servis: Bus, kurs: Dumbbell }
const kindTone = {
  ev: 'bg-indigo-50 text-indigo-600',
  okul: 'bg-emerald-50 text-emerald-600',
  servis: 'bg-amber-50 text-amber-600',
  kurs: 'bg-cyan-50 text-cyan-600',
}

export default function LocationPage({ child }: { child: Child }) {
  const [fences, setFences] = useState<Record<string, Geofence[]>>(geofences)
  const list = fences[child.id]

  const toggle = (id: string) =>
    setFences((f) => ({ ...f, [child.id]: f[child.id].map((g) => (g.id === id ? { ...g, notify: !g.notify } : g)) }))

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-5">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div>
              <h3 className="font-semibold">{child.name} şu an: {child.location.place}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> {child.location.since}'den beri · 1 dk önce güncellendi
              </p>
            </div>
            <button className="ml-auto text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white flex items-center gap-1.5 hover:bg-indigo-700">
              <Navigation className="w-4 h-4" /> Yol tarifi
            </button>
          </div>
          <MapView child={child} height={460} />
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
            <Legend color="#6366f1" label="Ev" />
            <Legend color="#10b981" label="Okul" />
            <Legend color="#f59e0b" label="Servis" />
            <Legend color="#06b6d4" label="Kurs" />
            <span>Kesikli çizgi = bildirim kapalı</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-5">
          <div className="flex items-center mb-4">
            <h3 className="font-semibold">Güvenli bölgeler</h3>
            <button className="ml-auto text-sm text-indigo-600 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Ekle
            </button>
          </div>
          <div className="space-y-2">
            {list.map((g) => {
              const Icon = kindIcon[g.kind]
              return (
                <div key={g.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50">
                  <span className={`w-9 h-9 rounded-lg grid place-items-center ${kindTone[g.kind]}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{g.name}</p>
                    <p className="text-xs text-slate-400">{g.radius} m yarıçap</p>
                  </div>
                  <Switch on={g.notify} onChange={() => toggle(g.id)} />
                </div>
              )
            })}
          </div>
          <p className="text-xs text-slate-400 mt-3">Giriş ve çıkışlarda bildirim alırsınız.</p>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-3">Konum geçmişi</h3>
          <ul className="space-y-2.5">
            {timeline[child.id].filter((e) => e.kind !== 'uyari').map((e, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-slate-400 w-11 shrink-0">{e.time}</span>
                {e.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}

export function Switch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className={`ml-auto w-10 h-6 rounded-full relative transition shrink-0 ${on ? 'bg-indigo-600' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${on ? 'left-5' : 'left-1'}`} />
    </button>
  )
}
