<script>
	import { parsePost } from '../js/PostParser';
	export let post;
</script>
<div>
	<a class="post-title" href={'Post/'+post.postId+'/'+post.currentVersion.title}><h2>{ post.currentVersion.title }</h2></a>
	Posted on { post.firstPublished.substr(0,10) } |
	Tags:
	{#if post.postTags.length > 0}
		{#each post.postTags as tag}
			<a style="margin-right: 8px; white-space: nowrap" href={'?tag='+tag} class="link">{ tag }</a>
		{/each}
	{:else}
		Not Tagged
	{/if}
	<hr>
	<div class="post" >{@html parsePost(post.currentVersion.previewText)['text']}</div>
	<a href={'Post/'+post.postId+'/'+post.currentVersion.title} class="link">Continue reading</a>
	<hr>
</div>

<style>
    .post-title {
        color: black;
        text-decoration: none;
    }

    .post-title:hover {
        text-decoration: underline;
    }

    .link {
        color: #0366d6;
        text-decoration: none;
    }

    .link:hover {
        text-decoration: underline;
    }
</style>
