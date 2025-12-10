import type { ModuleFederationRuntimePlugin } from '@module-federation/enhanced/runtime';

const offlineHandlingPlugin = (): ModuleFederationRuntimePlugin => ({
  name: 'offline-handling-plugin',
  async errorLoadRemote(args) {
    const { lifecycle, id, error } = args;
    console.warn('[MF] remote load error:', id, lifecycle, error);

    if (lifecycle === 'afterResolve') {
      return args;
    }

    if (lifecycle === 'onLoad') {
      return {
        __esModule: true,
        default: () => null,
      };
    }

    return args;
  },
});

export default offlineHandlingPlugin;
