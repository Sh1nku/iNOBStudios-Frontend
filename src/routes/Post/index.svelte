<script context='module'>
    export const hydrate = false;
    export const router = false;

    export async function load({ fetch, session }) {
        const res = await fetch(session.api_url + '/Post/SitemapPosts');
        if (res.ok) {
            const posts = await res.json();

            return {
                props: {
                    posts: posts.filter((x) => !x.alias)
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
    import { session } from '$app/stores';

    export let posts;
</script>

<svelte:head>
    <title>All posts - iNOBStudios</title>
    <link rel='canonical' href={$session.hostname+'/Post'} />
</svelte:head>

<main>
    <h1>All posts</h1>
    <ul>
        {#each posts.sort((a, b) => {
            return (a.firstPublished < b.firstPublished) ? 1 : -1;
        }) as post}
            <li>{post.firstPublished.substr(0, 10)}: <a href={'/Post/'+post.postId+'/'+post.title}>{post.title}</a></li>
        {/each}
    </ul>
</main>


