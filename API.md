# Kanat API

Tek servis: `server/index.ts` (Hono + Postgres). Hem `/api/*` uçlarını hem web panelini (`dist/`) sunar.

- **Taban adres:** `https://kanat-panel-production.up.railway.app`
- Ebeveyn paneli (canlı veri): `/panel` · Demo (mock veri): ana sayfa → "Canlı demo"
- Gerekli env: `DATABASE_URL` (Railway Postgres). İsteğe bağlı: `PORT` (3000), `HOST` (`::`).
- Şema her açılışta otomatik oluşturulur (`server/db.ts`). 30 günden eski konumlar silinir.
- Yerel: `npm run build && DATABASE_URL=postgres://... npm run server:dev`

## Genel kurallar

- Tüm gövdeler JSON (`content-type: application/json`).
- Kimlik: `Authorization: Bearer <token>`
  - **Ebeveyn token'ı** → `/api/auth/*` ile alınır, `/api/me`, `/api/children/*`, `/api/events/*` için.
  - **Cihaz token'ı** → `/api/device/pair` ile alınır, `/api/device/*` için.
- Token'lar süresiz; sunucuda yalnız SHA-256 özeti saklanır. Kaybolursa yeniden giriş / eşleştirme gerekir.
- Hata cevabı her zaman: `{ "error": "Türkçe mesaj" }`

| Kod | Anlamı |
|---|---|
| `400` | Geçersiz girdi, hatalı şifre/kod, oran sınırı aşıldı (mesaj `error` alanında) |
| `401` | Token geçersiz. Cihazda: **ebeveyn eşleşmeyi kaldırdı** → token'ı silip eşleştirme ekranına dön |
| `404` | Uç yok |
| `500` | Sunucu hatası |

Oran sınırları (IP başına): kayıt 10/saat · giriş 20/15 dk · eşleştirme 10/10 dk · ek süre isteği 10/saat (cihaz başına).

Zamanlar ISO 8601 (UTC) döner. Gün hesapları (ek süre) `Europe/Istanbul` saatine göredir.

---

## 1. Telefon (çocuk cihazı)

### `POST /api/device/pair` — eşleştir (token gerekmez)

Kodu ebeveyn panelde "Çocuk ekle" ile üretir. 6 hane, 24 saat geçerli, **tek kullanımlık**.

```bash
curl -X POST $API/api/device/pair -H 'content-type: application/json' \
  -d '{"code":"536431","deviceName":"Galaxy A54","platform":"android","appVersion":"1.0.0"}'
```
```json
{ "token": "WXLJrgyd…", "child": { "id": "330b…", "name": "Elif", "color": "#ec4899" } }
```

| Alan | Tür | |
|---|---|---|
| `code` | string | zorunlu, 6 rakam |
| `deviceName` | string | isteğe bağlı, ≤80 |
| `platform` | `"android"` \| `"ios"` | isteğe bağlı |
| `appVersion` | string | isteğe bağlı |

### Cihaz durumu (birçok ucun ortak cevabı)

```json
{
  "child": { "name": "Elif", "color": "#ec4899" },
  "rules": { "dailyLimitMin": 180 },
  "extraMinutesToday": 30,
  "requests": [ { "id": 3, "minutes": 30, "status": "onaylandi", "at": "2026-10-25T13:16:40Z" } ]
}
```
`requests`: son 5 ek süre isteği. `status`: `yeni` (bekliyor) · `onaylandi` · `reddedildi`.
Günün toplam sınırı = `dailyLimitMin + extraMinutesToday`.

### `POST /api/device/heartbeat` — canlılık + pil (≈ dakikada bir)

```json
{ "battery": 0.55, "charging": false, "appVersion": "1.0.0" }
```
`battery` 0–1 arası. Cevap: cihaz durumu. Her cihaz isteği "son görülme"yi günceller;
panel 10 dk haber alamazsa cihazı çevrimdışı gösterir.

### `GET /api/device/state` — cihaz durumu
Cevap: cihaz durumu.

### `POST /api/device/locations` — konum gönder (toplu)

```json
{ "points": [ { "lat": 40.9875, "lng": 29.0365, "accuracy": 12, "at": "2026-10-25T13:10:00Z" } ] }
```
En çok 500 nokta. `accuracy` (metre) ve `at` isteğe bağlı (`at` yoksa sunucu zamanı). Cevap: `{ "saved": 1 }`

### `POST /api/device/sos` — yardım iste

```json
{ "lat": 40.9875, "lng": 29.0365, "accuracy": 15 }
```
Konum isteğe bağlı (varsa konum geçmişine de yazılır). Panelde kırmızı uyarı çıkar. Cevap: `{ "ok": true }`

### `POST /api/device/extra-time` — ek süre iste

```json
{ "minutes": 30 }
```
5–240 dk. Cevap: cihaz durumu (yeni istek `requests[0]`, `status: "yeni"`). Ebeveyn panelden onaylar/reddeder;
telefon `heartbeat`/`state` ile sonucu görür.

### `POST /api/device/usage` — uygulama kullanım süreleri

