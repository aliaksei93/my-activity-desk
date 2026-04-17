# Design System Architecture

Date: 2026-04-08

## Goals

- Keep tokens framework-agnostic.
- Split Angular, React, and Vue implementation layers.
- Avoid Storybook infrastructure inside component libraries.
- Keep framework code grouped by domain, with component folders underneath and direct imports from those domain roots.

## Workspace Shape

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

## Storybook Strategy

- Angular Storybook host lives in `apps/storybook/angular`.
- It loads stories from `libs/angular/**/*.stories.ts`.
- Shared theme CSS comes from `libs/design/tokens/src/styles/storybook.scss`.
- Framework-specific Storybook hosts can be added later under:
  - `apps/storybook/react`
  - `apps/storybook/vue`

## Migration Policy

- New Angular components go into domain packages under `libs/angular/*`, with component folders inside `src/lib/*`.
- Applications should import framework domain roots directly:
  - `@my-activity-desk/angular/ui`
  - `@my-activity-desk/angular/forms`
  - `@my-activity-desk/angular/overlays`
- Apply the same convention to React and Vue roots as those libraries become real.
