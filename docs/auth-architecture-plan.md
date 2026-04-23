# Auth Architecture Plan

Date: 2026-04-23

## Current Baseline

- `apps/platform/root-config` already owns orchestration, routing activation, and `PlatformContext` creation.
- `libs/platform/contracts` already defines shared runtime primitives such as:
  - `session`
  - `navigate`
  - `events`
  - `logger`
- Every remote already conforms to the same `mount(container, context)` boundary.
- Today `session` is only a static snapshot and is hard-coded in the host.

## Problem Statement

- Authentication must be shared across Angular, React, and Vue remotes.
- The host should not become a large UI-heavy Angular shell just to render login screens.
- Each remote should not re-implement login, token refresh, logout, and route guarding separately.
- Auth state changes must propagate cleanly after login, logout, or refresh.

## Recommendation

Use this split of responsibilities:

- `root-config` handles auth orchestration.
- A dedicated `auth` remote handles auth UI.
- A shared `libs/platform/auth` package handles session state and API integration.

This keeps the host thin in UI terms while still making it the single place that decides whether a route is accessible.

## Responsibility Split

### `apps/platform/root-config`

Keep only orchestration concerns here:

- restore session on startup
- call `GET /me` or equivalent bootstrap endpoint
- decide whether a route requires auth
- redirect unauthenticated users to `/auth/login?returnTo=...`
- pass session snapshot into `PlatformContext`
- emit auth lifecycle events such as:
  - `auth:session-restored`
  - `auth:session-changed`
  - `auth:logged-out`

Do not put login forms, MFA flows, password reset screens, or identity-provider-specific UI here.

### `apps/angular/auth`

Create a dedicated auth remote, for example on `/auth/*`.

This remote should own:

- login form
- auth callback route
- logout confirmation
- forgot password / reset password
- MFA / OTP screens if needed

This keeps auth UI in a normal application instead of burying it inside the host.

### `libs/platform/auth`

Create a shared auth package for cross-remote reuse.

Suggested responsibilities:

- session store
- `restoreSession()`
- `refreshSession()`
- `clearSession()`
- authorized `fetch` / API client wrapper
- auth event helpers
- role / permission helpers

This package should be framework-agnostic so Angular, React, and Vue remotes can all use it.

## Why Not Put Everything In `root-config`

That would make the host responsible for:

- login UI
- auth business logic
- route orchestration
- cross-app session distribution

This quickly turns the host into a thick shell. In this architecture the host should stay an orchestrator, not become the primary product application.

## Why Not Let Every Remote Authenticate Itself

Avoid this.

Problems:

- duplicated login logic
- duplicated refresh logic
- inconsistent logout behavior
- race conditions between remotes
- harder security review
- harder onboarding for new remotes

## Recommended Session Shape

`PlatformContext.session` should remain a safe runtime snapshot, not a token container.

Suggested shape:

```ts
type PlatformSession = {
  signedIn: boolean;
  userId?: string;
  roles?: string[];
  permissions?: string[];
  expiresAt?: string;
};
```

Do not pass access tokens through `PlatformContext`.

## Session Change Propagation

Important constraint: `PlatformContext` is currently passed at mount time. That means auth changes will not automatically update already-mounted remotes.

Use one of these patterns:

1. Shared auth store in `libs/platform/auth`
2. Host emits `auth:session-changed` through the existing event bus
3. Host remounts or updates remotes when session changes

Recommended approach:

- shared auth store for reads and API access
- event bus notifications for reactive updates

## Route Protection Strategy

Extend the manifest or remote metadata with something like:

```ts
type RemoteManifestEntry = {
  key: string;
  routePath: string;
  requiresAuth?: boolean;
};
```

Then the host can:

- allow public routes directly
- redirect protected routes to `/auth/login`
- return to the original route after successful login

Suggested public routes:

- `/`
- `/auth/*`

Suggested protected routes:

- `/board`
- `/profile`
- `/notes`

## Security Direction

Prefer backend session cookies or `HttpOnly` cookies over storing auth tokens in `localStorage`.

Why:

- less token exposure in browser JavaScript
- easier sharing between remotes on the same origin
- cleaner logout and refresh semantics

If bearer tokens are unavoidable, keep them inside `libs/platform/auth` only and never pass them through `PlatformContext`.

## Options Considered

### Option 1. Auth UI in `root-config`

Pros:

- simplest initial wiring
- fewer moving parts

Cons:

- thick host
- auth UI coupled to orchestration layer
- poor long-term fit for polyglot remotes

### Option 2. Dedicated `auth` Remote Plus Host Orchestration

Pros:

- best fit for current architecture
- clean separation of UI and orchestration
- easy to reuse auth state from all remotes

Cons:

- one more app to maintain

### Option 3. Full Angular Shell App Around Everything

Pros:

- useful if global authenticated UX grows a lot
- easier place for nav, profile menu, notifications, tenant switcher

Cons:

- larger architectural shift
- overlaps with what `root-config` already does

## Final Recommendation

For this repository, the best next step is:

1. Keep `root-config` as the auth orchestrator.
2. Add a dedicated `apps/angular/auth` remote for auth UI.
3. Add `libs/platform/auth` for shared auth logic and session state.
4. Extend `PlatformSession` and remote metadata for auth-aware routing.
5. Use the event bus plus shared store to propagate session changes.

## Implementation Outline

### Phase 1

- add `libs/platform/auth`
- add session store and bootstrap helpers
- extend `PlatformSession`

### Phase 2

- add `apps/angular/auth`
- register `/auth/*` route in manifest
- implement login and callback flows

### Phase 3

- add `requiresAuth` metadata to protected remotes
- enforce redirects in `root-config`
- emit `auth:session-changed` events

### Phase 4

- migrate remotes to read session and API auth through `libs/platform/auth`
- remove any duplicated auth logic from feature remotes
