// Mock veriler — web paneldeki src/data.ts ile aynı; gerçek backend gelene kadar arayüzü besler.

export type Platform = 'android' | 'ios'
export type AgeTier = 'kucuk' | 'ergen' | 'genc'
export type Severity = 'yuksek' | 'orta' | 'dusuk'
export type RiskCategory = 'zorbalik' | 'grooming' | 'kendine-zarar' | 'madde' | 'mustehcen'

export interface Child {
  id: string
  name: string
  age: number
  avatar: string
  color: string
  platform: Platform
  device: string
  battery: number
  online: boolean
  tier: AgeTier
  location: { lat: number; lng: number; place: string; since: string }
  screenToday: number // dakika
  screenLimit: number
}

export interface Geofence {
  id: string
  name: string
  kind: 'ev' | 'okul' | 'servis' | 'kurs'
  lat: number
  lng: number
  radius: number
  notify: boolean
}

export interface RiskAlert {
  id: string
  childId: string
  category: RiskCategory
  severity: Severity
  app: string
  time: string
  summary: string
  context: string // maskelenmiş kısa bağlam, mesajın tamamı değil
  status: 'yeni' | 'incelendi'
}

export interface AppUsage {
  name: string
  category: string
  minutes: number
  limit?: number
  blocked?: boolean
  color: string
}

export interface TimelineEvent {
  time: string
  text: string
  kind: 'giris' | 'cikis' | 'uyari' | 'bilgi'
}

export const children: Child[] = [
  {
    id: 'elif',
    name: 'Elif',
    age: 12,
    avatar: 'E',
    color: '#ec4899',
    platform: 'android',
    device: 'Samsung Galaxy A54',
    battery: 64,
    online: true,
    tier: 'kucuk',
    location: { lat: 40.9875, lng: 29.0365, place: 'Moda İlkokulu', since: '08:12' },
    screenToday: 142,
    screenLimit: 180,
  },
  {
    id: 'can',
    name: 'Can',
    age: 16,
    avatar: 'C',
    color: '#0ea5e9',
    platform: 'ios',
    device: 'iPhone 14',
    battery: 31,
    online: true,
    tier: 'genc',
    location: { lat: 40.9912, lng: 29.0281, place: 'Kadıköy Çarşı', since: '15:40' },
    screenToday: 268,
    screenLimit: 300,
  },
]

export const geofences: Record<string, Geofence[]> = {
  elif: [
    { id: 'g1', name: 'Ev', kind: 'ev', lat: 40.9832, lng: 29.0412, radius: 120, notify: true },
    { id: 'g2', name: 'Moda İlkokulu', kind: 'okul', lat: 40.9875, lng: 29.0365, radius: 150, notify: true },
    { id: 'g3', name: 'Servis Durağı', kind: 'servis', lat: 40.9848, lng: 29.0389, radius: 60, notify: true },
    { id: 'g4', name: 'Yüzme Kursu', kind: 'kurs', lat: 40.9801, lng: 29.0298, radius: 100, notify: false },
  ],
  can: [
    { id: 'g5', name: 'Ev', kind: 'ev', lat: 40.9832, lng: 29.0412, radius: 120, notify: true },
    { id: 'g6', name: 'Kadıköy Anadolu Lisesi', kind: 'okul', lat: 40.9934, lng: 29.0322, radius: 180, notify: true },
    { id: 'g7', name: 'Basketbol Salonu', kind: 'kurs', lat: 40.9962, lng: 29.0405, radius: 100, notify: true },
  ],
}

export const paths: Record<string, [number, number][]> = {
  elif: [
    [40.9832, 29.0412], [40.9840, 29.0400], [40.9848, 29.0389],
    [40.9858, 29.0380], [40.9867, 29.0372], [40.9875, 29.0365],
  ],
  can: [
    [40.9832, 29.0412], [40.9860, 29.0390], [40.9895, 29.0360],
    [40.9934, 29.0322], [40.9925, 29.0300], [40.9912, 29.0281],
  ],
}

