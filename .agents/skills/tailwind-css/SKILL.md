---
name: tailwind-css
description: Tailwind CSS 4 styling conventions with tailwind-variants and cn() for the frontend. Use when styling UI, creating reusable variants, or editing className usage in frontend/.
---

# Tailwind CSS

## Overview

Use Tailwind CSS 4 as the styling system for the frontend.

## Guidelines

- Read `references/tailwind-css.md` before writing frontend styles.
- Use `className` for page-level layout and one-off composition.
- Use `tv()` from `~/tailwind-variants` for reusable component variants.
- Use `cn()` from `~/tailwind-variants` to merge internal and consumer classes.
- Keep design tokens in `frontend/app/index.css`.
