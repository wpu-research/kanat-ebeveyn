# Kanat — ebeveyn kontrol uygulaması

"Koruyun. Gözetlemeyin." yaklaşımıyla tasarlanan ebeveyn uygulaması: web paneli, mobil uygulama ve tek bir sunucu. Mesaj içeriği okunmaz, ses kaydı/dinleme yoktur; konum, pil, ekran süresi, arama meta-verisi, SOS ve ek süre isteği gibi şeffaf veriler kullanılır.

## Özellikler
- **Web:** koyu temalı landing sayfası ve ebeveyn paneli (Genel, Konum, Ekran Süresi, Arama Kayıtları, Risk Uyarıları, Kurallar).
- **Sunucu (`server/`):** Hono + PostgreSQL; hem `/api/*` uçlarını hem derlenmiş web arayüzünü sunar. Şema açılışta otomatik oluşur. Ayrıntı: `API.md`.
- **Mobil (`mobile/`):** Expo Router ile ebeveyn ve çocuk modları; çocuk modu 6 haneli kodla eşleşip konum, pil, SOS ve ek süre isteği gönderir.
- Notlara göre bazı ebeveyn ekranları mock veriyle çalışır; risk motoru yoktur (`_vault/` notlarına bakın).

## Teknoloji
Vite, React 18, Tailwind 4, Leaflet, Recharts (web); Hono, `pg`, tsx (sunucu); Expo SDK 58, React Native (mobil); Docker (Node 22).

## Kurulum / çalıştırma
```bash
npm install
npm run dev                                   # web geliştirme
npm run build && npm run server:dev           # sunucu + derlenmiş web (DATABASE_URL gerekir)
npm run typecheck
cd mobile && npm install --legacy-peer-deps && npx expo start   # mobil (Node >= 22.13)
docker build -t kanat .                       # üretim imajı
```

## Ortam değişkenleri
- Sunucu: `DATABASE_URL`, `PORT`, `HOST`, `STATIC_DIR`
- Mobil: API adresi için `mobile/.env` (adı `mobile/README.md`'de belirtilir)

## Lisans
Lisans: belirtilmemiş (özel/private proje).
