// Canlı panel için API istemcisi. Panel ve API aynı sunucudan servis edilir (bkz. server/index.ts).

const TOKEN_KEY = 'kanat.token'

export interface LiveDevice {
  id: string
  name: string | null
  platform: 'android' | 'ios' | null
  appVersion: string | null
  battery: number | null
  charging: boolean | null
  lastSeen: string | null
}

export interface LivePoint {
  lat: number
  lng: number
  accuracy: number | null
  at: string
}

export interface LiveChild {
  id: string
  name: string
  color: string
  rules: { dailyLimitMin: number }
  pairCode: string | null
  pairExpires: string | null
  device: LiveDevice | null
  location: LivePoint | null
  newEvents: number
}

export interface LiveEvent {
  id: string
  kind: 'sos' | 'ek_sure' | 'eslesme' | string
  data: Record<string, any>
  status: 'yeni' | 'incelendi' | 'onaylandi' | 'reddedildi'
  at: string
}

export interface LiveCall {
  contact: string | null
  direction: 'gelen' | 'giden' | 'cevapsiz'
  durationSec: number
  at: string
}

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = (t: string | null) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // depolama kapalıysa oturum yalnız bu sekmede yaşar
  }
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export async function api<T = any>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`/api${path}`, {
    method: init.method ?? (init.body ? 'POST' : 'GET'),
    headers: {
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error ?? `Hata ${res.status}`, res.status)
  return data as T
}

export function ago(iso: string | null) {
  if (!iso) return 'hiç'
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'az önce'
  if (s < 3600) return `${Math.floor(s / 60)} dk önce`
  if (s < 86400) return `${Math.floor(s / 3600)} sa önce`
  return `${Math.floor(s / 86400)} gün önce`
}

export const clock = (iso: string) =>
  new Date(iso).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })

// 10 dakikadan uzun süredir haber yoksa cihaz çevrimdışı sayılır.
export const isOnline = (d: LiveDevice | null) =>
  !!d?.lastSeen && Date.now() - new Date(d.lastSeen).getTime() < 10 * 60_000
