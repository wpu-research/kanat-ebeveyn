import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import { getToken, heartbeat, sendLocations, UnpairedError, type Point } from './api'

// Konum paylaşımı: Android'de kalıcı bildirimle (foreground service), iOS'ta mavi gösterge ile
// çalışır — çocuk paylaşımın açık olduğunu her zaman görür.
export const LOCATION_TASK = 'kanat-location'

// Gönderilemeyen noktalar bir sonraki denemede tekrar yollanır (uygulama yaşadıkça).
let pending: Point[] = []
let lastHeartbeat = 0
// Android aynı (önbellekteki) konumu tekrar verebilir; zaten kuyruğa alınmış zaman damgalarını atla.
let lastQueuedAt = ''

export async function flush(points: Point[] = []) {
  const fresh = points.filter((p) => p.at > lastQueuedAt)
  if (fresh.length) lastQueuedAt = fresh[fresh.length - 1].at
  pending = [...pending, ...fresh].slice(-500)
  if (!pending.length || !(await getToken())) return
  const batch = pending
  try {
    await sendLocations(batch)
    pending = pending.slice(batch.length)
  } catch (e) {
    if (e instanceof UnpairedError) {
      pending = []
      await stopTracking()
    }
  }
  if (Date.now() - lastHeartbeat > 60_000) {
    lastHeartbeat = Date.now()
    await heartbeat().catch(() => {})
  }
}

export const toPoint = (l: Location.LocationObject): Point => ({
  lat: l.coords.latitude,
  lng: l.coords.longitude,
  accuracy: l.coords.accuracy ?? null,
  at: new Date(l.timestamp).toISOString(),
})

// Görev en üst seviyede tanımlanmalı (uygulama arka planda uyandırıldığında da yüklenir).
TaskManager.defineTask<{ locations: Location.LocationObject[] }>(LOCATION_TASK, async ({ data, error }) => {
  if (error || !data) return
  await flush(data.locations.map(toPoint))
})

export type TrackingStatus = 'kapali' | 'on-plan' | 'arka-plan'

export async function startTracking(): Promise<TrackingStatus> {
  const fg = await Location.requestForegroundPermissionsAsync()
  if (fg.status !== 'granted') return 'kapali'
  const bg = await Location.requestBackgroundPermissionsAsync()
  if (bg.status !== 'granted') return 'on-plan'
  if (!(await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK))) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60_000,
      distanceInterval: 25,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Kanat konumunu ailenle paylaşıyor',
        notificationBody: 'Ailen yalnızca konumunu ve pil durumunu görebilir.',
        notificationColor: '#4F46E5',
      },
    })
  }
  return 'arka-plan'
}

export async function stopTracking() {
  if (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK)) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK).catch(() => {})
  }
}

export async function trackingStatus(): Promise<TrackingStatus> {
  const fg = await Location.getForegroundPermissionsAsync()
  if (fg.status !== 'granted') return 'kapali'
  return (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)) ? 'arka-plan' : 'on-plan'
}

// Uygulama açıkken anlık konum (arka plan izni verilmemişse tek kaynak budur).
export async function sendCurrentLocation() {
  try {
    const l = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
    await flush([toPoint(l)])
    return toPoint(l)
  } catch {
    return null
  }
}
