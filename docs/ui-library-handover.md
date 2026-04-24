# UI Library Handover

Date: 2026-04-08

## Session Summary

This session moved the UI library from a single Angular-specific location toward a design-system layout that can support Angular, React, and Vue without mixing framework code and token definitions.

Key decisions:

- Design tokens are framework-agnostic and live under `libs/design/tokens`.
- Framework implementations live under separate roots:
  - `libs/angular/*`
  - `libs/react/*`
  - `libs/vue/*`
- Storybook infrastructure lives in `apps`, not inside a library.
- Applications import framework domain roots directly instead of going through extra public facade packages.

## Resulting Workspace Shape

```text
apps/
  storybook/
    angular/

libs/
  design/
    tokens/

  angular/
    ui/
      src/
        lib/
          button/
          card/
          badge/
          surface/
          spinner/
    forms/
      src/
        lib/
          input/
          select/
          checkbox/
          field/
          validation/
    overlays/
      src/
        lib/
          dialog/
          tooltip/

  react/
    ui/
      src/
      button/
    forms/
      src/
      input/

  vue/
    ui/
      src/
      button/
    forms/
      src/
      input/
```

## What Was Implemented

- Added `libs/design/tokens` as the shared source for token metadata and shared SCSS theme/base layers.
- Added direct framework domain entrypoints for internal app imports.
- Added real Angular domain packages with current component code under:
  - `libs/angular/ui/src/lib/button`
  - `libs/angular/ui/src/lib/card`
  - `libs/angular/forms/src/lib/input`
  - `libs/angular/forms/src/lib/select`
  - `libs/angular/forms/src/lib/checkbox`
- Added visible placeholders so the target architecture is explicit under:
  - `libs/angular/ui/src/lib/badge`
  - `libs/angular/ui/src/lib/surface`
  - `libs/angular/ui/src/lib/spinner`
  - `libs/angular/forms/src/lib/field`
  - `libs/angular/forms/src/lib/validation`
  - `libs/angular/overlays/src/lib/dialog`
  - `libs/angular/overlays/src/lib/tooltip`
  - `libs/react/*`
  - `libs/vue/*`
- Moved Storybook host into `apps/storybook/angular`.
- Updated the board app style entrypoint to consume `libs/design/tokens` instead of Angular-local styles:
  - `apps/angular/board/src/styles.scss`
- Updated TypeScript path aliases in `tsconfig.base.json` for direct framework domain entrypoints.

## Storybook Notes

- Angular Storybook host project: `storybook-angular`
- Location: `apps/storybook/angular`
- Stories glob: `libs/angular/**/*.stories.ts`
- Shared Storybook theme CSS: `libs/design/tokens/src/styles/storybook.scss`
- Dev URL: `http://localhost:4600/`

Rationale:

- Storybook host is now a technical app, not part of a component library.
- This keeps Angular Storybook isolated from future React and Vue Storybook hosts.
- Future framework-specific hosts should live under:
  - `apps/storybook/react`
  - `apps/storybook/vue`

## Import Policy

- Applications should import framework domain roots directly:
  - `@my-activity-desk/angular/ui`
  - `@my-activity-desk/angular/forms`
  - `@my-activity-desk/angular/overlays`
  - `@my-activity-desk/react/ui`
  - `@my-activity-desk/react/forms`
  - `@my-activity-desk/vue/ui`
  - `@my-activity-desk/vue/forms`
- New Angular components should be created inside domain packages under `libs/angular/*/src/lib/*`.

## Run Commands

Normal environment:

- `npx nx run storybook-angular:storybook --open=false`
- `npx nx run storybook-angular:build-storybook:ci`
- `npx nx build root-config`
- `npx nx build board --configuration development`
- `npx nx test board`

Sandboxed environment:

- `source ./tools/nx-sandbox-env.sh`
- Then run the same `nx` commands via that shell context.

## Verified During This Session

The following commands were verified on 2026-04-24:

- `git diff --check`
- `npx tsc -p apps/storybook/angular/tsconfig.json --noEmit`
- `NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx show project storybook-angular`
- `NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx run storybook-angular:build-storybook:ci`
- `NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx build root-config`
- `NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx build board --configuration development`
- `NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx test board`
- `npx sass apps/angular/board/src/styles.scss /tmp/board-styles.css`

Note: `board:build` and `board:serve` now run `board:set-version` first, so `apps/angular/board/public/version.json` is generated as part of the normal Nx task lifecycle.

Live verification:

- `npx nx run storybook-angular:storybook --open=false` successfully started on `http://localhost:4600/`
- The dev server was explicitly stopped after verification
- A final process check confirmed that no lingering Storybook process remained

## Current Limits

- React and Vue folders are placeholders only.
- Angular placeholder packages do not yet contain real implementations.
- Angular component folders do not yet have dedicated unit tests.
- React and Vue domain roots currently re-export placeholder leaf packages.
- Public publication is not a goal; the current focus is internal app consumption through direct domain imports.

## Recommended Next Steps

1. Migrate application imports toward direct framework domain entrypoints such as:
   - `@my-activity-desk/angular/ui`
   - `@my-activity-desk/angular/forms`
   - `@my-activity-desk/angular/overlays`
   - `@my-activity-desk/react/ui`
   - `@my-activity-desk/react/forms`
   - `@my-activity-desk/vue/ui`
   - `@my-activity-desk/vue/forms`
2. Implement the next Angular packages:
   - `badge`
   - `spinner`
   - `dialog`
   - `tooltip`
   - `field`
   - `validation`
3. Add unit tests for the Angular component folders.
4. Add React and Vue implementations on top of `libs/design/tokens`.
5. Create `apps/storybook/react` and `apps/storybook/vue` only when those framework packages become real.
