import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import resolve from '@rollup/plugin-node-resolve';

export default defineConfig({
	plugins: [sveltekit(), resolve()],
	build: {
		rollupOptions: {
			external: ['@resvg/resvg-js-linux-x64-gnu']
		}
	}
});
