import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const isProdEnv = process.env.BUILD === 'production';
const isNode = process.env.ISNODE === 'true';
const format = 'esm';
const umdFormat = 'umd';
const outputesm = { format, file: `dist/index.${format}.js`, };
const outputumd = { format: umdFormat, name: 'umdModule', file: `dist/index.${umdFormat}.js`, };
const output = isNode ? outputumd : outputesm;
export default {
  input: 'src/index.js',
  output: [output],
  plugins: [
    !isNode && resolve({ preferBuiltins: true, browser: true, }),
    isNode && resolve({ preferBuiltins: true, browser: false, }),
    commonjs({ namedExports: { 'node_modules/axios/index.js': ['axios'] } }),
    babel({ exclude: 'node_modules/**', runtimeHelpers: true }),
    json(),
    !isProdEnv && !isNode &&
    serve({ openPage: '/index.html', contentBase: ['public', 'dist'], port: 3334 }),
    isProdEnv && sizeSnapshot(),
    isProdEnv && terser()
  ]
};

