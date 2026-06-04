import { tsconfigPathsPlugin } from 'esbuild-plugin-tsconfig-paths';
import { defineConfig } from 'tsup';

export default defineConfig({
  tsconfig: './tsconfig.json',
  entry: ['src/index.ts'],
  format: 'esm',
  clean: true,
  dts: true,
  sourcemap: true,
  treeshake: true,
  bundle: true,
  esbuildPlugins: [
    tsconfigPathsPlugin({
      //
    }),
  ],
});
