<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import ManageAttachments from '../../../components/ManageAttachments.svelte';
    import ManageTags from '../../../components/ManageTags.svelte';
    import EditPostText from '../../../components/EditPostText.svelte';
    import { parseErrors } from '../../../js/ErrorParser';
    import { session } from '$app/stores';

    onMount(() => {
        getInitialData();
    });

    let postVersion = null;
    let post = null;
    let tags = null;
    let errors = null;

    function getInitialData() {
        fetch($session.api_url + '/Admin/Edit/' + $page.params.postVersionId, {
            headers: {
                Authorization: 'Bearer ' + $session.auth
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
    }

    function changeTitle() {
        if (postVersion.title.length > 0) {
            fetch($session.api_url + '/Post/PostVersion/', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: 'Bearer ' + $session.auth
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

    function changeAlias() {
        fetch($session.api_url + '/Post/Post/', {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: 'Bearer ' + $session.auth
            },
            body: JSON.stringify({ postId: post.postId, alias: post.alias }),
            method: 'PUT'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then(() => {
                        getInitialData();
                    });
                    break;
                case 400:
                    response.json().then((data) => {
                        errors = parseErrors(data.errors);
                    });
            }
        });
    }
</script>

<svelte:head>
    <title>Edit Post - iNOBStudios</title>
</svelte:head>

<main>
    <h1>Edit Post</h1>
    <hr />
    {#if postVersion && post}
        <div class='flex-container'>
            <div>
                <table>
                    <tr>
                        <td>Title:</td>
                        <td><input type='text' bind:value={postVersion.title} /></td>
                    </tr>
                    <tr>
                        <td colspan='2'>
                            <button on:click={changeTitle}>Update Title</button>
                        </td>
                    </tr>
                </table>
            </div>
            <div>
                <table>
                    <tr>
                        <td>Alias:</td>
                        <td><input type='text' bind:value={post.alias} placeholder='None' /></td>
                    </tr>
                    <tr>
                        <td colspan='2'>
                            <button on:click={changeAlias}>Update Alias</button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <hr />
        <div class='flex-container'>
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
