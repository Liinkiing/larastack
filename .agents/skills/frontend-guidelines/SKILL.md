---
name: frontend-guidelines
description: Frontend coding conventions for this repo. Use when creating or organizing Next.js App Router features, deciding where to place React components, or structuring shared UI/utilities in frontend/. Applies to collocating page-specific components under app route folders and placing shared pieces under src/.
---

# Frontend Guidelines

## Placement rules

- Collocate page-specific components: create a `_components/` folder inside the App Router page directory (the same directory as the `page.tsx`, `layout.tsx`, etc.) and place components used only by that page there.
- Keep shared components and utilities under `frontend/src/` following the existing architecture (`src/ui/`, `src/shared/`, `src/theme/`, etc.).
- Prefer shared placement when a component is reused across routes, layouts, or features.

## Examples

- `frontend/app/dashboard/_components/StatsCard.tsx` for a dashboard-only component.
- `frontend/src/ui/Button.tsx` for a reusable button.

## Notes

- Follow existing naming conventions (PascalCase components, `useX` hooks) and lint/format rules.
- When unsure about reuse, start collocated; promote to `src/` when a second usage appears.
