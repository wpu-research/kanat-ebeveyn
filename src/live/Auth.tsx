import { useState, type FormEvent } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Wing from '../Wing'
import { api, setToken } from './api'

export default function Auth({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [mode, setMode] = useState<'giris' | 'kayit'>('giris')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const r = await api<{ token: string }>(mode === 'giris' ? '/auth/login' : '/auth/register', {
        body: mode === 'giris' ? { email, password } : { name, email, password },
      })
      setToken(r.token)
      onDone()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const input = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

  return (
    <div className="min-h-full grid place-items-center bg-slate-900 px-4 py-10">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Tanıtıma dön
        </button>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Wing size={32} radius={8} />
            <span className="font-semibold text-lg text-slate-900">Kanat · Ebeveyn paneli</span>
          </div>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 mb-5 text-sm">
            {(['giris', 'kayit'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-2 rounded-lg transition ${mode === m ? 'bg-white shadow-sm font-medium text-slate-900' : 'text-slate-500'}`}
              >
                {m === 'giris' ? 'Giriş yap' : 'Hesap oluştur'}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="space-y-3">
            {mode === 'kayit' && (
              <input className={input} placeholder="Adınız" value={name} onChange={(e) => setName(e.target.value)} required />
            )}
            <input className={input} type="email" placeholder="E-posta" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input
              className={input}
              type="password"
              placeholder={mode === 'kayit' ? 'Şifre (en az 8 karakter)' : 'Şifre'}
              autoComplete={mode === 'kayit' ? 'new-password' : 'current-password'}
              minLength={mode === 'kayit' ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              disabled={busy}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'giris' ? 'Giriş yap' : 'Hesap oluştur'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