export const timeline: Record<string, TimelineEvent[]> = {
  elif: [
    { time: '07:45', text: 'Evden çıktı', kind: 'cikis' },
    { time: '07:52', text: 'Servis durağına vardı', kind: 'giris' },
    { time: '08:12', text: 'Moda İlkokulu\'na vardı', kind: 'giris' },
    { time: '08:30', text: 'Okul saati modu devreye girdi', kind: 'bilgi' },
    { time: '12:40', text: 'Roblox açılmaya çalışıldı (okul saatinde engelli)', kind: 'uyari' },
  ],
  can: [
    { time: '07:30', text: 'Evden çıktı', kind: 'cikis' },
    { time: '07:58', text: 'Kadıköy Anadolu Lisesi\'ne vardı', kind: 'giris' },
    { time: '15:20', text: 'Okuldan çıktı', kind: 'cikis' },
    { time: '15:40', text: 'Kadıköy Çarşı civarında', kind: 'bilgi' },
    { time: '16:05', text: 'Pil %31 — düşük', kind: 'uyari' },
  ],
}

export const alerts: RiskAlert[] = [
  {
    id: 'a1',
    childId: 'elif',
    category: 'zorbalik',
    severity: 'yuksek',
    app: 'Instagram',
    time: 'Bugün 14:22',
    summary: 'Bir grup sohbetinde zorbalık içerebilecek mesajlar algılandı',
    context: '"…sen ●●●● gibisin, kimse seni ●●●● istemiyor…"',
    status: 'yeni',
  },
  {
    id: 'a2',
    childId: 'elif',
    category: 'grooming',
    severity: 'yuksek',
    app: 'Roblox',
    time: 'Dün 21:05',
    summary: 'Tanımadığı bir hesap kişisel bilgi ve fotoğraf istedi',
    context: '"…kaç yaşındasın? ●●●● bir fotoğrafını atar mısın, kimseye söyleme…"',
    status: 'yeni',
  },
  {
    id: 'a3',
    childId: 'elif',
    category: 'mustehcen',
    severity: 'orta',
    app: 'Chrome',
    time: '15 Eki 19:40',
    summary: 'Yaşa uygun olmayan bir siteye erişim denendi ve engellendi',
    context: 'Alan adı kategorisi: yetişkin içerik',
    status: 'incelendi',
  },
  {
    id: 'a4',
    childId: 'elif',
    category: 'kendine-zarar',
    severity: 'orta',
    app: 'WhatsApp',
    time: '14 Eki 23:10',
    summary: 'Gece geç saatte olumsuz duygu ifadeleri algılandı',
    context: '"…artık hiçbir şeyin ●●●● yok gibi…"',
    status: 'incelendi',
  },
]

export const appUsage: Record<string, AppUsage[]> = {
  elif: [
    { name: 'YouTube', category: 'Video', minutes: 48, limit: 60, color: '#ef4444' },
    { name: 'Roblox', category: 'Oyun', minutes: 35, limit: 45, color: '#22c55e' },
    { name: 'Instagram', category: 'Sosyal', minutes: 27, limit: 30, color: '#d946ef' },
    { name: 'WhatsApp', category: 'Mesajlaşma', minutes: 18, color: '#10b981' },
    { name: 'EBA', category: 'Eğitim', minutes: 14, color: '#3b82f6' },
    { name: 'TikTok', category: 'Sosyal', minutes: 0, blocked: true, color: '#0f172a' },
  ],
  can: [
    { name: 'Instagram', category: 'Sosyal', minutes: 82, limit: 90, color: '#d946ef' },
    { name: 'Valorant Mobile', category: 'Oyun', minutes: 64, limit: 60, color: '#f43f5e' },
    { name: 'YouTube', category: 'Video', minutes: 51, color: '#ef4444' },
    { name: 'WhatsApp', category: 'Mesajlaşma', minutes: 33, color: '#10b981' },
    { name: 'Spotify', category: 'Müzik', minutes: 26, color: '#16a34a' },
    { name: 'Khan Academy', category: 'Eğitim', minutes: 12, color: '#3b82f6' },
  ],
}

export const weekly: Record<string, { day: string; dakika: number }[]> = {
  elif: [
    { day: 'Pzt', dakika: 128 }, { day: 'Sal', dakika: 145 }, { day: 'Çar', dakika: 110 },
    { day: 'Per', dakika: 162 }, { day: 'Cum', dakika: 175 }, { day: 'Cmt', dakika: 210 },
    { day: 'Paz', dakika: 142 },
  ],
  can: [
    { day: 'Pzt', dakika: 240 }, { day: 'Sal', dakika: 255 }, { day: 'Çar', dakika: 230 },
    { day: 'Per', dakika: 290 }, { day: 'Cum', dakika: 310 }, { day: 'Cmt', dakika: 345 },
    { day: 'Paz', dakika: 268 },
  ],
}

