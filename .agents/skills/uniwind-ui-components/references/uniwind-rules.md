# Uniwind Rules for Reusable UI Components

Sources:
- https://docs.uniwind.dev/llms-full.txt
- https://docs.uniwind.dev/tailwind-basics
- https://docs.uniwind.dev/api/platform-select
- https://docs.uniwind.dev/api/data-selectors
- https://docs.uniwind.dev/api/with-uniwind
- https://docs.uniwind.dev/api/use-resolve-class-names
- https://docs.uniwind.dev/api/use-css-variable

## Core Constraints

- Keep `className` strings static and fully spelled out at build time.
- Never build class names with interpolation or concatenation (`text-${color}`, etc.).
- Prefer `tv` variants or mapping objects for conditional styles.
- Prefer `className` for styling; use inline `style` only for truly runtime-only values.
- Remember inline `style` wins over `className` for the same property.

## Platform and Theme

- Use Uniwind platform selectors (`ios:`, `android:`, `native:`, `web:`) instead of `Platform.select()` for styling.
- Prefer semantic token classes (`bg-background`, `text-foreground`, `border-input`, etc.) over raw color literals when possible.
- Keep platform differences minimal; only branch where native behavior actually differs.

## Component State Patterns

- Use `data-[prop=value]:...` selectors for prop-driven states.
- Supported selector style is equality only (`data-[state=open]`, `data-[selected=true]`).
- Boolean checks must be explicit (`true` / `false`).
- Keep state names semantic (`state`, `status`, `selected`, `disabled`).

## Third-Party Components

- Use `withUniwind` when a third-party component does not support `className`.
- Prefer auto-mapped props (`className`, `colorClassName`) before custom mapping.
- Do not wrap components that already forward style/className correctly.

## Escape Hatches (Use Sparingly)

- `useResolveClassNames`: only when an API strictly requires a style object and cannot be wrapped with `withUniwind`.
- `useCSSVariable`: only when you need token values in JS (charts, gradient arrays, native module config, etc.).
- When using `useCSSVariable` for multiple vars, use array form in one call.

## Quality Checklist

- Variants are semantic and finite (no free-form class strings from props).
- Dark/light/platform behavior is intentional and readable.
- Interactive states are predictable (`pressed`, `disabled`, `selected`, etc.).
- Component API is reusable enough to prevent repeated style logic in screens.
