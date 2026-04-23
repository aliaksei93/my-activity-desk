import type { PlatformContext } from '@my-activity-desk/platform/contracts';
import './app.scss';

export function ProfileApp({ context }: { context: PlatformContext }) {
  const emitPing = (): void => {
    context.events.emit('remote:profile:ping', {
      remote: 'profile',
      route: context.routePath,
      boundary: 'mount/unmount',
    });
  };

  return (
    <section className="profile-card">
      <div className="profile-kicker">React remote</div>

      <h2 className="profile-title">Profile is mounted through the neutral platform contract.</h2>

      <p className="profile-copy">
        The host injected navigation, event bus and feature flags through the shared
        <code> PlatformContext</code>. React is just another remote, not the shell.
      </p>

      <dl className="profile-meta">
        <dt>Route</dt>
        <dd>{context.routePath}</dd>
        <dt>Signed in</dt>
        <dd>{String(context.session.signedIn)}</dd>
        <dt>Flags</dt>
        <dd>{Object.keys(context.flags).join(', ')}</dd>
      </dl>

      <div className="profile-actions">
        <button className="profile-button profile-button-primary" onClick={emitPing} type="button">
          Emit platform event
        </button>
        <button
          className="profile-button profile-button-secondary"
          onClick={() => context.navigate('/notes')}
          type="button"
        >
          Jump to Vue remote
        </button>
      </div>
    </section>
  );
}

export default ProfileApp;