export const tierInfo: Record<AgeTier, { label: string; range: string; desc: string; rules: string[] }> = {
  kucuk: {
    label: 'Çocuk',
    range: '8–12 yaş',
    desc: 'Sıkı koruma. Uygulama yüklemek ebeveyn onayı ister.',
    rules: ['Yeni uygulama için onay', 'Günlük 3 saat limit', 'Yatma saati 21:30', 'Sosyal medya kısıtlı', 'Sıkı web filtresi'],
  },
  ergen: {
    label: 'Ergen',
    range: '13–15 yaş',
    desc: 'Dengeli koruma. Limitler uygulama kategorisi bazında.',
    rules: ['Kategori bazlı limitler', 'Günlük 4 saat limit', 'Yatma saati 22:30', 'Risk uyarıları açık', 'Orta web filtresi'],
  },
  genc: {
    label: 'Genç',
    range: '16–17 yaş',
    desc: 'Güvene dayalı. Yalnızca konum ve ciddi risk uyarıları.',
    rules: ['Yalnızca konum paylaşımı', 'Esnek ekran süresi', 'Yatma saati önerisi', 'Yalnız yüksek risk uyarısı', 'Temel web filtresi'],
  },
}

export const categoryInfo: Record<RiskCategory, { label: string; bg: string; fg: string }> = {
  zorbalik: { label: 'Siber zorbalık', bg: '#ffedd5', fg: '#c2410c' },
  grooming: { label: 'Şüpheli yetişkin teması', bg: '#fee2e2', fg: '#b91c1c' },
  'kendine-zarar': { label: 'Kendine zarar', bg: '#f3e8ff', fg: '#7e22ce' },
  madde: { label: 'Madde kullanımı', bg: '#fef3c7', fg: '#b45309' },
  mustehcen: { label: 'Uygunsuz içerik', bg: '#fce7f3', fg: '#be185d' },
}

export function fmtMin(m: number) {
  const h = Math.floor(m / 60)
  const r = m % 60
  return h ? `${h} sa ${r} dk` : `${r} dk`
}
// Arama kaydı META-VERİSİ — içerik/ses YOK. Kiminle, ne zaman, ne kadar + bilinmeyen/riskli numara.
export type CallDir = 'gelen' | 'giden' | 'cevapsiz'

export interface CallLog {
  id: string
  name: string | null // rehberde kayıtlıysa isim, değilse null
  number: string
  dir: CallDir
  time: string
  duration: number // saniye
  known: boolean
  risky?: boolean // çok sık / gece geç / şikâyet edilen numara
}

export const calls: Record<string, CallLog[]> = {
  elif: [
    { id: 'c1', name: 'Anne', number: '0532 ••• •• 12', dir: 'gelen', time: 'Bugün 15:42', duration: 184, known: true },
    { id: 'c2', name: null, number: '0850 ••• •• 77', dir: 'cevapsiz', time: 'Bugün 13:10', duration: 0, known: false, risky: true },
    { id: 'c3', name: 'Zeynep (sınıf)', number: '0541 ••• •• 03', dir: 'giden', time: 'Bugün 12:05', duration: 421, known: true },
    { id: 'c4', name: null, number: '0505 ••• •• 48', dir: 'gelen', time: 'Dün 20:30', duration: 95, known: false, risky: true },
    { id: 'c5', name: 'Baba', number: '0533 ••• •• 90', dir: 'gelen', time: 'Dün 18:12', duration: 212, known: true },
    { id: 'c6', name: 'Zeynep (sınıf)', number: '0541 ••• •• 03', dir: 'gelen', time: 'Dün 17:40', duration: 630, known: true },
  ],
  can: [
    { id: 'c7', name: 'Anne', number: '0532 ••• •• 12', dir: 'cevapsiz', time: 'Bugün 16:01', duration: 0, known: true },
    { id: 'c8', name: 'Mert', number: '0544 ••• •• 21', dir: 'giden', time: 'Bugün 15:20', duration: 1140, known: true },
    { id: 'c9', name: null, number: '0216 ••• •• 00', dir: 'gelen', time: 'Bugün 11:35', duration: 42, known: false },
    { id: 'c10', name: 'Basketbol Koçu', number: '0538 ••• •• 55', dir: 'gelen', time: 'Dün 19:05', duration: 305, known: true },
  ],
}

export function fmtDur(sec: number) {
  if (!sec) return 'Cevapsız'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m ? `${m} dk ${s} sn` : `${s} sn`
}