```json
{ "day": "2026-10-25", "apps": [ { "app": "YouTube", "minutes": 40 } ] }
```
Aynı gün + uygulama tekrar gönderilirse üzerine yazılır (kümülatif değeri gönderin). Cevap: `{ "saved": 1 }`

### `POST /api/device/calls` — arama meta-verisi

```json
{ "calls": [ { "contact": "Anne", "direction": "gelen", "durationSec": 60, "at": "2026-10-25T09:00:00Z" } ] }
```
`direction`: `gelen` · `giden` · `cevapsiz`. Aynı (`at`, `direction`) tekrar gönderilirse yok sayılır.
**Yalnız meta-veri** (kim / ne zaman / ne kadar); ses veya mesaj içeriği için uç yoktur ve eklenmeyecek.

> `usage` ve `calls` uçları hazır, ancak mevcut mobil uygulama henüz göndermiyor
> (Android'de UsageStats / READ_CALL_LOG izinleri ve Play politikası gerekir).

### `POST /api/device/unpair` — eşleşmeyi bu cihazdan kaldır
Cevap: `{ "ok": true }`

---

## 2. Ebeveyn

### Hesap

| Uç | Gövde | Cevap |
|---|---|---|
| `POST /api/auth/register` | `{ "email", "password" (≥8), "name" }` | `{ "token", "parent": { "id", "email", "name" } }` |
| `POST /api/auth/login` | `{ "email", "password" }` | aynı |
| `POST /api/auth/logout` | — | `{ "ok": true }` |
| `GET /api/me` | — | `{ "id", "email", "name" }` |

### `GET /api/children` — çocuklar ve anlık durum

```json
[{
  "id": "330b…", "name": "Elif", "color": "#ec4899",
  "rules": { "dailyLimitMin": 180 },
  "pairCode": null, "pairExpires": null,
  "device": { "id": "e111…", "name": "Pixel", "platform": "android", "appVersion": "1.0.0",
              "battery": 0.55, "charging": false, "lastSeen": "2026-10-25T13:16:40Z" },
  "location": { "lat": 40.98, "lng": 29.03, "accuracy": 12, "at": "2026-10-25T13:16:40Z" },
  "newEvents": 2
}]
```
`pairCode` yalnız süresi dolmamış kod varsa dolu. `device`/`location` henüz yoksa `null`.

### Çocuk yönetimi

| Uç | Gövde | Cevap |
|---|---|---|
| `POST /api/children` | `{ "name" }` | `{ "id", "pairCode" }` (en çok 10 çocuk) |
| `POST /api/children/:id/pair-code` | — | `{ "pairCode" }` (eskisini geçersiz kılar) |
| `PATCH /api/children/:id` | `{ "name"?, "rules"?: { "dailyLimitMin": 0..1440 } }` | `{ "ok": true }` |
| `DELETE /api/children/:id` | — | çocuk + tüm kayıtları silinir |
| `DELETE /api/children/:id/devices` | — | eşleşme kaldırılır (telefon 401 alır) |

### İzleme

| Uç | Cevap |
|---|---|
| `GET /api/children/:id/locations?hours=24` | `[{ "lat", "lng", "accuracy", "at" }]` — en yeni önce, ≤2000, `hours` 1–720 |
| `GET /api/children/:id/events` | `[{ "id", "kind", "data", "status", "at" }]` — son 100 |
| `PATCH /api/events/:id` | gövde `{ "status": "incelendi" \| "onaylandi" \| "reddedildi" }` |
| `GET /api/children/:id/usage?day=YYYY-MM-DD` | `[{ "app", "minutes" }]` (gün verilmezse bugün) |
| `GET /api/children/:id/calls` | `[{ "contact", "direction", "durationSec", "at" }]` — son 200 |

Olay türleri (`kind`): `sos` (`data: { lat, lng }`) · `ek_sure` (`data: { minutes }`) · `eslesme` (`data: { deviceName, platform }`).
`status`: `yeni` → panelde sayılır; `incelendi` / `onaylandi` / `reddedildi`.

### `GET /api/health`
`{ "ok": true }` — veritabanı bağlantısını da doğrular.

---

## Uçtan uca örnek

```bash
API=https://kanat-panel-production.up.railway.app
# Ebeveyn
P=$(curl -s -X POST $API/api/auth/register -H 'content-type: application/json' \
     -d '{"email":"ebeveyn@ornek.com","password":"gizli-sifre","name":"Ayşe"}' | jq -r .token)
CODE=$(curl -s -X POST $API/api/children -H "authorization: Bearer $P" -H 'content-type: application/json' \
     -d '{"name":"Elif"}' | jq -r .pairCode)
# Telefon
D=$(curl -s -X POST $API/api/device/pair -H 'content-type: application/json' \
     -d "{\"code\":\"$CODE\",\"platform\":\"android\"}" | jq -r .token)
curl -s -X POST $API/api/device/locations -H "authorization: Bearer $D" -H 'content-type: application/json' \
     -d '{"points":[{"lat":40.9875,"lng":29.0365}]}'
# Ebeveyn tekrar bakar
curl -s $API/api/children -H "authorization: Bearer $P"
```
