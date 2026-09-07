# Frontend tests

Run the frontend suite from the repository root:

```sh
pnpm --filter @larastack/frontend test
```

- `test` / `test:watch`: run Vitest in watch mode.
- `test:ci`: run the complete suite once.
- Tests may use `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` beside code under `app/` and `src/`.

The frontend uses Vitest directly with a jsdom environment and React Testing Library. There is no Jest runner or Jest configuration. Import `describe`, `expect`, `test` or `it`, mocks, timers, and hooks from `vitest`; import `render` and `screen` from `@testing-library/react`, and use `@testing-library/user-event` for user interaction.

`vitest.setup.ts` installs Testing Library's DOM matchers and cleans up rendered components after every test. Matchers such as `toBeInTheDocument`, `toBeDisabled`, and `toHaveAccessibleName` are available without per-file setup.

## Component test conventions

- Test user-visible behavior rather than implementation details or generated Panda class names.
- Prefer role, accessible-name, label, and text queries. Use `data-testid` only when semantic queries cannot express the behavior.
- Use `findBy*` or `waitFor` for asynchronous updates and `queryBy*` for absence.
- Mock network, browser, and framework boundaries narrowly. Keep the component under test real.
- Start with `src/ui/button/Button.test.tsx` and `src/ui/heading/Heading.test.tsx` for small component-test examples.

Keep focused unit tests next to utilities and behavior. Use a component test when rendering is needed to prove the contract; server rendering and hydration tests may use React DOM APIs where React Testing Library is not the layer under test.
