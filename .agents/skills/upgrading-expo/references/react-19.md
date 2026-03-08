# React 19

This repo already uses React 19 through Expo SDK 55. React 19 enables several simplifications, but most of them are optional modernizations rather than mandatory rewrites.

## Context Changes

### useContext and use

The `use` hook can read context in React 19, but `useContext` remains valid. Prefer `use` only when it materially improves readability or when conditional context reads are useful:

```tsx
// Before (React 18)
import { useContext } from "react";
const value = useContext(MyContext);

// After (React 19)
import { use } from "react";
const value = use(MyContext);
```

- The `use` hook can also read promises, enabling Suspense-based data fetching.
- `use` can be called conditionally, this simplifies components that consume multiple contexts.

### Context.Provider and Context

Context providers can now omit the `.Provider` suffix, but both forms are valid:

```tsx
// Before (React 18)
<ThemeContext.Provider value={theme}>
  {children}
</ThemeContext.Provider>

// After (React 19)
<ThemeContext value={theme}>
  {children}
</ThemeContext>
```

## ref as a Prop

### Removing forwardRef

Components can now receive `ref` as a regular prop. `forwardRef` still works, so remove it only when the simpler API improves the component:

```tsx
// Before (React 18)
import { forwardRef } from "react";

const Input = forwardRef<TextInput, Props>((props, ref) => {
  return <TextInput ref={ref} {...props} />;
});

// After (React 19)
function Input({ ref, ...props }: Props & { ref?: React.Ref<TextInput> }) {
  return <TextInput ref={ref} {...props} />;
}
```

### Optional modernization steps

1. Remove `forwardRef` wrapper
2. Add `ref` to the props destructuring
3. Update the type to include `ref?: React.Ref<T>`

## Other React 19 Features

- **Actions** — Functions that handle async transitions
- **useOptimistic** — Optimistic UI updates
- **useFormStatus** — Form submission state (web)
- **Document Metadata** — Native `<title>` and `<meta>` support (web)

## Cleanup Checklist

When reviewing older pre-React-19 patterns:

- [ ] Consider replacing `useContext` with `use` where it clearly improves the code
- [ ] Consider using `<Context value={...}>` where it improves readability
- [ ] Consider removing `forwardRef` wrappers in simple components
