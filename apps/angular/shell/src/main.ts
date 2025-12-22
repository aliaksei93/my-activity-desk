import { initModuleFederation } from '@my-activity-desk/shell/mf';

initModuleFederation().then();

import('./bootstrap').catch((err) => console.error('[Bootstrap] Failed to start Angular:', err));
