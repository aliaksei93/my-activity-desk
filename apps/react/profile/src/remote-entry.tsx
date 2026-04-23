import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import type { MountedRemote, PlatformContext, RemoteMount } from '@my-activity-desk/platform/contracts';
import { ProfileApp } from './app/app';

const render = (root: ReactDOM.Root, context: PlatformContext): void => {
  root.render(
    <StrictMode>
      <ProfileApp context={context} />
    </StrictMode>,
  );
};

export const mount: RemoteMount = (
  container,
  context,
): MountedRemote => {
  const root = ReactDOM.createRoot(container);
  render(root, context);
  context.logger.info('Profile remote mounted');

  return {
    unmount: () => {
      root.unmount();
    },
    update: (nextContext) => {
      render(root, nextContext);
    },
  };
};
