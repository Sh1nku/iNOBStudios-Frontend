<script context="module">
	import { API_PROTOCOL, API_SERVER } from '../../../js/apiConfig';
	import { parsePost } from '../../../js/PostParser';

	export async function load({ page, fetch }) {
		const res = await fetch(API_PROTOCOL+API_SERVER+'/Post/Post/'+page.params.postId+'/'+page.params.postName);
		if (res.ok) {
			const post = await res.json();
			const parsed = parsePost(post.currentVersion.rawText);

			return {
				props: {
					post: post,
					text: parsed['text'],
					references: parsed['references']
				}
			};
		}
		return {
			status: res.status,
			error: new Error()
		};

	}
</script>

<script>
	export let references = null;
	export let post;
	export let text = null;
</script>

<main class='post'>
	<h2>{post.currentVersion.title}</h2>
	<div style="margin-left: 0px; margin-right: 0px">
		Posted on {post.firstPublished.substr(0, 10)} |
		Last updated {post.currentVersion.postedDate.substr(0, 10)} |
		Tags:
		{#each post.postTags as tag}
			<a style="margin-right: 8px; white-space: nowrap" href={'/?tag='+tag}>{tag}</a>
		{/each}
	</div>
	<hr />
	<div>{@html parsePost(post.currentVersion.rawText)['text']}</div>
	{#if references && references.length}
		<hr />
		<table>
			<tbody>
			<tr>
				{#each references as reference}
					<td valign="top"><a href={'#ref_'+reference.count+'_top'}><strong>[{reference.count}]</strong></a></td>
					<td id={'ref_'+reference.count+'_bot'}>{reference.text}</td>
				{/each}
			</tr>
			</tbody>
		</table>
	{/if}
</main>
