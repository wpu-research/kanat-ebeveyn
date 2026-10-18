import { useState } from 'react'
import { Check, EyeOff, MessageCircleHeart, Phone, ShieldCheck } from 'lucide-react'
import { alerts as initial, categoryInfo, type Child, type RiskAlert } from '../data'
import { IosNotice } from './Overview'

const sevStyle = {
  yuksek: { label: 'Yüksek', cls: 'bg-red-500' },
  orta: { label: 'Orta', cls: 'bg-amber-500' },
  dusuk: { label: 'Düşük', cls: 'bg-slate-400' },
}

const guidance: Record<RiskAlert['category'], string> = {
  zorbalik: 'Suçlamadan konuşun, yalnız olmadığını hissettirin. Gerekirse okul rehberlik servisiyle iletişime geçin.',
  grooming: 'Hesabı engelleyip bildirin, mesajları silmeyin. Ciddi durumda 155 veya ihbarweb.org.tr üzerinden bildirimde bulunun.',
  'kendine-zarar': 'Sakin ve yargısız bir konuşma açın. Destek için 112 veya bir uzmana başvurun.',
  madde: 'Merakla soru sorun, ders vermekten kaçının. Gerekirse bir uzmana danışın.',
  mustehcen: 'Yaşa uygun bir dille konuşun. Web filtresi seviyesini gözden geçirin.',
}

export default function Alerts({ child }: { child: Child }) {
  const [items, setItems] = useState(initial)
  const [filter, setFilter] = useState<'hepsi' | 'yeni'>('hepsi')

  if (child.platform === 'ios') {
    return (
      <div className="max-w-3xl mx-auto">
        <IosNotice />
      </div>
    )
  }

  const list = items.filter((a) => a.childId === child.id && (filter === 'hepsi' || a.status === 'yeni'))
  const markRead = (id: string) => setItems((s) => s.map((a) => (a.id === id ? { ...a, status: 'incelendi' } : a)))

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="card p-4 flex gap-3 items-start bg-indigo-50/60 border-indigo-100">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700 leading-relaxed">
          Analiz <strong>{child.name}'in cihazında</strong> yapılır. Mesajların tamamı size veya sunucuya gönderilmez. Yalnızca risk
          kategorisi ve kişisel bilgileri maskelenmiş kısa bir bağlam gösterilir.
        </p>
      </div>

      <div className="flex gap-2">
        {(['hepsi', 'yeni'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3 py-1.5 rounded-full border ${filter === f ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white'}`}
          >
            {f === 'hepsi' ? 'Tümü' : 'Yeni'}
          </button>
        ))}
      </div>

      {list.length === 0 && <div className="card p-8 text-center text-slate-500 text-sm">Yeni uyarı yok 🎉</div>}

      {list.map((a) => (
        <article key={a.id} className={`card p-5 ${a.status === 'yeni' ? 'ring-1 ring-red-200' : ''}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryInfo[a.category].color}`}>{categoryInfo[a.category].label}</span>
            <span className="text-xs flex items-center gap-1 text-slate-500">
              <span className={`w-2 h-2 rounded-full ${sevStyle[a.severity].cls}`} /> {sevStyle[a.severity].label} risk
            </span>
            <span className="ml-auto text-xs text-slate-400">{a.app} · {a.time}</span>
          </div>
          <h3 className="font-semibold mt-3">{a.summary}</h3>
          <div className="mt-2 p-3 rounded-lg bg-slate-50 text-sm text-slate-600 flex gap-2">
            <EyeOff className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
            <span className="italic">{a.context}</span>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-emerald-50 text-sm text-emerald-900 flex gap-2">
            <MessageCircleHeart className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{guidance[a.category]}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {a.status === 'yeni' ? (
              <button onClick={() => markRead(a.id)} className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white flex items-center gap-1.5 hover:bg-indigo-700">
                <Check className="w-4 h-4" /> İncelendi olarak işaretle
              </button>
            ) : (
              <span className="text-sm text-slate-400 flex items-center gap-1.5"><Check className="w-4 h-4" /> İncelendi</span>
            )}
            <button className="text-sm px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 hover:bg-slate-50">
              <Phone className="w-4 h-4" /> {child.name}'i ara
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
