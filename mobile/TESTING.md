# Mobile tests

Run all tests from the repository root:

```sh
pnpm --filter @larastack/mobile test
```

- `test` / `test:watch`: watch all unit and component tests, including iOS and Android component checks.
- `test:ci`: run the same complete suite once.
- Add `--project unit`, `--project components`, `--project ios`, or `--project android` to focus on one Vitest project.

Keep tests alongside the code, outside `src/app/` so Expo Router does not treat them as routes. The filename determines where a test runs:

| Filename            | Vitest project      | Runs                                   |
| ------------------- | ------------------- | -------------------------------------- |
| `*.test.ts`         | `unit`              | Once in Node                           |
| `*.test.tsx`        | `components`        | Once in the default iOS native runtime |
| `*.native.test.tsx` | `ios` and `android` | Once per platform                      |

The same conventions apply to `.spec` files. Shared component tests should assert platform-independent behavior; they still need a concrete native runtime. Use `.native.test.tsx` when both platform implementations or platform branches matter. Native tests are excluded from the shared project, so they are not run a third time. Import test APIs from `vitest` throughout.

Component projects use pinned `vitest-native` with `engine: 'native'`: real React Native JavaScript with mocked native boundaries. This community plugin is currently beta, so check compatibility when upgrading Expo, React Native, or Vitest. Jest, jsdom, and DOM matchers are not needed.

`test-renderer` imports are aliased to its CommonJS entry so they share the instance required by Testing Library. The setup filters only the known duplicate-resolution and eager deprecated-export warnings from `vitest-native` 0.13; other warnings remain visible. Revisit these filters when upgrading the plugin.

## Component test conventions

Use [React Native Testing Library's guidance](https://oss.callstack.com/react-native-testing-library/docs/start/quick-start):

- Test observable behavior: presses, editing, validation, disabled/loading states, and accessible names. Avoid snapshots of entire component trees and assertions about Uniwind classes.
- Query by role and accessible name first; use labels for inputs. Reserve `testID` for elements that cannot reasonably be queried semantically.
- Prefer `userEvent` to simulate interaction. In React Native Testing Library 14, await `render`, `screen.rerender`, `userEvent`, and `fireEvent`.
- With fake timers, use `userEvent.setup({ advanceTimers: delay => void vi.advanceTimersByTime(delay) })`; the default timer advancement assumes Jest.
- Use `screen` and the built-in matchers. Use `findBy*` for asynchronous UI, and `queryBy*` when checking absence.
- Render collaborating components together. Mock external or native boundaries only when necessary, not the component being tested.

The shared setup bypasses Uniwind's Metro-generated style resolution and mocks the native SF Symbols view. These tests cannot validate layout, touch target size, real VoiceOver/TalkBack behavior, or native sheets. Check those on a development build.

`Button.test.tsx` demonstrates shared behavior that runs once; `Button.native.test.tsx` demonstrates a platform branch that runs on both iOS and Android. Add tests for new behavior and regressions; static stacks, dividers, and typography wrappers do not need tests merely for existing.

## Agent skill

Callstack's [React Native testing skill](https://github.com/callstack/react-native-testing-library/tree/main/skills/react-native-testing) is installed in `.agents/skills/react-native-testing`, with a Claude Code symlink. It contains version-specific React Native Testing Library API references and test anti-patterns. It is agent guidance and is not required to run the test suite.

The project-local skill was installed with:

```sh
npx skills add callstack/react-native-testing-library --skill react-native-testing -y
```

Restore skills recorded in `skills-lock.json` with `npx skills experimental_install`.
