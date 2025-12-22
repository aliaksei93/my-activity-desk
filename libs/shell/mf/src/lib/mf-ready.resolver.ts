import { ResolveFn } from '@angular/router';
import { initModuleFederation } from './mf-init';

export const mfReadyResolver: ResolveFn<boolean> = async () => {
  await initModuleFederation();
  return true;
};
