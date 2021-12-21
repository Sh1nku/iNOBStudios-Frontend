<script>
    import { parsePost } from '../js/PostParser';
    import { session } from '$app/stores';

    export let post;
</script>

<div class="post">
    <a class="post-title" href={'Post/' + post.postId + '/' + post.currentVersion.title}>
        <h2>{post.currentVersion.title}</h2></a
    >
    Posted on {post.firstPublished.substr(0, 10)} | Tags:
    {#if post.postTags.length > 0}
        {#each post.postTags as tag}
            <a style="margin-right: 8px; white-space: nowrap" href={'?tag=' + tag} class="post-text-link">{tag}</a>
        {/each}
    {:else}
        Not Tagged
    {/if}
    <hr />
    <div>{@html parsePost($session.api_url, post.currentVersion.previewText)['text']}</div>
    <a class="post-text-link" href={'Post/' + post.postId + '/' + post.currentVersion.title}>Continue reading</a>
    <hr />
</div>

<style>
    .post-title {
        color: black;
        text-decoration: none;
    }

    .post-title:hover {
        text-decoration: underline;
    }
</style>
