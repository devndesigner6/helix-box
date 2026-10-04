# HelixBox mobile app

Expo/React Native control surface for a laptop workspace paired through the HelixBox CLI. The public release is Android; iOS and web scripts are development targets.

## Local development

Use Node.js 22 and npm. From this directory:

```bash
npm ci --legacy-peer-deps
npm start
```

`npm run android` builds and runs the native Android app with the Android SDK. Use a development build for native modules; Expo Go alone is not sufficient for every feature.

Run `npx helixbox-cli` in your laptop project, then scan its QR code. Coding-agent CLIs must be installed and authenticated on that laptop, not on the phone.

## Checks and Android builds

```bash
npm run lint
npm run build -- --platform android
npx eas-cli build --platform android --profile preview
```

The `preview` EAS profile produces an APK for internal distribution. The `production` profile is the store build configuration and requires your own EAS account and signing setup. An Expo export validates JavaScript and assets but is not an installable APK.

## Assets and configuration

- `assets/images/` contains app icons, splash and onboarding images.
- `assets/fonts/` contains bundled editor and terminal fonts.
- Keep static asset imports and the paths in `app.json` in sync when adding media.
- Use the checked-in `.env.example` and `.env.hotupdater.example` as configuration references. Do not commit credentials or signing keys.

See the [main README](../README.md) for workspace features, agent requirements, session resume and x402 billing. Download published builds from [GitHub Releases](https://github.com/devndesigner6/helix-box/releases/latest).
