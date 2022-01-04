<script>
    import { parsePost } from '../js/PostParser';
    import { getCanonicalUrl } from '../js/helpers.js';
    import { session } from '$app/stores';

    export let post;
    let parsedPost = parsePost($session.api_url, post.currentVersion.rawText);
</script>

<svelte:head>
    <meta property="og:title" content="{post.currentVersion.title}" />
    <meta property="og:description" content={post.currentVersion.previewText.length > 200 ? post.currentVersion.previewText.substr(0, 197)+'...' : post.currentVersion.previewText} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content={getCanonicalUrl($session.hostname, post.postId, post.currentVersion.title, post.alias)}/>
    <meta property="og:image" content="https://inobstudios.com/iNOBStudios-Logo-OpenGraph.png" />
</svelte:head>

<main class='post'>
    <h2>{post.currentVersion.title}</h2>
    <div style='margin-left: 0px; margin-right: 0px'>
        Posted on {post.firstPublished.substr(0, 10)} | Last updated {post.currentVersion.postedDate.substr(0, 10)}
        |
        Tags:
        {#each post.postTags as tag}
            <a style='margin-right: 8px; white-space: nowrap' href={'/?tag=' + tag}>{tag}</a>
        {/each}
    </div>
    <hr />
    <div>{@html parsedPost.text}</div>
    {#if parsedPost.references && parsedPost.references.length}
        <hr />
        <table>
            <tbody>
            {#each parsedPost.references as reference}
                <tr>
                    <td valign='top'
                    ><a href={'#ref_' + reference.count + '_top'}><strong>[{reference.count}]</strong></a></td
                    >
                    <td id={'ref_' + reference.count + '_bot'}>{reference.text}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    {/if}
</main>