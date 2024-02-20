import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: './src/example/index.html',
		},
	},
	server: {
		open: '/src/example/index.html',
	},
});
