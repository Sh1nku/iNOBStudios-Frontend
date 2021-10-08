/** @type {import('@sveltejs/kit').Config} */
import node from '@sveltejs/adapter-node';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: node(),
		vite: {
			optimizeDeps: {
				include: ["highlight.js/lib/core"],
			},
		},
	}
};

export default config;
