import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const format = 'iife';
// const format = 'esm';
// const format = 'amd';
// const format = 'cjs';

export default {
  input: './index.js',
  output: [
    {
      format,
      file: `dist/index.min.js`,
    }, {
      format: 'esm',
      file: `dist/index.esm.js`
    }, {
      format: 'amd',
      file: `dist/index.amd.js`
    }, {
      format: 'cjs',
      file: `dist/index.cjs.js`
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs()
  ]
}
