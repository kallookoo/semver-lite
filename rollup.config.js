import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: 'dist',
        declaration: true,
      }),
      resolve(),
      commonjs(),
    ],
  },
  // ESM build (minified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.min.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: 'dist',
        declaration: true,
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
  // UMD build
  {
    input: 'src/index.ts',
    output: {
      name: 'semverLite',
      file: 'dist/index.umd.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: 'dist',
        declaration: true,
      }),
      resolve(),
      commonjs(),
    ],
  },
  // UMD build (minified)
  {
    input: 'src/index.ts',
    output: {
      name: 'semverLite',
      file: 'dist/index.umd.min.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: 'dist',
        declaration: true,
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
  // IIFE build
  {
    input: 'src/index.ts',
    output: {
      name: 'semverLite',
      file: 'dist/index.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: 'dist',
        declaration: true,
      }),
      resolve(),
      commonjs(),
    ],
  },
  // IIFE build (minified)
  {
    input: 'src/index.ts',
    output: {
      name: 'semverLite',
      file: 'dist/index.min.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: 'dist',
        declaration: true,
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
];
