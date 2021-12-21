<script context="module">
    export const hydrate = false;
    export const router = false;

    export async function load({ page, fetch, session }) {
        const tag = page.query.get('tag') ? '?tag=' + page.query.get('tag') : '';
        const res = await fetch(session.api_url + '/Post/Posts' + tag);

        if (res.ok)
            return {
                props: {
                    data: await res.json()
                }
            };
        return {
            status: res.status,
            error: new Error()
        };
    }
</script>

<script>
    import PostPreview from '../components/PostPreview.svelte';
    import { session } from '$app/stores';

    export let data;
</script>

<svelte:head>
    <title>Home - iNOBStudios</title>
    <link rel='canonical' href={$session.hostname} />
</svelte:head>

<main>
    {#each data.posts as post}
        <PostPreview {post} />
    {/each}
</main>
