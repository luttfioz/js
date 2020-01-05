import babel from 'rollup-plugin-babel';

const format = 'iife';

export default {
  input: './index.js',
  output: {
    format,
    file: `dist/index.min.js`
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
