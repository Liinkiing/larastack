# Larastack Mobile 📱

This is the Expo/React Native mobile app for Larastack. It lives in the same monorepo as the Laravel backend (`../backend`) and Next.js frontend (`../frontend`).

## Get started

From the repository root, run:

```bash
pnpm --filter @larastack/mobile dev
```

Or from this directory (`mobile/`), run:

```bash
pnpm run dev
```

Run the app with:

- [a development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [an Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [an iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

This app includes native auth modules and config plugins such as Apple Authentication, Google Sign-In, and SecureStore-backed auth flows. Expo Go cannot boot it because Google Sign-In requires custom native code.

After upgrading to Expo SDK 58, create a fresh development build before connecting to Metro. The first SDK 58 store release also needs a new native build. The fingerprint-based release workflows handle that automatically.

You can start developing by editing files in **src/app**. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Common Commands

Run these from the repo root:

```bash
pnpm --filter @larastack/mobile dev
pnpm --filter @larastack/mobile expo:doctor
pnpm --filter @larastack/mobile build:dev:android
pnpm --filter @larastack/mobile build:dev:ios
pnpm --filter @larastack/mobile development-builds
pnpm --filter @larastack/mobile release:internal
pnpm --filter @larastack/mobile release:production
```

## Build profiles

| Profile                 | Distribution                                 | EAS environment | OTA channel  |
| ----------------------- | -------------------------------------------- | --------------- | ------------ |
| `development`           | Android and iOS device development builds    | `development`   |              |
| `development-simulator` | iOS simulator development build              | `development`   |              |
| `internal`              | Google Play internal testing and TestFlight  | `preview`       | `internal`   |
| `production`            | Google Play and App Store release candidates | `production`    | `production` |

The development app has a `Dev` display name, a `-dev` URL scheme, and `.dev` application identifiers. The local `dev`, `android`, and `ios` commands use this variant, so it can run alongside a store build. The two store profiles share the same app identity and use remote build-number increments. Install or submit a `production` build for public release so it receives updates from the `production` channel.

## EAS setup

1. Set the app name, slug, owner, URL scheme, iOS bundle identifier, and Android package in [`app.json`](./app.json). Link your own project from `mobile/` with `npx eas-cli@latest init`. If the CLI asks you to finish linking manually, add your project UUID at `extra.eas.projectId` in `app.json`. The dynamic config derives the EAS Update URL from this ID.
2. Set `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, and `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` for each EAS environment. Use `development` for dev clients, `preview` for internal store releases, and `production` for public releases. If setting `EXPO_PUBLIC_GRAPHQL_ENDPOINT`, point it to the same backend as `EXPO_PUBLIC_API_URL`. Set the same values locally for Metro as needed.
3. Register the store and `.dev` OAuth identifiers with Apple and Google. For Android, register each package with its signing certificate SHA-1. For iOS, the config derives the URL scheme from the environment's Google iOS client ID and falls back to the scheme in `app.json`. Include the relevant Apple bundle identifiers and Google client IDs in the backend allowlists. Existing backends need the `.dev` Apple audience added to `APPLE_ALLOWED_CLIENT_IDS`.
4. Configure signing and submission credentials for each store. Add the App Store Connect app ID as `ios.ascAppId` under both `submit.internal` and `submit.production` in [`eas.json`](./eas.json). See the [Android submission setup](https://docs.expo.dev/submit/android/) and [iOS submission setup](https://docs.expo.dev/submit/ios/).

## Release workflows

- `development-builds` creates Android and iOS device development builds plus an iOS simulator build.
- `release:internal` accepts `all`, `android`, or `ios`. For each selected platform, it checks for a compatible store build. It builds and submits to Play internal testing or TestFlight when needed, or publishes an OTA to `internal` when a matching build exists.
- `release:production` makes the same decision for the `production` channel. A new Android submission creates a production-track draft. A new iOS submission uploads to App Store Connect for TestFlight and App Review. Complete the public release in the store console. A production OTA can reach compatible public installations as soon as it is published.

All workflows run manually. The `fingerprint` runtime policy requires a fresh store build when moving from the old `appVersion` policy. If an EAS build succeeded but its submission failed, retry the failed job or run `npx eas-cli@latest submit --platform <ios|android> --profile <internal|production> --id <build-id>` from `mobile/`. A fresh release run can find that build and choose the OTA path.

See the [Expo Workflows guide](https://docs.expo.dev/eas/workflows/get-started/) for linking the project to GitHub and running workflows from the dashboard.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow Expo's step-by-step introduction, adapting its examples to this app's iOS/Android targets.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
