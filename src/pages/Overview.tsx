import { Battery, MapPin, Smartphone, ShieldAlert, GraduationCap, ChevronRight, Apple, Bot } from 'lucide-react'
import MapView from '../components/MapView'
import { alerts, appUsage, timeline, tierInfo, categoryInfo, fmtMin, type Child } from '../data'
import type { PageId } from '../App'

export default function Overview({ child, onNavigate }: { child: Child; onNavigate: (p: PageId) => void }) {
  const childAlerts = alerts.filter((a) => a.childId === child.id)
  const open = childAlerts.filter((a) => a.status === 'yeni')
  const pct = Math.round((child.screenToday / child.screenLimit) * 100)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Profil şeridi */}
      <div className="card p-5 flex flex-wrap items-center gap-4">
        <span className="w-14 h-14 rounded-2xl grid place-items-center text-white text-xl font-semibold" style={{ background: child.color }}>
          {child.avatar}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900">{child.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {tierInfo[child.tier].label} profili · {child.age} yaş
            </span>
          </div>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
            {child.platform === 'ios' ? <Apple className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            {child.device}
            <span className={`ml-2 w-2 h-2 rounded-full ${child.online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            {child.online ? 'Çevrimiçi' : 'Çevrimdışı'}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm text-slate-600">
          <Battery className={`w-5 h-5 ${child.battery < 35 ? 'text-red-500' : 'text-emerald-500'}`} />
          %{child.battery}
        </div>
      </div>

      {/* Özet kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={MapPin} tone="indigo" label="Şu an" value={child.location.place} sub={`${child.location.since}'den beri`} />
        <Stat icon={Smartphone} tone="sky" label="Bugünkü ekran süresi" value={fmtMin(child.screenToday)} sub={`Limitin %${pct}'i`} />
        <Stat
          icon={ShieldAlert}
          tone={open.length ? 'red' : 'emerald'}
          label="Açık risk uyarısı"
          value={child.platform === 'ios' ? '—' : String(open.length)}
          sub={child.platform === 'ios' ? "iOS'ta desteklenmiyor" : 'Son 7 gün'}
        />
        <Stat icon={GraduationCap} tone="emerald" label="Okul saati modu" value="Aktif" sub="08:30 – 15:10" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center mb-4">
            <h3 className="font-semibold">Canlı konum</h3>
            <button onClick={() => onNavigate('konum')} className="ml-auto text-sm text-indigo-600 flex items-center">
              Detay <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <MapView child={child} height={320} />
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4">Bugün</h3>
          <ol className="relative border-l border-slate-200 ml-2 space-y-4">
            {timeline[child.id].map((e, i) => (
              <li key={i} className="pl-4">
                <span
                  className={`absolute -left-1.5 w-3 h-3 rounded-full border-2 border-white ${
                    { giris: 'bg-emerald-500', cikis: 'bg-slate-400', uyari: 'bg-amber-500', bilgi: 'bg-indigo-500' }[e.kind]
                  }`}
                />
                <p className="text-xs text-slate-400">{e.time}</p>
                <p className="text-sm">{e.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center mb-4">
            <h3 className="font-semibold">En çok kullanılan uygulamalar</h3>
            <button onClick={() => onNavigate('ekran')} className="ml-auto text-sm text-indigo-600 flex items-center">
              Tümü <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {appUsage[child.id].slice(0, 4).map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg grid place-items-center text-white text-xs font-bold" style={{ background: a.color }}>
                  {a.name[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex text-sm">
                    <span className="font-medium">{a.name}</span>
                    <span className="ml-auto text-slate-500">{fmtMin(a.minutes)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full mt-1.5">
                    <div
                      className={`h-full rounded-full ${a.limit && a.minutes >= a.limit ? 'bg-red-500' : 'bg-indigo-500'}`}
                      style={{ width: `${Math.min(100, (a.minutes / (a.limit ?? 90)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center mb-4">
            <h3 className="font-semibold">Son risk uyarıları</h3>
            <button onClick={() => onNavigate('uyari')} className="ml-auto text-sm text-indigo-600 flex items-center">
              Tümü <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {child.platform === 'ios' ? (
            <IosNotice />
          ) : (
            <div className="space-y-3">
              {childAlerts.slice(0, 3).map((a) => (
                <div key={a.id} className="flex gap-3 p-3 rounded-xl bg-slate-50">
                  <span className={`text-[11px] h-fit px-2 py-0.5 rounded-full whitespace-nowrap ${categoryInfo[a.category].color}`}>
                    {categoryInfo[a.category].label}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm">{a.summary}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.app} · {a.time}</p>
                  </div>
                  {a.status === 'yeni' && <span className="ml-auto mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const tones = {
  indigo: 'bg-indigo-50 text-indigo-600',
  sky: 'bg-sky-50 text-sky-600',
  red: 'bg-red-50 text-red-600',
  emerald: 'bg-emerald-50 text-emerald-600',
}

function Stat({ icon: Icon, tone, label, value, sub }: { icon: typeof MapPin; tone: keyof typeof tones; label: string; value: string; sub: string }) {
  return (
    <div className="card p-4">
      <span className={`w-9 h-9 rounded-lg grid place-items-center ${tones[tone]}`}>
        <Icon className="w-4 h-4" />
      </span>
      <p className="text-xs text-slate-500 mt-3">{label}</p>
      <p className="font-semibold text-slate-900 truncate">{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  )
}

export function IosNotice() {
  return (
    <div className="p-4 rounded-xl bg-slate-50 text-sm text-slate-600 leading-relaxed">
      <p className="font-medium text-slate-800 flex items-center gap-1.5 mb-1">
        <Apple className="w-4 h-4" /> iOS'ta mesaj analizi yapılamaz
      </p>
      Apple, bir uygulamanın başka uygulamaların mesajlarını okumasına izin vermez. iPhone kullanan çocuklar için konum,
      ekran süresi (Screen Time) ve web filtresi sunulur.
    </div>
  )
}
