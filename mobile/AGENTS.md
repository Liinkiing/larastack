# AGENTS.md

## Scope and Precedence

- Applies to files under `mobile/`.
- This file overrides root guidance for mobile-specific choices.

## Project Overview

This is a native iOS/Android Expo application. `app.json.platforms` intentionally lists only iOS and Android; retained web configuration and dependencies do not make web a supported deployment target.

Current major baseline: Expo SDK 57, Expo Router 57, React 19, React Native 0.86, and Uniwind 1. Read exact versions from `mobile/package.json`; do not copy version numbers from this file into dependency changes.

## Documentation Resources

When working on this project, **always consult the official Expo documentation** available at:

- **https://docs.expo.dev/llms.txt** - Index of all available documentation files
- **https://docs.expo.dev/llms-full.txt** - Complete Expo documentation including Expo Router, Expo Modules API, development process
- **https://docs.expo.dev/llms-eas.txt** - Complete EAS (Expo Application Services) documentation
- **https://docs.expo.dev/llms-sdk.txt** - Complete Expo SDK documentation
- **https://reactnative.dev/docs/getting-started** - Complete React Native documentation
- **https://github.com/expo/fyi** - Expo team guidance with advanced patterns, package-specific notes, and practical recommendations

These documentation files are specifically formatted for AI agents and should be your **primary reference** for:

- Expo APIs and best practices
- Expo Router navigation patterns
- EAS Build, Submit, and Update workflows
- Expo SDK modules and their usage
- Development and deployment processes

Use the relevant repository skills for Expo upgrades, Expo Router, Expo/EAS features, React Native performance, Uniwind, and Uniwind UI components. Skills provide the task workflow; official documentation remains the authority for current APIs and version compatibility.

## Project Structure

Paths below are relative to `mobile/`.

```
/
├── src/
│   ├── app/                       # Expo Router file-based routing
│   │   ├── _layout.tsx            # Root layout
│   │   ├── (authenticated)/       # Authenticated routes
│   │   └── (guest)/               # Guest/public routes
│   ├── screens/                   # Optional route-specific components, created when needed
│   ├── apollo/                    # Apollo client and GraphQL setup
│   ├── __generated__/             # GraphQL codegen output
│   ├── assets/                    # Static assets (images, fonts)
│   ├── services/                  # Feature/application services
│   ├── shared/                    # Shared cross-feature code
│   ├── ui/                        # UI primitives and design system
│   └── utils/                     # Shared utilities
├── .eas/workflows/                # EAS Workflows (CI/CD automation)
├── app.json                       # Expo configuration
├── eas.json                       # EAS Build/Submit configuration
├── codegen.ts                     # GraphQL codegen config
└── package.json                   # Dependencies and scripts
```

## Essential Commands

Run from repo root.

### Development

```bash
pnpm --filter @larastack/mobile dev                         # Start dev server
pnpm --filter @larastack/mobile exec expo install <package> # Install packages with compatible versions
pnpm --filter @larastack/mobile exec expo install --check   # Check which installed packages need updates
pnpm --filter @larastack/mobile exec expo install --fix     # Update invalid package versions
pnpm --filter @larastack/mobile development-builds          # Create development builds (workflow)
```

- Do not run `expo start`/`pnpm --filter @larastack/mobile dev` in the background (no `&`, `nohup`, or detached logging) unless the user explicitly asks for background execution.
- This configured app requires a development build. Google Sign-In is imported at startup and depends on custom native code that Expo Go does not include.

### Building & Testing

```bash
pnpm --filter @larastack/mobile expo:doctor      # Check project health and dependencies
pnpm --filter @larastack/mobile ts:check         # Run TypeScript type checking
pnpm --filter @larastack/mobile test             # Run Vitest in watch mode
pnpm --filter @larastack/mobile test:ci          # Run Vitest once (CI mode)
pnpm --filter @larastack/mobile lint             # Run oxlint
pnpm --filter @larastack/mobile format:check      # Check oxfmt formatting
pnpm --filter @larastack/mobile gen:gql           # Regenerate GraphQL artifacts
pnpm --filter @larastack/mobile draft            # Publish a preview update (workflow)
```

### Production

```bash
pnpm --filter @larastack/mobile build:prod:ios     # Build iOS production app
pnpm --filter @larastack/mobile build:prod:android # Build Android production app
pnpm --filter @larastack/mobile deploy             # Deploy to production (workflow)
```

## Development Guidelines

### Code Style & Standards

