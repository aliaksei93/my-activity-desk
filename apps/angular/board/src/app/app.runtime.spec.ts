import { describe, expect, it } from 'vitest';
import { defaultBoardAppRuntime } from './app.runtime';

describe('defaultBoardAppRuntime', () => {
  it('uses standalone mode at the application root', () => {
    expect(defaultBoardAppRuntime).toEqual({
      mode: 'standalone',
      basePath: '/',
    });
  });
});
