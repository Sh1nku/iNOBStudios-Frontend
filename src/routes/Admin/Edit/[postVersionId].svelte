<script>
	import { onMount } from 'svelte';
	import { API_PROTOCOL, API_SERVER } from '../../../js/apiConfig';
	import { page } from "$app/stores";
	import ManageAttachments from '../../../components/ManageAttachments.svelte';
	import ManageTags from '../../../components/ManageTags.svelte';

	onMount(() => {
		fetch(API_PROTOCOL + API_SERVER + '/Admin/Edit/'+$page.params.postVersionId, {
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("jwt")
			},
			method: 'GET',
		}).then((response) => {
			switch (response.status) {
				case 200:
					response.json().then((data) => {
						postVersion = data['postVersion'];
						post = data['post'];
						tags = data['tags'];
					});
					break;
			}
		})
	});

	let postVersion = null;
	let post = null
	let tags = null
	let errors = null;
</script>


<main>
	<h1>Edit Post</h1>
	<hr />
	{#if postVersion && post}
		<table>
			<tr>
				<td>Title:</td>
				<td><input type="text" bind:value={postVersion.title} /></td>
			</tr>
			<tr>
				<td colspan='2'><button>Update Title</button></td>
			</tr>
		</table>
		<hr />
		<div class='flex-container' >
			<div>
				<ManageAttachments bind:errors={errors} post={post}/>
			</div>
			<div>
				<ManageTags post={post} tags={tags}/>
			</div>
		</div>
	{/if}
</main>

<style>
    .flex-container {
        display:flex;
        flex-flow: row wrap;
    }

    .flex-container > div {
        flex: 40%;
        margin: 20px;
    }
</style>
