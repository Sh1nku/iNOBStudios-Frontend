<script context='module'>
    export const hydrate = false;
    export const router = false;
    import Post from '../components/Post.svelte';
    import { API_PROTOCOL, API_SERVER } from '../js/apiConfig';

    export async function load({ page, fetch }) {
        const res = await fetch(API_PROTOCOL + API_SERVER + '/Post/Post/' + page.params.alias);
        if (res.ok) {
            const post = await res.json();

            return {
                props: {
                    post: post
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
    import { getCanonicalUrl } from '../js/helpers';

    export let post;
</script>

<svelte:head>
    <title>{post.currentVersion.title} - iNOBStudios</title>
    <link rel='canonical' href={getCanonicalUrl(post.postId, post.currentVersion.title, post.alias)} />
</svelte:head>

<Post post={post} />
