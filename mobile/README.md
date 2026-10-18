# Kanat — Mobil (iOS + Android)

Expo SDK 58 + Expo Router. Tek kod tabanı, iki rol:

- **Ebeveyn** (`src/app/ebeveyn/`): Genel, Konum, Ekran, Uyarılar, Kurallar sekmeleri
- **Çocuk** (`src/app/cocuk.tsx`): paylaşılan verilerin şeffaf listesi, kalan süre, ek süre isteği, SOS

Veriler mock (`src/data.ts`, web paneldeki `src/data.ts` ile aynı).

## Çalıştırma

Node **22.13+** gerekir (`nvm use 22`).

```bash
npm install --legacy-peer-deps
npx expo start
```

Telefonda **Expo Go** ile QR kodu okutun. Harita (react-native-maps) Expo Go'da hazır gelir.

## Kontroller

```bash
npx tsc --noEmit
npx expo lint
```

## Mağaza build'i

Android'de Google Maps için `GOOGLE_MAPS_API_KEY` gerekir (`app.json` → `react-native-maps` plugin).
Build: `npx eas-cli@latest build -p ios|android` (EAS hesabı gerekir).
