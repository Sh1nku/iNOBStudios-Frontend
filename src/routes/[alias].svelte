<script context='module'>
    import Post from '../components/Post.svelte';
    import { API_PROTOCOL, API_SERVER } from '../js/apiConfig';

    export async function load({ page, fetch }) {
        const res = await fetch(API_PROTOCOL + API_SERVER + '/Post/Post/' + page.params.alias);
        console.log(API_PROTOCOL + API_SERVER + '/Post/Post/' + page.params.alias);
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

    export let post;
</script>

<svelte:head>
    <title>{post.currentVersion.title} - iNOBStudios</title>
</svelte:head>

<Post post={post} />
