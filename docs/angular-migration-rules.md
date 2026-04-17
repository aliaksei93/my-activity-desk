# Angular Migration Rules

Date: 2026-04-17

## Current Workspace Baseline

- Nx workspace with Angular applications under `apps/angular/*`.
- Current frontend runtime baseline before the next major upgrade:
  - Angular `20.3.x`
  - Nx `22.1.x`
  - TypeScript `5.9.x`
- Angular applications currently use webpack-based module federation.
- Unit tests currently use Jest.

## Rules

1. Upgrade Nx before upgrading Angular across major versions.
   - For Angular `21.0.x`, use Nx `>= 22.3.0`.
   - For Angular `21.2.x`, use Nx `>= 22.6.0`.
2. Use `nx migrate` from the workspace root for framework and Nx upgrades.
   - Do not treat this repo like a plain Angular CLI workspace.
   - Do not rely on `ng update` as the primary workflow here.
3. Target the latest patch in the target Angular major.
   - Prefer `~21.2.0` over `21.0.0`.
4. Keep migrations isolated by concern.
   - Angular major upgrade: separate change.
   - `Jest -> Vitest`: separate change.
   - `CommonJS -> ESM`: separate change.
5. Do not switch the test runner during the Angular major upgrade in this workspace.
   - First get Angular green with the existing Jest setup.
   - Move to Vitest only after the Angular upgrade is stable.
6. Keep Node.js and TypeScript inside Angular's supported range before starting the migration.
   - Angular `21.x` requires Node `^20.19.0 || ^22.12.0 || ^24.0.0`.
   - Angular `21.x` requires TypeScript `>=5.9.0 <6.0.0`.
7. Run migrations in two explicit phases.
   - Phase 1: upgrade Nx and run its migrations.
   - Phase 2: upgrade Angular and run Angular/Nx follow-up migrations.
8. Validate both Angular applications before merging.
   - `shell`
   - `board`
9. In sandboxed environments, always use the Nx sandbox flags documented in `AGENTS.md`.

## Recommended Upgrade Sequence

1. Start from a clean branch and clean worktree.
2. Upgrade Nx first:

```sh
npx nx migrate latest
npm install
npx nx migrate --run-migrations
```

3. Upgrade Angular after Nx is on a compatible version:

```sh
npx nx migrate @angular/core@~21.2.0
npm install
npx nx migrate --run-migrations
```

4. Review generated changes before continuing.
5. Fix compile, lint, or test regressions introduced by the migration.
6. Only after the Angular 21 migration is green, plan follow-up modernization work such as Vitest or ESM.

## Required Verification

Run at least:

```sh
npx nx lint shell
npx nx lint board
npx nx test shell
npx nx test board
npx nx build shell --configuration=production
npx nx build board --configuration=production
```

In sandboxed environments:

```sh
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx lint shell
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx lint board
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx test shell
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx test board
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx build shell --configuration=production
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx build board --configuration=production
```

## Notes For This Workspace

- Because `shell` and `board` use webpack-based module federation, expect to review webpack and federation config after Angular major bumps.
- Keep an eye on:
  - `apps/angular/shell/webpack*.ts`
  - `apps/angular/board/webpack*.ts`
  - `apps/angular/*/module-federation.config.ts`
  - Jest config and setup files
- If the Angular upgrade also requires broader architectural changes, split them into separate commits after the framework version bump is stable.
