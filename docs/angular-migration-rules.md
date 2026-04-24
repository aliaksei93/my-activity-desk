# Workspace Vitest And ESM Status

Last updated: 2026-04-24

## Current State

- `apps/platform/root-config`, `apps/react/profile`, and `apps/vue/notes` use Vite.
- `apps/angular/board` uses the Angular application builder and emits browser module
  scripts.
- `board:test` uses the Angular unit-test executor with Vitest.
- Root Angular generator defaults use `vitest-angular`.
- The active app set is `root-config`, `board`, `profile`, and `notes`.

## Runtime Notes

- The platform host consumes remotes through plain ESM entrypoints declared in
  `apps/platform/root-config/public/platform.manifest.json`.
- `board` is not configured through Nx Vite targets, but that is not required for the
  root ESM migration.
- Storybook still brings webpack through `@storybook/angular`; treat that as a separate
  dev-tooling cleanup if the repository needs to remove webpack from every dependency
  path.

## Remaining ESM Work

- Convert `commitlint.config.js` to ESM syntax or rename it to `commitlint.config.mjs`.
- Add `"type": "module"` to the root `package.json`.
- Re-run the CommonJS audit after the root type switch.

Recommended audit:

```sh
rg -n "module\\.exports|require\\(|__dirname|__filename|exports\\." . --glob '!node_modules' --glob '!dist' --glob '!coverage' --glob '!package-lock.json'
```

## Validation Checklist

Run in normal environments:

```sh
npm run lint:styles
npx nx lint root-config
npx nx lint board
npx nx lint profile
npx nx lint notes
npx nx test board
npx nx build board --configuration=production
npx nx build root-config
npx nx build profile
npx nx build notes
```

Run in sandboxed environments:

```sh
npm run lint:styles
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx lint root-config
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx lint board
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx lint profile
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx lint notes
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx test board
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx build board --configuration=production
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx build root-config
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx build profile
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx build notes
```

If Storybook is in scope:

```sh
NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx run storybook-angular:build-storybook
```

## Exit Criteria

- Root `package.json` contains `"type": "module"`.
- Root Node-executed config files do not rely on implicit CommonJS behavior.
- `board:test` stays green through Vitest.
- CI targets only existing projects.
- Active app lint, test, and production build targets stay green.
