<script context="module">
	import { API_PROTOCOL, API_SERVER } from '../js/apiConfig';
	export async function load({ page, fetch }) {
		const tag = page.query.get('tag') ? '?tag='+page.query.get('tag') : '';
		const res = await fetch(API_PROTOCOL+API_SERVER+'/Post/Posts'+tag);

		if (res.ok) return {
			props: {
				data: await res.json()
			}
		};
		return {
			status: res.status,
			error: new Error()
		};
	}
</script>

<script>
	import PostPreview from '../components/PostPreview.svelte';

	export let data;
</script>

<main>
	{#each data.posts as post}
		<PostPreview post={post}/>
	{/each}
</main>
