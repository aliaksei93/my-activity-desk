# Repository Guidelines

## Project Structure & Module Organization
- Nx workspace with applications under `apps/` and shared code under `libs/`.
- Angular host app: `apps/angular/shell` (module federation shell).
- Angular remote app: `apps/angular/board`.
- End-to-end tests live in `apps/angular/*-e2e` with Cypress configs.
- Shared libraries live under `libs/shell/` (for example `libs/shell/mf`).
- Build outputs go to `dist/`.
- Utility scripts live in `tools/` (version/env helpers).

## Build, Test, and Development Commands
- `npx nx serve shell` runs the shell app locally on `http://localhost:4200`.
- `npx nx serve board` runs the board app on `http://localhost:4201`.
- `npx nx build shell` or `npx nx build board` creates production builds in `dist/`.
- `npx nx test shell` or `npx nx test board` runs Jest unit tests.
- `npx nx lint shell` or `npx nx lint board` runs ESLint.
- `npx nx e2e shell-e2e` or `npx nx e2e board-e2e` runs Cypress e2e tests (targets may be inferred).
- `npx nx graph` visualizes project dependencies.

## Coding Style & Naming Conventions
- Indentation: 2 spaces (see `.editorconfig`).
- Language: TypeScript for app/lib code, SCSS for styles.
- Use kebab-case for project and folder names (example: `shell-e2e`).
- Format with Prettier (`.prettierrc`) and lint with ESLint (`eslint.config.mjs`).

## Testing Guidelines
- Unit tests use Jest with `jest-preset-angular` and live alongside code as `*.spec.ts`.
- Coverage outputs to `coverage/apps/angular/<project>`.
- Cypress e2e specs live under `apps/angular/*-e2e/src`.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits; current history uses `feat:` (examples: `feat: update init MF logic`).
- PRs should include a concise summary, testing notes, and screenshots for UI changes.
- Link related issues or tickets when available.

## Configuration & Tooling Tips
- `tools/set-version.js` is part of the shell build/test pipeline; keep it updated if versioning changes.
- `tools/set-env.*` and `tools/replace_api_url.*` handle environment setup and URL replacement.
