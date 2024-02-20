import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [],
	build: {
		manifest: true,
		minify: true,
		reportCompressedSize: true,
		lib: {
			entry: path.resolve(__dirname, 'src/main.ts'),
			fileName: 'main',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: [],
			plugins: [
				typescriptPaths({
					preserveExtensions: true,
				}),
				typescript({
					sourceMap: false,
					declaration: true,
					outDir: 'dist',
				}),
			],
		},
	},
});
