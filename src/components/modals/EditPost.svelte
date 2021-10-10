<script>
	import Modal from './Modal.svelte';
	import { API_PROTOCOL, API_SERVER } from '../../js/apiConfig';
	import { parseErrors } from '../../js/ErrorParser';
	import Errors from '../Errors.svelte';
	export let visible;
	export let posts;
	export let post;
	export let errors = null;

	$:visible, () => {
		post = visible == false ? null: post;
	};

	function togglePublish() {
		fetch(API_PROTOCOL + API_SERVER + '/Post/Post', {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": "Bearer " + localStorage.getItem("jwt")
			},
			method: 'PUT',
			body: JSON.stringify({ postId: post.postId, published: !post.published })
		}).then((response) => {
			switch (response.status) {
				case 200:
					response.json().then((data) => {
						errors = null;
						posts[data.postId] = data;
						post = posts[data.postId];
					});
					break;
				case 400:
					response.json().then((data) => {
						errors = parseErrors(data.errors);
					});
			}
		})
	}
</script>
<Modal bind:visible={visible} submit={togglePublish}>
	<h1>Edit post</h1>
	{#if post}
	<div>
		{#if post.published}
			<label>Status: Published</label>
			<button class="btn btn-primary" on:click={togglePublish}>Unpublish</button>
		{:else}
			<label>Status: Unpublished</label>
			<button class="btn btn-primary" on:click={togglePublish}>Publish</button>
		{/if}
	</div>
	<hr />
	<Errors errors={errors}/>
	{/if}
</Modal>
