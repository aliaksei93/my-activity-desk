/// <reference types='vitest' />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/apps/react/profile',
  server: {
    port: 4202,
    host: 'localhost',
  },
  preview: {
    port: 4202,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  build: {
    outDir: '../../../dist/apps/react/profile',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/remote-entry.tsx'),
      fileName: () => 'remote-entry.js',
      formats: ['es'],
      name: 'ProfileRemote',
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  define: {
    'import.meta.vitest': undefined
  },
}));
