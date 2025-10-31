import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/caltrain-tracker-card.ts',
  output: {
    file: 'dist/caltrain-tracker-card.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({
      declaration: false,
    }),
    terser({
      compress: {
        drop_console: false,
      },
      mangle: {
        safari10: true,
      },
    }),
  ],
};
