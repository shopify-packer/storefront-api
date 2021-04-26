import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'StorefrontAPI',
        file: pkg.browser,
        format: 'umd',
        sourcemap: true,
      },
      {
        name: 'StorefrontAPI',
        file: pkg.browser.replace('.js', '.min.js'),
        format: 'umd',
        sourcemap: false,
        plugins: [
          terser()
        ]
      },
    ],
    plugins: [
      typescript({ sourceMap: false }),
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.main.replace('.js', '.min.js'),
        format: 'cjs' ,
        sourcemap: false,
        plugins: [
          terser()
        ],
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: false,
      },
    ],
    plugins: [
      typescript({ sourceMap: false }),
    ],
  }
];
