# Kanat — Mobil (iOS + Android)

Expo SDK 58 + Expo Router. Tek kod tabanı, iki rol:

- **Ebeveyn** (`src/app/ebeveyn/`): Genel, Konum, Ekran, Uyarılar, Kurallar sekmeleri
- **Çocuk** (`src/app/cocuk.tsx`): paylaşılan verilerin şeffaf listesi, kalan süre, ek süre isteği, SOS

Çocuk modu **gerçek API'ye** bağlı: ebeveyn web panelinde (`/panel`) çocuğu ekler, 6 haneli kodu
telefona girer; telefon konum (arka planda, kalıcı bildirimle), pil, SOS ve ek süre isteği gönderir.
Ebeveyn ekranları hâlâ mock veriyle çalışır (`src/data.ts`); canlı izleme web panelinde. API: `../API.md`.

## API adresi

Varsayılan `https://kanat-panel-production.up.railway.app`. Başka sunucu için derlemeden önce
`mobile/.env` dosyasına yazın (JS paketlenirken gömülür):

```bash
EXPO_PUBLIC_API_URL=https://ornek.com
```

Arka plan konumu native modül gerektirir → **Expo Go'da çalışmaz**, APK / development build gerekir.

## Çalıştırma

Node **22.13+** gerekir (`nvm use 22`).

```bash
npm install --legacy-peer-deps
npx expo start
```


## Kontroller

```bash
npx tsc --noEmit
npx expo lint
```

## Mağaza build'i

Android'de Google Maps için `GOOGLE_MAPS_API_KEY` gerekir (`app.json` → `react-native-maps` plugin).
Build: `npx eas-cli@latest build -p ios|android` (EAS hesabı gerekir).

Yerel APK: `npx expo prebuild -p android --no-install && cd android && ./gradlew assembleRelease`
→ `android/app/build/outputs/apk/release/app-release.apk`.
