# Repository Guidelines

## Project Structure & Module Organization

- Nx workspace with applications under `apps/` and shared code under `libs/`.
- Platform host app: `apps/platform/root-config` (Vite + single-spa orchestration shell).
- Angular remote app: `apps/angular/board` (plain ESM remote).
- Additional polyglot remotes live under `apps/react/` and `apps/vue/`.
- Shared platform contracts and runtime helpers live under `libs/platform/`.
- Build outputs go to `dist/`.
- Utility scripts live in `tools/`.

## Build, Test, and Development Commands

- `npx nx serve root-config` runs the platform host and starts all remotes for local development.
- `npx nx serve board` runs the Angular remote on `http://localhost:4201`.
- `npx nx serve profile` and `npx nx serve notes` run the React and Vue remotes.
- `npx nx build root-config`, `npx nx build board`, `npx nx build profile`, and `npx nx build notes` create production builds in `dist/`.
- `npx nx test board` runs Angular unit tests.
- `npx nx lint root-config`, `npx nx lint board`, `npx nx lint profile`, and `npx nx lint notes` run ESLint.
- `npx nx graph` visualizes project dependencies.

## Nx in sandboxed environments

> Only relevant when running inside restricted/sandboxed execution environments.

- Sandbox blocks IPC sockets ⇒ Nx daemon/plugin workers may fail (`listen EPERM`).
- In the sandbox, always run Nx with env flags:
  - `NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx ...`
  - (or `source ./tools/nx-sandbox-env.sh`; alias `nx` inside).
- Do not apply these env flags outside a sandbox unless needed.
- If you need daemon/isolation, request unsandboxed command execution.

## Coding Style & Naming Conventions

- Indentation: 2 spaces (see `.editorconfig`).
- Language: TypeScript for app/lib code, CSS/SCSS for styles.
- Use kebab-case for project and folder names.
- Format with Prettier (`.prettierrc`) and lint with ESLint (`eslint.config.mjs`).

## Angular Template Syntax

- For all new/updated Angular templates, use built-in control flow blocks: `@if`, `@for`, `@switch`.
- Avoid legacy structural directive microsyntax (`*ngIf`, `*ngFor`, `*ngSwitchCase`) in new edits.
- In standalone components, remove `NgIf`/`NgFor`/`NgSwitch*` imports when templates use built-in control flow.
- Always specify `track` in `@for` loops (prefer stable key; fallback to `$index` if needed).

## Testing Guidelines

- Unit tests use Jest with `jest-preset-angular` and live alongside code as `*.spec.ts`.
- Coverage outputs to `coverage/apps/angular/<project>`.
- React/Vue remotes currently rely on lint/build validation; add framework-specific tests alongside new features.

## Commit & Pull Request Guidelines

- Commit messages follow Conventional Commits; current history uses `feat:` (examples: `feat: update init MF logic`).
- PRs should include a concise summary, testing notes, and screenshots for UI changes.
- Link related issues or tickets when available.

## Configuration & Tooling Tips

- `apps/platform/root-config/public/platform.manifest.json` is the source of truth for remote URLs and public contracts.
- `libs/platform/contracts` defines the neutral `mount(container, context)` boundary used by every remote.
