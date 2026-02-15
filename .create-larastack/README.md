# Conditional Template Rules

This folder defines conditional file operations used by `create-larastack-app` when scaffolding from this template.

## What this does

- Applies app-selection specific behavior (`frontend`, `backend`, `mobile`)
- Removes files that should not exist for a chosen app set
- Applies strict named transforms for surgical code/config edits
- Keeps generated projects clean by removing `.create-larastack` after rules run

## Main files

- `rules.json`: manifest consumed by the scaffold CLI
- no extra override files are required; transforms operate on base files directly

## Schema

`rules.json` uses the schema from:

- `https://raw.githubusercontent.com/Liinkiing/create-larastack-app/master/schemas/rules.schema.json`

You can keep this in `rules.json` as:

```json
{
  "$schema": "https://raw.githubusercontent.com/Liinkiing/create-larastack-app/master/schemas/rules.schema.json"
}
```

## Rule behavior and ordering

- Rules run in order, top to bottom.
- If multiple rules transform the same file, the later rule sees prior edits and can refine them.
- Keep broad rules first and more specific rules later (for example: `backend-without-mobile-overrides` before `backend-only-overrides`).
- Transforms run in strict mode and fail generation when a transform id/profile is invalid.

## How to add a new conditional behavior

1. Add a rule in `rules.json` with:
   - `id`
   - `when` clauses (`appSelected` / `appNotSelected`)
   - `operations` (`remove` / `copy` / `transform`)
2. For `transform`, define:
   - `path`
   - `transform` id (for example `php.user.applyProfile`)
   - `options` (for example `{ "profile": "no-mobile" }`)
3. Keep paths relative to repository root.
4. Prefer transforms over file cloning so base files stay canonical.
5. Run local checks.

## Local checks

From the repo root:

```bash
pnpm exec oxfmt --check .create-larastack
```

Optional quick integrity check for transform ids used by rules:

```bash
node -e "const fs=require('node:fs');const path=require('node:path');const root=process.cwd();const rules=JSON.parse(fs.readFileSync(path.join(root,'.create-larastack/rules.json'),'utf8'));const transforms=[];for(const r of rules.rules){for(const op of r.operations||[]){if(op.type==='transform'){transforms.push(op.transform);}}}console.log('Transforms used:\n'+[...new Set(transforms)].sort().join('\n'))"
```
