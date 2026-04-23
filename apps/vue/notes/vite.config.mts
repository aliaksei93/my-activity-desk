/// <reference types='vitest' />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/apps/vue/notes',
  server: {
    port: 4203,
    host: 'localhost',
  },
  preview: {
    port: 4203,
    host: 'localhost',
  },
  plugins: [vue(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  build: {
    outDir: '../../../dist/apps/vue/notes',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/remote-entry.ts'),
      fileName: () => 'remote-entry.js',
      formats: ['es'],
      name: 'NotesRemote',
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
