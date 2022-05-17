<script context='module'>
    export const hydrate = false;
    export const router = false;
    import Post from '../components/Post.svelte';

    export async function load({ page, fetch, session }) {
        const res = await fetch(session.api_url + '/Post/Post/' + page.params.alias);
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
    import { session } from '$app/stores';

    export let post;
</script>

<svelte:head>
    <title>{post.currentVersion.title} - iNOBStudios</title>
    <link href={getCanonicalUrl($session.hostname, post.postId, post.currentVersion.title, post.alias)}
          rel='canonical' />
</svelte:head>

<Post post={post} />
