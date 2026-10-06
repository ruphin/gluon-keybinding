import { defineConfig } from 'vite';

// Library build, emitted into the package root to keep the published paths unchanged:
// - `vite build`             -> gluon-keybinding.js (ES module, @gluon/gluon kept external
//                               and imported from '../gluon/gluon.js' as before)
// - `vite build --mode umd`  -> gluon-keybinding.umd.js (minified UMD bundle, @gluon/gluon inlined)
export default defineConfig(({ mode }) => {
  const umd = mode === 'umd';
  return {
    server: {
      open: '/examples/'
    },
    build: {
      outDir: '.',
      emptyOutDir: false,
      copyPublicDir: false,
      sourcemap: umd,
      minify: umd,
      lib: {
        entry: 'src/gluon-keybinding.js',
        name: 'GluonKeybinding',
        formats: [umd ? 'umd' : 'es'],
        fileName: () => (umd ? 'gluon-keybinding.umd.js' : 'gluon-keybinding.js')
      },
      rollupOptions: umd
        ? {}
        : {
            external: ['@gluon/gluon'],
            output: { paths: { '@gluon/gluon': '../gluon/gluon.js' } }
          }
    }
  };
});
