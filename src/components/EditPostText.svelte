<script>
	import { parsePost } from '../js/PostParser';
	import { onMount } from 'svelte';

	export let postVersion;
	let references = null;
	let parsedText = '';
	let saved = true;

	function updateData() {
		const post = parsePost(postVersion.previewText + postVersion.rawText);
		parsedText = post.text;
		references = post.references;
	}

	onMount(() => {
		if (postVersion.rawText.length > 0) {
			postVersion.rawText = postVersion.rawText.substr(postVersion.previewText.length + 1);
		}
		else {
			postVersion.rawText = postVersion.rawText.substr(postVersion.previewText.length);
		}
		updateData();
	});
</script>

<div>
	{#if postVersion}
		<div>
			<textarea bind:value={postVersion.previewText}
								on:input={updateData}
								style="width:100%; min-height:200px;" />
			<textarea bind:value={postVersion.rawText}
								on:input={updateData}
								style="width:100%; min-height:300px;" />
			{#if saved}
				<label>Saved</label>
			{:else}
				<label v-else>Not Saved</label>
			{/if}
		</div>
		<div id="parsed-container" style="background-color: #F0F0F0; border-style: solid">
			<div>{@html parsedText}</div>
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
		</div>
	{/if}
</div>
