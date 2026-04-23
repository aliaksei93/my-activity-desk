# Angular And ESM Migration Rules

Last updated: 2026-04-17

## Current Workspace Status

- Angular runtime is already upgraded to `21.2.9`.
- Angular CLI and devkit are on `21.2.7`.
- Nx is on `22.6.5`.
- TypeScript is on `~5.9.2`.
- The root workspace is still explicitly CommonJS via `"type": "commonjs"` in `package.json`.
- Unit tests still run on Jest through `@nx/jest`.
- Angular applications still use webpack-based module federation.

## Migration Decision

- Angular 21 migration is complete.
- Full ESM is the next modernization step.
- Full ESM means the root workspace switches to `"type": "module"` and root Node-executed scripts/configs stop depending on implicit CommonJS behavior.
- Frontend application code does not need a separate module-system migration. The main work is in root tooling, test runner integration, and Node-executed config files.

## Current CommonJS Holdouts

- `package.json`
  - root `"type": "commonjs"`
- `commitlint.config.js`
  - `module.exports`
- `jest.preset.js`
  - `require(...)` and `module.exports`
- `tools/set-version.js`
  - `require(...)`
- `tools/set-env.shell.ts`
  - `require(...)`
- `tools/set-env.board.ts`
  - `require(...)`
- `apps/angular/shell/project.json`
  - `set-version` target calls `node tools/set-version.js angular/shell`
- `apps/angular/shell/jest.config.ts`
  - preset points to `../../../jest.preset.js`
- `apps/angular/board/jest.config.ts`
  - preset points to `../../../jest.preset.js`
- `nx.json`
  - `@nx/jest:jest` inputs include `{workspaceRoot}/jest.preset.js`
- `apps/angular/shell-e2e/cypress.config.ts`
  - uses `__filename`
- `apps/angular/board-e2e/cypress.config.ts`
  - uses `__filename`
- `docker/shell.dockerfile`
  - runs `ts-node` with `--compiler-options '{"module":"CommonJS"}'`
- `docker/board.dockerfile`
  - runs `ts-node` with `--compiler-options '{"module":"CommonJS"}'`

## Rules

1. Do not mix another Angular major upgrade into the ESM migration.
2. Keep root ESM migration separate from webpack/module federation refactors unless a config must be adapted to run under ESM.
3. Prefer removing Jest before flipping the root workspace to ESM.
4. If Jest must stay temporarily, keep any remaining CommonJS files explicit and track them as temporary exceptions.
5. Do not add new root-level `require(...)`, `module.exports`, `__dirname`, or `__filename` usage in Node-executed files.
6. Audit every Node-executed `.js` and `.ts` file before changing root `"type"` to `"module"`.
7. Validate both Angular applications after each migration stage:
   - `shell`
   - `board`
8. In sandboxed environments, always use the Nx sandbox flags documented in `AGENTS.md`.

## Recommended Sequence To Full ESM

1. Start from a clean branch and clean worktree.
2. Run a CommonJS audit before changing anything:

```sh
rg -n "module\\.exports|require\\(|__dirname|__filename|exports\\." . --glob '!node_modules' --glob '!dist' --glob '!coverage'
```

3. Decide the test runner path first.
   - Preferred path: migrate `shell` and `board` from Jest to Vitest, then remove Jest-specific root config.
   - Temporary path: keep Jest only as an explicit compatibility island and remove it in a follow-up step.
4. Convert root tooling to ESM.
   - `package.json` -> `"type": "module"`
   - `commitlint.config.js` -> ESM config
   - `tools/set-version.js` -> ESM
   - `tools/set-env.shell.ts` -> ESM-safe syntax
   - `tools/set-env.board.ts` -> ESM-safe syntax
5. Update every reference that depends on CommonJS filenames or behavior.
   - `apps/angular/shell/project.json`
   - `apps/angular/shell/jest.config.ts`
   - `apps/angular/board/jest.config.ts`
   - `nx.json`
   - Docker files that copy or execute tooling scripts
6. Review Node-executed configs under ESM.
   - `apps/angular/*/webpack*.ts`
   - `apps/angular/*/module-federation.config.ts`
   - `apps/angular/*-e2e/cypress.config.ts`
7. Only after the workspace is green under root ESM, clean up compatibility leftovers.

## Remaining Steps

### Step 1. Decide How Jest Is Handled

- Preferred:
  - migrate `shell` and `board` unit tests to Vitest
  - remove `@nx/jest`, `jest`, `jest-preset-angular`, `ts-jest`
  - remove `jest.preset.js`
  - switch generators in `nx.json` from `unitTestRunner: "jest"` to the chosen replacement
- Temporary fallback:
  - keep Jest for one transition PR
  - isolate remaining Jest config as an explicit exception
  - remove that exception in the next step, not indefinitely

### Step 2. Convert Root Tooling

- Update `package.json` from `"type": "commonjs"` to `"type": "module"`.
- Convert `commitlint.config.js` to ESM export syntax.
- Convert `tools/set-version.js` to ESM imports and keep the same runtime behavior.
- Convert `tools/set-env.shell.ts` and `tools/set-env.board.ts` to ESM-safe imports.
- Stop forcing CommonJS in Docker execution of `set-env.ts`.
- Recheck any Node invocation that assumes `.js` plus CommonJS semantics.

### Step 3. Remove File-Name Coupling To Jest Preset

- Remove or replace `jest.preset.js`.
- Update `apps/angular/shell/jest.config.ts` and `apps/angular/board/jest.config.ts`.
- Update `nx.json` target inputs so cache keys no longer depend on a removed Jest preset file.

### Step 4. Review Node-Executed Config Files

- Audit `apps/angular/shell-e2e/cypress.config.ts` and `apps/angular/board-e2e/cypress.config.ts` because they use `__filename`.
- Audit webpack and module federation config files for any Node-only globals or CommonJS assumptions.
- Audit Docker build steps that copy `tools/set-env.*.ts` into image-local scripts.
- Replace the Docker `ts-node --compiler-options '{"module":"CommonJS"}'` path with an ESM-compatible execution strategy.

### Step 5. Verify The Workspace

Run at least:

```sh
npm run lint:styles
npx nx lint shell
npx nx lint board
npx nx test shell
npx nx test board
npx nx build shell --configuration=production
npx nx build board --configuration=production
node tools/set-version.js angular/shell
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

## Exit Criteria For Full ESM

- Root `package.json` uses `"type": "module"`.
- No required root tooling file depends on implicit CommonJS behavior.
- Any unavoidable compatibility exception is explicit, documented, and temporary.
- `shell` and `board` both pass lint, test, and production build.
- Version/environment helper scripts still run successfully in local and Docker flows.
