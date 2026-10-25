import * as SecureStore from 'expo-secure-store'
import * as Battery from 'expo-battery'
import Constants from 'expo-constants'

// Derleme sırasında EXPO_PUBLIC_API_URL ile değiştirilebilir (bkz. README).
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'https://kanat-panel-production.up.railway.app').replace(/\/$/, '')

const TOKEN_KEY = 'kanat.deviceToken'
const CHILD_KEY = 'kanat.child'

export interface PairedChild {
  id: string
  name: string
  color: string
}

export interface DeviceState {
  child: { name: string; color: string }
  rules: { dailyLimitMin: number }
  extraMinutesToday: number
  requests: { id: number; minutes: number; status: 'yeni' | 'onaylandi' | 'reddedildi' | 'incelendi'; at: string }[]
}

export const appVersion = Constants.expoConfig?.version ?? null

export class UnpairedError extends Error {}

let cachedToken: string | null | undefined

export async function getToken() {
  if (cachedToken === undefined) cachedToken = await SecureStore.getItemAsync(TOKEN_KEY)
  return cachedToken
}

export async function getPairedChild(): Promise<PairedChild | null> {
  if (!(await getToken())) return null
  const raw = await SecureStore.getItemAsync(CHILD_KEY)
  return raw ? JSON.parse(raw) : null
}

export async function clearPairing() {
  cachedToken = null
  await SecureStore.deleteItemAsync(TOKEN_KEY)
  await SecureStore.deleteItemAsync(CHILD_KEY)
}

async function request<T>(path: string, body?: unknown, auth = true): Promise<T> {
  const token = auth ? await getToken() : null
  if (auth && !token) throw new UnpairedError('Eşleşme yok')
  const res = await fetch(`${API_URL}/api${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && auth) {
    // Ebeveyn panelden eşleşmeyi kaldırdı.
    await clearPairing()
    throw new UnpairedError(data.error ?? 'Eşleşme kaldırıldı')
  }
  if (!res.ok) throw new Error(data.error ?? `Sunucu hatası (${res.status})`)
  return data as T
}

export async function pair(code: string, deviceName: string | null, platform: string) {
  const r = await request<{ token: string; child: PairedChild }>(
    '/device/pair',
    { code, deviceName, platform, appVersion },
    false,
  )
  cachedToken = r.token
  await SecureStore.setItemAsync(TOKEN_KEY, r.token)
  await SecureStore.setItemAsync(CHILD_KEY, JSON.stringify(r.child))
  return r.child
}

export async function heartbeat() {
  let battery: number | null = null
  let charging: boolean | null = null
  try {
    battery = await Battery.getBatteryLevelAsync()
    const st = await Battery.getBatteryStateAsync()
    charging = st === Battery.BatteryState.CHARGING || st === Battery.BatteryState.FULL
  } catch {
    // emülatörde pil bilgisi olmayabilir
  }
  return request<DeviceState>('/device/heartbeat', { battery: battery !== null && battery >= 0 ? battery : null, charging, appVersion })
}

export interface Point {
  lat: number
  lng: number
  accuracy: number | null
  at: string
}

export const sendLocations = (points: Point[]) => request<{ saved: number }>('/device/locations', { points })
export const sendSos = (p: Partial<Point>) => request('/device/sos', p)
export const requestExtraTime = (minutes: number) => request<DeviceState>('/device/extra-time', { minutes })
