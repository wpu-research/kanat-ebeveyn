import { useEffect, useState } from 'react'
import {
  LayoutDashboard, MapPin, Smartphone, ShieldAlert, SlidersHorizontal, Bell, Menu, X, Phone, ArrowLeft,
} from 'lucide-react'
import { children, alerts, type Child } from './data'
import Overview from './pages/Overview'
import LocationPage from './pages/LocationPage'
import ScreenTime from './pages/ScreenTime'
import Alerts from './pages/Alerts'
import Rules from './pages/Rules'
import CallLog from './pages/CallLog'
import Landing from './Landing'
import Wing from './Wing'
import Auth from './live/Auth'
import LivePanel from './live/LivePanel'
import { getToken } from './live/api'

type Mode = 'landing' | 'demo' | 'giris' | 'canli'

// Gerçek (canlı) panel /panel adresinde; demo mock veriyle çalışmaya devam eder.
const initialMode = (): Mode => (location.pathname.startsWith('/panel') ? (getToken() ? 'canli' : 'giris') : 'landing')

export default function App() {
  const [mode, setModeState] = useState<Mode>(initialMode)
  const setMode = (m: Mode) => {
    history.pushState(null, '', m === 'giris' || m === 'canli' ? '/panel' : '/')
    setModeState(m)
  }
  useEffect(() => {
    const onPop = () => setModeState(initialMode())
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  if (mode === 'landing') return <Landing onEnterDemo={() => setMode('demo')} onLogin={() => setMode(getToken() ? 'canli' : 'giris')} />
  if (mode === 'giris') return <Auth onDone={() => setMode('canli')} onBack={() => setMode('landing')} />
  if (mode === 'canli') return <LivePanel onLogout={() => setMode('giris')} />
  return <Panel onExit={() => setMode('landing')} />
}

export type PageId = 'genel' | 'konum' | 'ekran' | 'arama' | 'uyari' | 'kural'

const nav: { id: PageId; label: string; icon: typeof MapPin }[] = [
  { id: 'genel', label: 'Genel Bakış', icon: LayoutDashboard },
  { id: 'konum', label: 'Konum', icon: MapPin },
  { id: 'ekran', label: 'Ekran Süresi', icon: Smartphone },
  { id: 'arama', label: 'Arama Kayıtları', icon: Phone },
  { id: 'uyari', label: 'Risk Uyarıları', icon: ShieldAlert },
  { id: 'kural', label: 'Kurallar', icon: SlidersHorizontal },
]

function Panel({ onExit }: { onExit: () => void }) {
  const [page, setPage] = useState<PageId>('genel')
  const [childId, setChildId] = useState(children[0].id)
  const [menuOpen, setMenuOpen] = useState(false)
  const child = children.find((c) => c.id === childId)!
  const newAlerts = alerts.filter((a) => a.status === 'yeni').length

  const go = (p: PageId) => {
    setPage(p)
    setMenuOpen(false)
  }

  return (
    <div className="flex h-full">
      {/* Kenar çubuğu */}
      <aside
        className={`fixed inset-y-0 left-0 z-[1100] w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform lg:static lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
          <Wing size={32} radius={8} />
          <span className="text-white font-semibold text-lg">Kanat</span>
          <button className="ml-auto lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Menüyü kapat">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                page === id ? 'bg-indigo-500/15 text-white' : 'hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${page === id ? 'text-indigo-400' : ''}`} />
              {label}
              {id === 'uyari' && newAlerts > 0 && (
                <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{newAlerts}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="m-3 p-3 rounded-xl bg-white/5 text-xs leading-relaxed">
          <p className="text-white font-medium mb-1">Mahremiyet öncelikli</p>
          Mesajların tamamı ebeveyne gösterilmez. Cihazdaki yapay zekâ yalnızca risk sinyali ve kısa,
          maskelenmiş bir bağlam iletir.
        </div>
        <button onClick={onExit} className="mx-3 mb-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-white/5">
          <ArrowLeft className="w-4 h-4" /> Tanıtıma dön
        </button>
        <div className="px-5 py-3 text-[11px] text-slate-500 border-t border-white/10">Demo · Mock veri</div>
      </aside>
      {menuOpen && (
        <div className="fixed inset-0 z-[1050] bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)} />
      )}

      {/* İçerik */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 lg:px-8 shrink-0">
          <button className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Menüyü aç">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-slate-900 hidden sm:block">{nav.find((n) => n.id === page)!.label}</h1>
          <div className="ml-auto flex items-center gap-2">
            {children.map((c) => (
              <ChildChip key={c.id} child={c} active={c.id === childId} onClick={() => setChildId(c.id)} />
            ))}
            <button
              onClick={() => go('uyari')}
              className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-slate-100"
              aria-label="Bildirimler"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {newAlerts > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {page === 'genel' && <Overview child={child} onNavigate={go} />}
          {page === 'konum' && <LocationPage child={child} />}
          {page === 'ekran' && <ScreenTime child={child} />}
          {page === 'arama' && <CallLog child={child} />}
          {page === 'uyari' && <Alerts child={child} />}
          {page === 'kural' && <Rules key={child.id} child={child} />}
        </main>
      </div>
    </div>
  )
}

function ChildChip({ child, active, onClick }: { child: Child; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border text-sm transition ${
        active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'
      }`}
    >
      <span className="w-7 h-7 rounded-full grid place-items-center text-white text-xs font-semibold" style={{ background: child.color }}>
        {child.avatar}
      </span>
      {child.name}
    </button>
  )
}
