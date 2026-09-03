<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Skill Installation Paths
    |--------------------------------------------------------------------------
    |
    | Agents only discover skills at the root of the repository, so Boost writes
    | into the workspace root rather than into `backend/`. Every agent points at
    | `.agents/skills`, which is this repository's canonical skill store; the
    | matching `.claude/skills/<name>` entries are symlinks into it.
    |
    | These paths are resolved through `base_path()`, so `..` means the parent of
    | the Laravel application. That is the repository root on the host, and the
    | `app` service in `docker-compose.yml` bind-mounts `../.agents` so it means
    | the same thing when Boost runs inside Sail.
    |
    */

    'agents' => [
        'claude_code' => [
            'skills_path' => '../.agents/skills',
        ],
        'codex' => [
            'skills_path' => '../.agents/skills',
        ],
        'cursor' => [
            'skills_path' => '../.agents/skills',
        ],
        'opencode' => [
            'skills_path' => '../.agents/skills',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Excluded Skills
    |--------------------------------------------------------------------------
    |
    | Boost re-derives `boost.json`'s skill list from the installed packages on
    | every update, so unwanted skills have to be excluded here to stay gone.
    |
    | `tailwindcss-development` is auto-detected from the Tailwind dev
    | dependencies, but the only Blade in this application is the vendored
    | GraphiQL view. UI work happens in `frontend/` and `mobile/`.
    |
    */

    'skills' => [
        'exclude' => [
            'tailwindcss-development',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Project Rules
    |--------------------------------------------------------------------------
    |
    | Disabled. The rule repository is hard-coded to `base_path('.ai/rules')`
    | with no configuration hook, so `record-rule` would write to
    | `backend/.ai/rules/` while the guidelines it generates tell agents to read
    | `@.ai/rules/index.md` at the workspace root. Rather than ship that split,
    | durable backend decisions stay in `backend/AGENTS.md`.
    |
    | Turning this off also drops the "Project Rules" section from the generated
    | guidelines and unregisters the `record-rule` MCP tool.
    |
    */

    'rules' => [
        'enabled' => false,
    ],
];
