<script>
	export let post;
	export let tags;
	let selectedTag = null;
	let newTag = '';

	function deletePostTag(tag) {

	}

	function addPostTag() {

	}

	function createTag() {

	}
</script>

<h4>Tags</h4>
{#if post.postTags && post.postTags.length > 0}
	<ul>
		{#each post.postTags as tag}
			<li>{tag} <button on:click={() => deletePostTag(tag)}>Delete</button></li>
		{/each}
	</ul>
{:else}
	<p>No tags</p>
{/if}
<hr />
<select bind:value={selectedTag}>
	{#each tags as tag}
		<option value={tag}>{tag}</option>
	{/each}
</select>
<button on:click={addPostTag}>Add tag to post</button>
<br />
<input type="text" bind:value={newTag}/>
<button on:click={createTag}>Create Tag</button>
