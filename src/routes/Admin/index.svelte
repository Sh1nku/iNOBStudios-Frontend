<script>
    import CreatePost from '../../components/modals/CreatePost.svelte';
    import EditPost from '../../components/modals/EditPost.svelte';
    import { onMount } from 'svelte';
    import { API_PROTOCOL, API_SERVER } from '../../js/apiConfig';
    import CreateMenu from '../../components/modals/CreateMenu.svelte';
    import '../../admin.css';
    import DeleteMenu from '../../components/modals/DeleteMenu.svelte';

    export let posts = null;
    export let menus = null;
    export let editPostVisible = null;
    export let editPostPost = null;
    export let createPostVisible = false;
    export let createMenuVisible = false;
    export let deleteMenuVisible = false;
    export let deleteMenuMenu = null;
    onMount(() => {
        fetch(API_PROTOCOL + API_SERVER + '/Admin/Posts', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            method: 'GET'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then((data) => {
                        posts = data;
                    });
                    break;
            }
        });

        fetch(API_PROTOCOL + API_SERVER + '/Admin/Menus', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            method: 'GET'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then((data) => {
                        menus = data;
                    });
                    break;
            }
        });
    });
</script>

<svelte:head>
    <title>Admin - iNOBStudios</title>
</svelte:head>

<main>
    <h1>Posts</h1>
    <hr />
    <button
        on:click={() => {
            createPostVisible = true;
        }}>Create Post
    </button
    >
    {#if posts}
        <table class='displaytable'>
            <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Published</th>
                <th>Edit</th>
            </tr>
            {#each Object.entries(posts) as [postId, post]}
                <tr>
                    <td>{post.addedTime.slice(0, 10)}</td>
                    <td>{post.currentVersion.title}</td>
                    {#if post.published}
                        <td>Published</td>
                    {:else}
                        <td>Not Published</td>
                    {/if}
                    <td>
                        <button
                            on:click={() => {
                                    editPostPost = posts[postId];
                                    editPostVisible = true;
                                }}>Edit
                        </button
                        >
                    </td>
                </tr>
            {/each}
        </table>
    {/if}
    <h1>Menus</h1>
    <hr />
    <button
        on:click={() => {
            createMenuVisible = true;
        }}>Create Menu
    </button
    >
    {#if menus}
        <table class='displaytable'>
            <tr>
                <th>Name</th>
                <th>Edit</th>
            </tr>
            {#each Object.entries(menus) as [menuName, menu]}
                <tr>
                    <td>{menuName}</td>
                    <td>
                        <button
                            on:click={() => {
                                    window.location.href = '/Admin/EditMenu/' + menuName;
                                }}>Edit
                        </button
                        >
                    </td>
                    <td>
                        <button on:click={() => {deleteMenuVisible = true; deleteMenuMenu = menus[menuName];}}>X
                        </button>
                    </td>
                </tr>
            {/each}
        </table>
    {/if}
    <CreatePost bind:posts bind:visible={createPostVisible} />
    <EditPost bind:post={editPostPost} bind:posts bind:visible={editPostVisible} />
    <CreateMenu bind:menus bind:visible={createMenuVisible} />
    <DeleteMenu bind:menu={deleteMenuMenu} bind:menus bind:visible={deleteMenuVisible} />
</main>

<style>
</style>
