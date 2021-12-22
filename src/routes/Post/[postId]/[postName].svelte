<script context='module'>
    import Post from '../../../components/Post.svelte';

    export const hydrate = false;
    export const router = false;

    export async function load({ page, fetch, session }) {
        const res = await fetch(session.api_url + '/Post/Post/' + page.params.postId + '/' + page.params.postName);
        if (res.ok) {
            const post = await res.json();

            return {
                props: {
                    post: post,
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
    import { getCanonicalUrl } from '../../../js/helpers.js';
    import { session } from '$app/stores';

    export let post;
</script>

<svelte:head>
    <title>{post.currentVersion.title} - iNOBStudios</title>
    <link rel='canonical' href={getCanonicalUrl($session.hostname, post.postId, post.currentVersion.title, post.alias)} />
</svelte:head>

<Post post={post} />


