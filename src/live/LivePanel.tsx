import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  AlertTriangle, BatteryCharging, BatteryMedium, Check, Clock, KeyRound, LogOut, MapPin, Phone, Plus,
  RefreshCw, Smartphone, Trash2, Unlink, X,
} from 'lucide-react'
import Wing from '../Wing'
import { ago, api, clock, isOnline, setToken, type LiveCall, type LiveChild, type LiveEvent, type LivePoint } from './api'

const POLL_MS = 15_000

function usePoll<T>(path: string | null, initial: T) {
  const [data, setData] = useState<T>(initial)
  const load = useCallback(async () => {
    if (!path) return
    try {
      setData(await api<T>(path))
    } catch {
      // geçici ağ hatası: bir sonraki turda yeniden denenir
    }
  }, [path])
  useEffect(() => {
    setData(initial)
    load()
    const t = setInterval(load, POLL_MS)
    return () => clearInterval(t)
  }, [load])
  return [data, load] as const
}

export default function LivePanel({ onLogout }: { onLogout: () => void }) {
  const [me, setMe] = useState<{ name: string; email: string } | null>(null)
  const [kids, reloadKids] = usePoll<LiveChild[] | null>('/children', null)
  const [selected, setSelected] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    api('/me').then(setMe).catch(() => logout())
  }, [])

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    setToken(null)
    onLogout()
  }

  const child = kids?.find((k) => k.id === selected) ?? kids?.[0] ?? null

  return (
    <div className="min-h-full flex flex-col">
      <header className="h-16 bg-slate-900 text-white flex items-center gap-3 px-4 lg:px-8 shrink-0">
        <Wing size={30} radius={8} />
        <span className="font-semibold">Kanat</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Canlı</span>
        <span className="ml-auto text-sm text-slate-400 hidden sm:block">{me?.name}</span>
        <button onClick={logout} className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white px-2 py-1.5">
          <LogOut className="w-4 h-4" /> Çıkış
        </button>
      </header>

      <div className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {kids?.map((k) => (
            <button
              key={k.id}
              onClick={() => setSelected(k.id)}
              className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border text-sm transition ${
                k.id === child?.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <span className="relative w-7 h-7 rounded-full grid place-items-center text-white text-xs font-semibold" style={{ background: k.color }}>
                {k.name[0]?.toUpperCase()}
                <span className={`absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${isOnline(k.device) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </span>
              {k.name}
              {k.newEvents > 0 && <span className="text-xs bg-red-500 text-white rounded-full px-1.5">{k.newEvents}</span>}
            </button>
          ))}
          <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-sm text-slate-600 hover:bg-white">
            <Plus className="w-4 h-4" /> Çocuk ekle
          </button>
        </div>

        {kids === null && <p className="text-slate-500 text-sm">Yükleniyor…</p>}
        {kids?.length === 0 && (
          <div className="card p-8 text-center max-w-lg mx-auto">
            <Smartphone className="w-10 h-10 mx-auto text-indigo-500" />
            <h2 className="font-semibold text-lg mt-3">İlk telefonu bağlayın</h2>
            <p className="text-sm text-slate-500 mt-2">
              Çocuğunuzu ekleyin, size 6 haneli bir eşleştirme kodu verelim. Kodu çocuğun telefonundaki Kanat uygulamasına girdiğinizde
              konum ve durum bilgisi burada görünür.
            </p>
            <button onClick={() => setAdding(true)} className="mt-5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
              Çocuk ekle
            </button>
          </div>
        )}
        {child && <ChildView key={child.id} child={child} onChange={reloadKids} />}
      </div>

      {adding && (
        <AddChild
          onClose={() => setAdding(false)}
          onAdded={(id) => {
            setAdding(false)
            setSelected(id)
            reloadKids()
          }}
        />
      )}
    </div>
  )
}

function AddChild({ onClose, onAdded }: { onClose: () => void; onAdded: (id: string) => void }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const submit = async () => {
    try {
      const r = await api<{ id: string }>('/children', { body: { name } })
      onAdded(r.id)
    } catch (e) {
      setError((e as Error).message)
    }
  }
  return (
    <div className="fixed inset-0 z-[2000] bg-black/40 grid place-items-center p-4" onClick={onClose}>
      <div className="card p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center mb-4">
          <h3 className="font-semibold">Çocuk ekle</h3>
          <button onClick={onClose} className="ml-auto" aria-label="Kapat">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <input
          autoFocus
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500"
          placeholder="Adı (ör. Elif)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && submit()}
        />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <button disabled={!name.trim()} onClick={submit} className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold disabled:opacity-50">
          Ekle ve kod oluştur
        </button>
      </div>
    </div>
  )
}

function ChildView({ child, onChange }: { child: LiveChild; onChange: () => void }) {
  const [hours, setHours] = useState(24)
  const [track] = usePoll<LivePoint[]>(`/children/${child.id}/locations?hours=${hours}`, [])
  const [events, reloadEvents] = usePoll<LiveEvent[]>(`/children/${child.id}/events`, [])
  const [usage] = usePoll<{ app: string; minutes: number }[]>(`/children/${child.id}/usage`, [])
  const [calls] = usePoll<LiveCall[]>(`/children/${child.id}/calls`, [])

  const setStatus = async (id: string, status: LiveEvent['status']) => {
    await api(`/events/${id}`, { method: 'PATCH', body: { status } })
    reloadEvents()
    onChange()
  }

  const remove = async (what: 'device' | 'child') => {
    const msg =
      what === 'device'
        ? `${child.name} adlı çocuğun telefonuyla eşleşme kaldırılsın mı? Telefon veri göndermeyi bırakır.`
        : `${child.name} ve tüm kayıtları (konum geçmişi, olaylar) kalıcı olarak silinsin mi?`
    if (!confirm(msg)) return
    await api(what === 'device' ? `/children/${child.id}/devices` : `/children/${child.id}`, { method: 'DELETE' })
    onChange()
  }

  const online = isOnline(child.device)
  const sos = events.filter((e) => e.kind === 'sos' && e.status === 'yeni')

  return (
    <div className="space-y-6">
      {sos.length > 0 && (
        <div className="card p-4 border-red-200 bg-red-50 flex flex-wrap items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div>
            <p className="font-semibold text-red-700">{child.name} yardım istedi</p>
            <p className="text-sm text-red-600">{clock(sos[0].at)} · konumu haritada işaretli</p>
          </div>
          <button onClick={() => sos.forEach((e) => setStatus(e.id, 'incelendi'))} className="ml-auto text-sm px-3 py-2 rounded-lg bg-red-600 text-white">
            Gördüm
          </button>
        </div>
      )}

      {!child.device && <PairCard child={child} onChange={onChange} />}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" /> Konum
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {child.location
                  ? `Son konum ${ago(child.location.at)}${child.location.accuracy ? ` · ±${Math.round(child.location.accuracy)} m` : ''}`
                  : 'Henüz konum gelmedi'}
              </p>
            </div>
            <div className="ml-auto flex gap-1 p-1 rounded-lg bg-slate-100 text-xs">
              {[6, 24, 72].map((h) => (
                <button key={h} onClick={() => setHours(h)} className={`px-2.5 py-1 rounded-md ${hours === h ? 'bg-white shadow-sm font-medium' : 'text-slate-500'}`}>
                  {h} sa
                </button>
              ))}
            </div>
          </div>
          <LiveMap child={child} track={track} />
        </div>

        <div className="space-y-6">
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold">Telefon</h3>
            {child.device ? (
              <>
                <Row icon={Smartphone} label={child.device.name ?? 'Bilinmeyen cihaz'} value={child.device.platform === 'ios' ? 'iOS' : 'Android'} />
                <Row
                  icon={child.device.charging ? BatteryCharging : BatteryMedium}
                  label="Pil"
                  value={child.device.battery != null ? `%${Math.round(child.device.battery * 100)}${child.device.charging ? ' · şarjda' : ''}` : '—'}
                />
                <Row icon={Clock} label="Son görülme" value={<span className={online ? 'text-emerald-600' : ''}>{online ? 'Çevrimiçi' : ago(child.device.lastSeen)}</span>} />
                <button onClick={() => remove('device')} className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 pt-1">
                  <Unlink className="w-3.5 h-3.5" /> Eşleşmeyi kaldır
                </button>
              </>
            ) : (
              <p className="text-sm text-slate-500">Telefon henüz bağlanmadı.</p>
            )}
          </div>

          <RulesCard child={child} onChange={onChange} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Olaylar</h3>
          {events.length === 0 && <p className="text-sm text-slate-500">Henüz olay yok.</p>}
          <ul className="space-y-3">
            {events.slice(0, 30).map((e) => (
              <EventRow key={e.id} e={e} onStatus={setStatus} />
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-3">Bugünkü ekran süresi</h3>
          {usage.length === 0 ? (
            <p className="text-sm text-slate-500">Telefon henüz uygulama kullanım verisi göndermedi.</p>
          ) : (
            <ul className="space-y-2">
              {usage.map((u) => (
                <li key={u.app} className="flex text-sm">
                  <span className="truncate">{u.app}</span>
                  <span className="ml-auto text-slate-500">{u.minutes} dk</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Arama kayıtları
          </h3>
          <p className="text-xs text-slate-400 mb-3">Yalnız kiminle, ne zaman, ne kadar. Ses kaydı yok.</p>
          {calls.length === 0 ? (
            <p className="text-sm text-slate-500">Henüz kayıt yok.</p>
          ) : (
            <ul className="space-y-2">
              {calls.slice(0, 20).map((c, i) => (
                <li key={i} className="flex text-sm gap-2">
                  <span className={c.direction === 'cevapsiz' ? 'text-red-600' : ''}>{c.contact ?? 'Bilinmeyen'}</span>
                  <span className="ml-auto text-slate-500 text-xs">
                    {c.direction} · {Math.round(c.durationSec / 60)} dk · {clock(c.at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button onClick={() => remove('child')} className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1">
        <Trash2 className="w-3.5 h-3.5" /> {child.name} adlı çocuğu ve tüm kayıtlarını sil
      </button>
    </div>
  )
}

function PairCard({ child, onChange }: { child: LiveChild; onChange: () => void }) {
  const refresh = async () => {
    await api(`/children/${child.id}/pair-code`, { method: 'POST' })
    onChange()
  }
  return (
    <div className="card p-5 border-indigo-200 bg-indigo-50/60 flex flex-wrap gap-5 items-center">
      <KeyRound className="w-8 h-8 text-indigo-600" />
      <div className="flex-1 min-w-[240px]">
        <h3 className="font-semibold">{child.name} için telefonu bağlayın</h3>
        <ol className="text-sm text-slate-600 mt-1 list-decimal list-inside space-y-0.5">
          <li>Çocuğun telefonuna Kanat uygulamasını kurun.</li>
          <li>Açılışta <strong>“Çocuğum”</strong> seçeneğine dokunun.</li>
          <li>Aşağıdaki kodu girin ve konum iznini verin.</li>
        </ol>
      </div>
      {child.pairCode ? (
        <div className="text-center">
          <p className="font-mono text-3xl font-bold tracking-[0.3em] text-indigo-700">{child.pairCode}</p>
          <p className="text-xs text-slate-500 mt-1">
            {child.pairExpires && `${new Date(child.pairExpires).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })} tarihine kadar geçerli`}
          </p>
        </div>
      ) : (
        <button onClick={refresh} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Yeni kod oluştur
        </button>
      )}
    </div>
  )
}

function RulesCard({ child, onChange }: { child: LiveChild; onChange: () => void }) {
  const [limit, setLimit] = useState(child.rules.dailyLimitMin)
  const [saved, setSaved] = useState(false)
  const save = async () => {
    await api(`/children/${child.id}`, { method: 'PATCH', body: { rules: { dailyLimitMin: limit } } })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onChange()
  }
  return (
    <div className="card p-5">
      <h3 className="font-semibold mb-3">Günlük ekran süresi sınırı</h3>
      <div className="flex items-center gap-3">
        <input type="range" min={30} max={480} step={15} value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="flex-1 accent-indigo-600" />
        <span className="text-sm w-20 text-right">
          {Math.floor(limit / 60)} sa {limit % 60 ? `${limit % 60} dk` : ''}
        </span>
      </div>
      <button
        onClick={save}
        disabled={limit === child.rules.dailyLimitMin}
        className="mt-3 text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40 flex items-center gap-1.5"
      >
        {saved ? <Check className="w-4 h-4" /> : null} {saved ? 'Kaydedildi' : 'Kaydet'}
      </button>
      <p className="text-xs text-slate-400 mt-2">Telefonda çocuğun görebileceği şekilde gösterilir.</p>
    </div>
  )
}

function EventRow({ e, onStatus }: { e: LiveEvent; onStatus: (id: string, s: LiveEvent['status']) => void }) {
  const text =
    e.kind === 'sos'
      ? 'Yardım istedi (SOS)'
      : e.kind === 'ek_sure'
        ? `+${e.data.minutes} dk ek süre istedi`
        : e.kind === 'eslesme'
          ? `Telefon bağlandı${e.data.deviceName ? ` (${e.data.deviceName})` : ''}`
          : e.kind
  return (
    <li className="text-sm">
      <div className="flex gap-2">
        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${e.kind === 'sos' ? 'bg-red-500' : e.status === 'yeni' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
        <div className="flex-1">
          <p className={e.status === 'yeni' ? 'font-medium' : 'text-slate-600'}>{text}</p>
          <p className="text-xs text-slate-400">
            {clock(e.at)}
            {e.status === 'onaylandi' && ' · onaylandı'}
            {e.status === 'reddedildi' && ' · reddedildi'}
          </p>
        </div>
      </div>
      {e.kind === 'ek_sure' && e.status === 'yeni' && (
        <div className="flex gap-2 mt-2 ml-4">
          <button onClick={() => onStatus(e.id, 'onaylandi')} className="text-xs px-2.5 py-1 rounded-md bg-emerald-600 text-white">Onayla</button>
          <button onClick={() => onStatus(e.id, 'reddedildi')} className="text-xs px-2.5 py-1 rounded-md bg-slate-200">Reddet</button>
        </div>
      )}
    </li>
  )
}

function Row({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-slate-600 truncate">{label}</span>
      <span className="ml-auto font-medium">{value}</span>
    </div>
  )
}

function marker(child: LiveChild) {
  return L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `<div style="position:relative;width:40px;height:40px">
      <span style="position:absolute;inset:6px;border-radius:9999px;background:${child.color};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);display:grid;place-items:center;color:#fff;font:600 12px Inter,sans-serif">${child.name[0]?.toUpperCase() ?? ''}</span>
    </div>`,
  })
}

// Yeni konum gelince haritayı ona kaydırır; kullanıcı haritayı elle gezdiyse zoom'u korur.
function Follow({ pos }: { pos: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (pos) map.panTo(pos)
  }, [map, pos?.[0], pos?.[1]])
  return null
}

function LiveMap({ child, track }: { child: LiveChild; track: LivePoint[] }) {
  const pos: [number, number] | null = child.location ? [child.location.lat, child.location.lng] : null
  return (
    <div className="rounded-xl overflow-hidden h-[420px] bg-slate-100">
      <MapContainer center={pos ?? [39.0, 35.0]} zoom={pos ? 15 : 5} scrollWheelZoom style={{ height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {track.length > 1 && (
          <Polyline positions={track.map((p) => [p.lat, p.lng])} pathOptions={{ color: child.color, weight: 4, opacity: 0.6 }} />
        )}
        {pos && (
          <Marker position={pos} icon={marker(child)}>
            <Tooltip direction="right" offset={[18, 0]}>
              {child.name} · {ago(child.location!.at)}
            </Tooltip>
          </Marker>
        )}
        <Follow pos={pos} />
      </MapContainer>
    </div>
  )
}
