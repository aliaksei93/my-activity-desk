<script setup lang="ts">
import type { PlatformContext } from '@my-activity-desk/platform/contracts';

const props = defineProps<{
  context: PlatformContext;
}>();

const flagSummary = Object.keys(props.context.flags).join(', ');

const emitPing = (): void => {
  props.context.events.emit('remote:notes:ping', {
    remote: 'notes',
    route: props.context.routePath,
    boundary: 'mount/unmount',
  });
};
</script>

<template>
  <section class="notes-card">
    <div class="notes-kicker">Vue remote</div>

    <h2 class="notes-title">Notes uses the same platform contract as Angular and React remotes.</h2>

    <p class="notes-copy">
      Vue receives its runtime context from the host and stays independent from
      the host framework or router implementation.
    </p>

    <dl class="notes-meta">
      <dt>Route</dt>
      <dd>{{ props.context.routePath }}</dd>
      <dt>Signed in</dt>
      <dd>{{ String(props.context.session.signedIn) }}</dd>
      <dt>Flags</dt>
      <dd>{{ flagSummary }}</dd>
    </dl>

    <div class="notes-actions">
      <button type="button" class="notes-button notes-button-primary" @click="emitPing">
        Emit platform event
      </button>
      <button
        type="button"
        class="notes-button notes-button-secondary"
        @click="props.context.navigate('/board')"
      >
        Jump to Angular remote
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.notes-card {
  background:
    linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(13, 148, 136, 0.08)),
    rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(5, 150, 105, 0.16);
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(15, 118, 110, 0.14);
  padding: 1.5rem;
}

.notes-kicker {
  color: #0f766e;
  font-size: 0.74rem;
  letter-spacing: 0.14em;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.notes-title {
  font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
  font-size: 2rem;
  line-height: 1;
  margin: 0 0 0.75rem;
}

.notes-copy {
  color: #475569;
  line-height: 1.6;
  margin: 0 0 1rem;
}

.notes-meta {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: minmax(0, max-content) 1fr;
  margin: 0 0 1.25rem;

  dt {
    font-weight: 700;
  }

  dd {
    margin: 0;
  }
}

.notes-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.notes-button {
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  padding: 0.8rem 1.1rem;

  &-primary {
    background: #0f766e;
    border: 0;
    color: #fff;
  }

  &-secondary {
    background: transparent;
    border: 1px solid rgba(15, 118, 110, 0.28);
    color: #115e59;
  }
}
</style>
