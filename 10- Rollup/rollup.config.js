import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const dependencies = Object.keys(require('./package.json').dependencies)
const format = 'iife';

export default {
  input: './index.js',
  output: [
    {
      format,
      file: `dist/index.min.js`,
      globals: {
        'lodash': '_',
      }
    }, {
      format: 'esm',
      file: `dist/index.esm.js`
    }, {
      format: 'amd',
      file: `dist/index.amd.js`
    }, {
      format: 'cjs',
      file: `dist/index.cjs.js`
    }, {
      format: 'umd',
      file: `dist/index.umd.js`,
      name: 'distumd'
    }, {
      format: 'system',
      file: `dist/index.system.js`,
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs()
  ],
  // external: ['lodash'],
  // external: dependencies,
}
