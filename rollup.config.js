import filesize from 'rollup-plugin-filesize';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import includePaths from 'rollup-plugin-includepaths';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import * as path from 'path';

const license = min =>
  min
    ? ''
    : `/**
 * @license
 * MIT License
 *
 * Copyright (c) 2018 Goffert van Gool
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
`;

const includePathOptions = {
  paths: ['node_modules/@gluon/gluon', '.'],
  extensions: ['.js']
};

function getConfig({ dest, format, minified = false, transpiled = false, bundled = true }) {
  const conf = {
    input: 'src/gluon-keybinding.js',
    output: { banner: license(minified), file: dest, format, name: 'GluonKeybinding', sourcemap: !minified },
    external: [!bundled && path.resolve('./@gluon/gluon/gluon.js')].filter(Boolean),
    plugins: [
      includePaths(includePathOptions),
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
      // Remove duplicate license
      !minified &&
        cleanup({
          maxEmptyLines: 1,
          comments: [/^((?!\(c\) \d{4} Goffert)[\s\S])*$/]
        }),
      minified &&
        terser({
          warnings: true,
          mangle: {
            module: true
          },
          output: { preamble: license(minified) }
        }),
      minified && filesize()
    ].filter(Boolean)
  };

  return conf;
}

const config = [
  getConfig({ dest: 'gluon-keybinding.es5.js', format: 'iife', minified: true, transpiled: true }),
  getConfig({ dest: 'gluon-keybinding.umd.js', format: 'umd', minified: true })
];

export default config;
