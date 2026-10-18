import { useMemo, useState } from 'react'
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, ShieldAlert, Lock, UserX, Info } from 'lucide-react'
import { calls, fmtDur, type Child, type CallLog } from '../data'

const dirMeta = {
  gelen: { icon: PhoneIncoming, color: 'text-emerald-600', label: 'Gelen' },
  giden: { icon: PhoneOutgoing, color: 'text-sky-600', label: 'Giden' },
  cevapsiz: { icon: PhoneMissed, color: 'text-red-500', label: 'Cevapsız' },
}

export default function CallLog({ child }: { child: Child }) {
  const [filter, setFilter] = useState<'hepsi' | 'bilinmeyen'>('hepsi')
  const list = calls[child.id] ?? []

  const shown = useMemo(
    () => (filter === 'bilinmeyen' ? list.filter((c) => !c.known) : list),
    [list, filter],
  )
  const risky = list.filter((c) => c.risky).length
  const totalMin = Math.round(list.reduce((s, c) => s + c.duration, 0) / 60)

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="card p-4 flex gap-3 items-start bg-indigo-50/60 border-indigo-100">
        <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700 leading-relaxed">
          Yalnızca <strong>arama meta-verisi</strong> gösterilir: kiminle, ne zaman, ne kadar konuşuldu. Görüşmelerin sesi
          <strong> kaydedilmez ve dinlenmez</strong>. Numaraların son hanesi gizlenir.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Toplam arama" value={String(list.length)} />
        <Stat label="Konuşma süresi" value={`${totalMin} dk`} />
        <Stat label="Riskli numara" value={String(risky)} tone={risky ? 'red' : undefined} />
      </div>

      <div className="flex gap-2">
        {(['hepsi', 'bilinmeyen'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              filter === f ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white'
            }`}
          >
            {f === 'hepsi' ? 'Tümü' : 'Bilinmeyen numaralar'}
          </button>
        ))}
      </div>

      <div className="card divide-y divide-slate-100">
        {shown.map((c) => (
          <CallRow key={c.id} call={c} />
        ))}
        {shown.length === 0 && <p className="p-6 text-center text-sm text-slate-500">Kayıt yok.</p>}
      </div>

      <p className="text-xs text-slate-400 flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        Üretimde arama geçmişi Android'de okunur; iOS arama kaydını üçüncü parti uygulamaya vermez.
      </p>
    </div>
  )
}

function CallRow({ call }: { call: CallLog }) {
  const { icon: Icon, color, label } = dirMeta[call.dir]
  return (
    <div className="flex items-center gap-3 p-4">
      <span className={`w-9 h-9 rounded-full bg-slate-50 grid place-items-center ${color}`}>
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900 truncate">{call.name ?? 'Bilinmeyen numara'}</span>
          {!call.known && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 flex items-center gap-1">
              <UserX className="w-3 h-3" /> rehberde yok
            </span>
          )}
          {call.risky && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> riskli
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">{call.number} · {label}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm text-slate-600">{fmtDur(call.duration)}</p>
        <p className="text-xs text-slate-400">{call.time}</p>
      </div>
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'red' }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold ${tone === 'red' ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
    </div>
  )
}
