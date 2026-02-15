# AGENTS.md

## Scope and Precedence

- Applies to files under `mobile/`.
- This file overrides root guidance for mobile-specific choices.

## Project Overview

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

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

## Project Structure

```
/
├── src/
│   ├── app/                       # Expo Router file-based routing
│   │   ├── _layout.tsx            # Root layout
│   │   ├── (authenticated)/       # Authenticated routes
│   │   └── (guest)/               # Guest/public routes
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
pnpm --filter @larastack/mobile start                       # Start dev server
pnpm --filter @larastack/mobile start -- --clear            # Clear cache and start dev server
pnpm --filter @larastack/mobile exec expo install <package> # Install packages with compatible versions
pnpm --filter @larastack/mobile exec expo install --check   # Check which installed packages need updates
pnpm --filter @larastack/mobile exec expo install --fix     # Update invalid package versions
pnpm --filter @larastack/mobile development-builds          # Create development builds (workflow)
```

### Building & Testing

```bash
pnpm --filter @larastack/mobile expo:doctor      # Check project health and dependencies
pnpm --filter @larastack/mobile ts:check         # Run TypeScript type checking
pnpm --filter @larastack/mobile lint             # Run oxlint
pnpm --filter @larastack/mobile draft            # Publish preview update and website (workflow)
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
- **Self-Documenting Code**: Write clear, readable code that explains itself; only add comments for complex business logic or design decisions
- **React 19 Patterns**: Follow modern React patterns including:
  - Function components with hooks
  - Enable React Compiler
  - Proper dependency arrays in useEffect
  - Memoization when appropriate (useMemo, useCallback)
  - Error boundaries for better error handling

### Navigation & Routing

- Use **Expo Router** for all navigation
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`
- Docs: https://docs.expo.dev/router/introduction/

### Recommended Libraries

- **Navigation**: `expo-router` for navigation
- **Images**: `expo-image` for optimized image handling and caching
- **Animations**: `react-native-reanimated` for performant animations on native thread
- **Gestures**: `react-native-gesture-handler` for native gesture recognition
- **Storage**: Use `expo-sqlite` for persistent storage, `expo-sqlite/kv-store` for simple key-value storage

## Debugging & Development Tools

### DevTools Integration

- **React Native DevTools**: Use MCP `open_devtools` command to launch debugging tools
- **Network Inspection**: Monitor API calls and network requests in DevTools
- **Element Inspector**: Debug component hierarchy and styles
- **Performance Profiler**: Identify performance bottlenecks
- **Logging**: Use `console.log` for debugging (remove before production), `console.warn` for deprecation notices, `console.error` for actual errors, and implement error boundaries for production error handling

### Testing & Quality Assurance

#### Automated Testing with MCP Tools

Developers can configure the Expo MCP server with the following doc: https://docs.expo.dev/eas/ai/mcp/

- **Component Testing**: Add `testID` props to components for automation
- **Visual Testing**: Use MCP `automation_take_screenshot` to verify UI appearance
- **Interaction Testing**: Use MCP `automation_tap_by_testid` to simulate user interactions
- **View Verification**: Use MCP `automation_find_view_by_testid` to validate component rendering

## EAS Workflows CI/CD

This project is pre-configured with **EAS Workflows** for automating development and release processes. Workflows are defined in `.eas/workflows/` directory.

When working with EAS Workflows, **always refer to**:

- https://docs.expo.dev/eas/workflows/ for workflow examples
- The `.eas/workflows/` directory for existing workflow configurations
- You can check that a workflow YAML is valid using the workflows schema: https://exp.host/--/api/v2/workflows/schema

### Build Profiles (eas.json)

- **development**: Development builds with dev client
- **development-simulator**: Development builds for iOS simulator
- **preview**: Internal distribution preview builds
- **production**: Production builds with auto-increment

## Troubleshooting

### Expo Go Errors & Development Builds

If there are errors in **Expo Go** or the project is not running, create a **development build**. **Expo Go** is a sandbox environment with a limited set of native modules. To create development builds, run `pnpm --filter @larastack/mobile build:dev:ios` and/or `pnpm --filter @larastack/mobile build:dev:android`. Additionally, after installing new packages or adding config plugins, new development builds are often required.

## AI Agent Instructions

When working on this project:

1. **Always start by consulting the appropriate documentation**:
   - For general Expo questions: https://docs.expo.dev/llms-full.txt
   - For EAS/deployment questions: https://docs.expo.dev/llms-eas.txt
   - For SDK/API questions: https://docs.expo.dev/llms-sdk.txt
   - For package-specific and advanced Expo patterns: https://github.com/expo/fyi

2. **Understand before implementing**: Read the relevant docs section before writing code

3. **Follow existing patterns**: Look at existing components and screens for patterns to follow
