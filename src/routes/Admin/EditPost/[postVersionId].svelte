<script>
    import { onMount } from 'svelte';
    import { API_PROTOCOL, API_SERVER } from '../../../js/apiConfig';
    import { page } from '$app/stores';
    import ManageAttachments from '../../../components/ManageAttachments.svelte';
    import ManageTags from '../../../components/ManageTags.svelte';
    import EditPostText from '../../../components/EditPostText.svelte';
    import { parseErrors } from '../../../js/ErrorParser';

    onMount(() => {
        fetch(API_PROTOCOL + API_SERVER + '/Admin/Edit/' + $page.params.postVersionId, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            method: 'GET'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then((data) => {
                        postVersion = data['postVersion'];
                        post = data['post'];
                        tags = data['tags'];
                    });
                    break;
            }
        });
    });

    let postVersion = null;
    let post = null;
    let tags = null;
    let errors = null;

    function changeTitle() {
        if (postVersion.title.length > 0) {
            fetch(API_PROTOCOL + API_SERVER + '/Post/PostVersion/', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: 'Bearer ' + localStorage.getItem('jwt')
                },
                body: JSON.stringify({ postVersionId: postVersion.postVersionId, title: postVersion.title }),
                method: 'PUT'
            }).then((response) => {
                switch (response.status) {
                    case 200:
                        response.json().then((data) => {
                            postVersion = data;
                        });
                        break;
                    case 400:
                        response.json().then((data) => {
                            errors = parseErrors(data.errors);
                        });
                }
            });
        }
    }
</script>

<svelte:head>
    <title>Edit Post - iNOBStudios</title>
</svelte:head>

<main>
    <h1>Edit Post</h1>
    <hr />
    {#if postVersion && post}
        <table>
            <tr>
                <td>Title:</td>
                <td><input type="text" bind:value={postVersion.title} /></td>
            </tr>
            <tr>
                <td colspan="2">
                    <button on:click={changeTitle}>Update Title</button>
                </td>
            </tr>
        </table>
        <hr />
        <div class="flex-container">
            <div>
                <ManageAttachments bind:errors {post} />
            </div>
            <div>
                <ManageTags {post} {tags} />
            </div>
        </div>
        <EditPostText {postVersion} />
    {/if}
</main>

<style>
    .flex-container {
        display: flex;
        flex-flow: row wrap;
    }

    .flex-container > div {
        flex: 40%;
        padding: 2%;
    }
</style>
