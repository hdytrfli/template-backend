import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: 'esm',
  clean: true,
  dts: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  tsconfig: './tsconfig.json',
});
