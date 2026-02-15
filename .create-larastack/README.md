# Conditional Template Rules

This folder defines conditional file operations used by `create-larastack-app` when scaffolding from this template.

## What this does

- Applies app-selection specific behavior (`frontend`, `backend`, `mobile`)
- Removes files that should not exist for a chosen app set
- Copies override files for safer targeted code/config changes
- Keeps generated projects clean by removing `.create-larastack` after rules run

## Main files

- `rules.json`: manifest consumed by the scaffold CLI
- `overrides/no-mobile/`: replacements when `backend` is selected and `mobile` is not
- `overrides/no-frontend/`: replacements when `backend` is selected and `frontend` is not
- `overrides/backend-only/`: extra replacements for `backend` only
- `overrides/graphql/`: `graphql.config.yml` variants by selected app combination
- `overrides/opencode/`: `opencode.json` variants by selected app combination

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
- If multiple rules copy the same destination file, the later rule wins.
- Keep broad rules first and more specific rules later (for example: `backend-without-mobile-overrides` before `backend-only-overrides`).

## How to add a new conditional behavior

1. Add or update override files under `overrides/...`.
2. Add a rule in `rules.json` with:
   - `id`
   - `when` clauses (`appSelected` / `appNotSelected`)
   - `operations` (`remove` / `copy`)
3. Keep paths relative to repository root.
4. Prefer `copy` overrides over fragile string replacements.
5. Run local checks.

## Local checks

From the repo root:

```bash
pnpm exec oxfmt --check .create-larastack
```

Optional quick integrity check for manifest copy sources:

```bash
node -e "const fs=require('node:fs');const path=require('node:path');const root=process.cwd();const rules=JSON.parse(fs.readFileSync(path.join(root,'.create-larastack/rules.json'),'utf8'));const missing=[];for(const r of rules.rules){for(const op of r.operations||[]){if(op.type==='copy'){const p=path.join(root,op.from);if(!fs.existsSync(p))missing.push(op.from);}}}if(missing.length){console.error('Missing copy sources:\n'+[...new Set(missing)].join('\n'));process.exit(1)}console.log('All copy sources exist')"
```