- **TypeScript First**: Use TypeScript for all new code with strict type checking
- **Naming Conventions**: Use meaningful, descriptive names for variables, functions, and components
- **UI Component Layout**: Place each UI component in its own kebab-case folder under `src/ui/` (for example, `src/ui/icon-symbol/IconSymbol.tsx`) and include a local `index.ts` barrel file. Keep component filenames/components in PascalCase.
- **Stack Primitives by Default**: Prefer `<HStack />` and `<VStack />` for simple horizontal/vertical layouts instead of raw `<View className="flex-row" />` or `<View className="flex-col" />`. These stack primitives provide sensible defaults and keep layout patterns consistent.
- **Shadows via Uniwind Classes**: Prefer Tailwind/Uniwind shadow utilities in `className` (for example, `shadow-sm`, `shadow-md`) instead of inline `style` shadow objects (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation`) by default.
- **Self-Documenting Code**: Write clear, readable code that explains itself; only add comments for complex business logic or design decisions
- **Generated Code**: Do not hand-edit `src/__generated__/`; change the GraphQL operation/schema inputs and run `pnpm --filter @larastack/mobile gen:gql`
- **Public Environment**: `EXPO_PUBLIC_*` values are embedded in the app bundle. They may identify public clients/endpoints but must never contain secrets.
- **Continuous Native Generation**: `ios/` and `android/` are generated and not committed. Native dependencies or config-plugin changes require a fresh development build.
- **React 19 Patterns**: Follow modern React patterns including:
  - Function components with hooks
  - Enable React Compiler
  - Proper dependency arrays in useEffect
  - Avoid premature memoization (`useMemo`, `useCallback`, `React.memo`) since React Compiler already handles most optimizations
  - Add manual memoization only when profiling shows a real bottleneck or when referential stability is required for correctness
  - Error boundaries for better error handling

### Navigation & Routing

- Use **Expo Router** for all navigation
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`
- Keep route UI/logic in `src/app/**` files by default.
- Extract a route's growing or reusable UI to `src/screens/<screen>/` while keeping routing and navigation boundaries in `src/app/**`; do not extract tiny one-off screens by ceremony.
- Do not place test files inside `src/app/**`; keep tests in `src/screens/**`, `src/services/**`, `src/shared/**`, `src/ui/**`, or `src/utils/**`.
- For components used only by a given route/screen, place them under `src/screens/<screen>/components/`.
- Name files in `src/screens/<screen>/components/` with PascalCase (for example `OnboardingCarousel.tsx`).
- Do not create ad-hoc `_components` folders inside `src/app/**`.
- Docs: https://docs.expo.dev/router/introduction/

### Recommended Libraries

- **Navigation**: `expo-router` for navigation
- **Images**: `expo-image` for optimized image handling and caching
- **Animations**: `react-native-reanimated` for performant animations on native thread
- **Gestures**: `react-native-gesture-handler` for native gesture recognition
- **Storage**: When adding persistent storage, prefer `expo-sqlite` for structured data and `expo-sqlite/kv-store` for simple key-value data; install Expo packages with `expo install`
- **Styling**: `uniwind` for Tailwind className styling in React Native
- **Variants**: `tailwind-variants` (`tv` + `cn`) for component variants/compound variants

## Debugging & Development Tools

### DevTools Integration

- **React Native DevTools**: Use React Native DevTools or the current Expo/EAS MCP tooling when available
- **Network Inspection**: Monitor API calls and network requests in DevTools
- **Element Inspector**: Debug component hierarchy and styles
- **Performance Profiler**: Identify performance bottlenecks
- **Logging**: Use `console.log` for debugging (remove before production), `console.warn` for deprecation notices, `console.error` for actual errors, and implement error boundaries for production error handling

### Testing & Quality Assurance

#### Automated Testing with MCP Tools

Developers can configure the Expo MCP server with the following doc: https://docs.expo.dev/eas/ai/mcp/

- **Component Testing**: Add stable `testID` props where automation needs a selector; do not blanket every component with IDs.
- **Tool Discovery**: Inspect the connected MCP server's current tool schemas instead of assuming historical command names
- **Visual and Interaction Testing**: Use the available screenshot, view-query, and interaction tools to verify behavior on a development build

## EAS Workflows CI/CD

This project is pre-configured with **EAS Workflows** for automating development and release processes. Workflows are defined in `.eas/workflows/` directory.

When working with EAS Workflows, **always refer to**:

- https://docs.expo.dev/eas/workflows/introduction/ for the current Workflows documentation
- The `.eas/workflows/` directory for existing workflow configurations
- Validate workflow YAML against the current schema at https://api.expo.dev/v2/workflows/schema (or the repository's EAS workflow validation helper when available).
- The repository default branch is `master`; keep production triggers and preview channel mappings aligned unless the repository branch changes.

### Build Profiles (eas.json)

- **development**: Development builds with dev client
- **development-simulator**: Development builds for iOS simulator
- **preview**: Internal distribution preview builds
- **production**: Production builds with auto-increment
- Runtime compatibility uses the app version. Bump `app.json.version` for native-runtime changes before publishing OTA updates; remote build-number auto-increment does not change this version.

### GraphQL and Tests

- Apollo Client runtime data masking is authoritative. Keep Codegen fragment masking disabled, use Apollo's fragment APIs, and regenerate after operation changes.
- Keep Vitest tests outside `src/app/**`; `test:ci` runs the suite once and should not rely on `passWithNoTests` as a substitute for coverage.

## Troubleshooting

### Development Builds vs Expo Go

Use a **development build** for this repo; Expo Go cannot boot the configured app because Google Sign-In requires custom native code. Create development builds with `pnpm --filter @larastack/mobile build:dev:ios` and/or `pnpm --filter @larastack/mobile build:dev:android`. After installing native packages or changing config plugins, create a fresh development build.

## AI Agent Instructions

When working on this project:

1. **Always start by consulting the appropriate documentation**:
   - For general Expo questions: https://docs.expo.dev/llms-full.txt
   - For EAS/deployment questions: https://docs.expo.dev/llms-eas.txt
   - For SDK/API questions: https://docs.expo.dev/llms-sdk.txt
   - For package-specific and advanced Expo patterns: https://github.com/expo/fyi

2. **Understand before implementing**: Read the relevant docs section before writing code

3. **Follow existing patterns**: Look at existing components and screens for patterns to follow
