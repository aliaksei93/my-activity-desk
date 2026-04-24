# UI Library Plan

Date: 2026-04-08

## Current Baseline

- Shared tokens live in `libs/design/tokens`.
- Angular implementation is split into:
  - domain packages under `libs/angular/ui`, `libs/angular/forms`, and `libs/angular/overlays`
  - component folders inside `src/lib/*`
- Placeholder roots already exist for:
  - `libs/angular/overlays/*`
  - `libs/react/*`
  - `libs/vue/*`
- Storybook host lives in `apps/storybook/angular`.

## Working Commands

- `npx nx run storybook-angular:storybook --open=false`
- `NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx run storybook-angular:build-storybook:ci`
- `NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx build root-config`
- `NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx build board --configuration development`
- `NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx test board`

Storybook Angular dev server is configured for `http://localhost:4600/`.
Board build and serve tasks run `board:set-version` before Angular starts, so `apps/angular/board/public/version.json` is generated during normal Nx workflows.

## Next Steps

1. Standardize internal imports on direct domain entrypoints such as:
   - `@my-activity-desk/angular/ui`
   - `@my-activity-desk/angular/forms`
   - `@my-activity-desk/angular/overlays`
   - `@my-activity-desk/react/ui`
   - `@my-activity-desk/react/forms`
   - `@my-activity-desk/vue/ui`
   - `@my-activity-desk/vue/forms`
2. Implement the next Angular component folders:
   - `badge`
   - `spinner`
   - `dialog`
   - `tooltip`
   - `field`
   - `validation`
3. Add unit tests for the Angular component folders.
4. Add React and Vue implementations on top of `libs/design/tokens`.
5. Add framework-specific Storybook hosts when React or Vue libraries become real.
