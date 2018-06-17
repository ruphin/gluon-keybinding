import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import includePaths from 'rollup-plugin-includepaths';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import * as path from 'path';

const includePathOptions = {
  paths: ['node_modules/@gluon/keybinding', '.'],
  extensions: ['.js']
};

function getConfig({ dest, format, uglified = true, transpiled = false, bundled = true }) {
  const conf = {
    input: 'src/gluon-keybinding.js',
    output: { exports: 'named', file: dest, format, name: 'GluonKeybinding', sourcemap: uglified },
    external: bundled ? [] : [path.resolve('./@gluon/gluon/gluon.js')],
    plugins: [
      bundled && includePaths(includePathOptions),
      transpiled && resolve(),
      transpiled &&
        commonjs({
          include: 'node_modules/**'
        }),
      transpiled &&
        babel({
          presets: [['env', { modules: false }]],
          plugins: ['external-helpers']
        }),
      uglify({
        warnings: true,
        toplevel: uglified,
        sourceMap: uglified,
        compress: uglified && { passes: 2 },
        mangle: uglified,
        output: { beautify: !uglified }
      }),
      filesize()
    ].filter(Boolean)
  };

  return conf;
}

const config = [
  getConfig({ dest: 'gluon-keybinding.es5.js', format: 'iife', transpiled: true }),
  getConfig({ dest: 'gluon-keybinding.umd.js', format: 'umd' })
];

export default config;
