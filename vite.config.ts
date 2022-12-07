import { rmSync } from 'fs';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import solidPlugin from 'vite-plugin-solid';
import pkg from './package.json';

rmSync('dist-electron', { recursive: true, force: true })
const sourcemap = !!process.env.VSCODE_DEBUG
const isBuild = process.argv.slice(2).includes('build');

export default defineConfig({
  plugins: [
    solidPlugin(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main/index.ts',
        onstart(options) {
          if (process.env.VSCODE_DEBUG) {
            console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App');
          } else {
            options.startup();
          }
        },
        vite: {
          build: {
            sourcemap,
            minify: isBuild,
            outDir: 'electron/dist/main',
            rollupOptions: {
              external: Object.keys(pkg.dependencies),
            },
          },
        },
      },
      {
        entry: 'electron/preload/index.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
          // instead of restarting the entire Electron App.
          options.reload();
        },
        vite: {
          build: {
            sourcemap,
            minify: isBuild,
            outDir: 'electron/dist/preload',
            rollupOptions: {
              external: Object.keys(pkg.dependencies),
            },
          },
        },
      },
    ]),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
