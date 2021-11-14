<script>
	import { parsePost } from '../js/PostParser';
	import { onMount } from 'svelte';
	import { API_PROTOCOL, API_SERVER } from '../js/apiConfig';
	import { parseErrors } from '../js/ErrorParser';

	export let postVersion;
	let references = null;
	let parsedText = '';
	let saved = true;
	let timeout = null;

	function updateData(initial = false) {
		const post = parsePost(postVersion.previewText +'\n'+ postVersion.rawText);
		parsedText = post.text;
		references = post.references;
		if (!initial) {
			saved = false;
			if(timeout != null) {
				clearTimeout(timeout)
			}
			timeout = setTimeout(saveData, 3000)
		}
	}

	function fixRawText() {
		if (postVersion.rawText.length > 0) {
			postVersion.rawText = postVersion.rawText.substr(postVersion.previewText.length + 1);
		}
		else {
			postVersion.rawText = postVersion.rawText.substr(postVersion.previewText ? postVersion.previewText.length : 0);
		}
	}

	onMount(() => {
		fixRawText();

		window.addEventListener('beforeunload', function (e) {
			if (!saved) {
				e.preventDefault();
				e.returnValue = '';
			}
		});
		updateData(true);
	});

	function saveData() {
		timeout = null;
		fetch(API_PROTOCOL + API_SERVER + '/Post/PostVersion/', {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": "Bearer " + localStorage.getItem("jwt")
			},
			body: JSON.stringify({postVersionId: postVersion.postVersionId, rawText: postVersion.previewText +'\n'+ postVersion.rawText, previewText: postVersion.previewText}),
			method: 'PUT',
		}).then((response) => {
			switch (response.status) {
				case 200:
					response.json().then((data) => {
						postVersion = data;
						fixRawText();
						updateData(true);
					});
					break;
				default:
					alert('Could not save data')
					break;
			}
		});
		saved = true;
	}
</script>

<div>
	{#if postVersion}
		<div>
			<textarea bind:value={postVersion.previewText}
								on:input={() => {updateData()}}
								style="width:100%; min-height:200px;" />
			<textarea bind:value={postVersion.rawText}
								on:input={() => {updateData()}}
								style="width:100%; min-height:300px;" />
			{#if saved}
				<label>Saved</label>
			{:else}
				<label>Not Saved</label>
			{/if}
		</div>
		<div id="parsed-container" style="background-color: #F0F0F0; border-style: solid">
			<div>{@html parsedText}</div>
			{#if references && references.length}
				<hr />
				<table>
					<tbody>
						{#each references as reference}
							<tr>
								<td valign="top"><a href={'#ref_'+reference.count+'_top'}><strong>[{reference.count}]</strong></a></td>
								<td id={'ref_'+reference.count+'_bot'}>{reference.text}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	{/if}
</div>
