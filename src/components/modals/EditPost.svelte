<script>
    import Modal from './Modal.svelte';
    import { parseErrors } from '../../js/ErrorParser';
    import Errors from '../Errors.svelte';
    import { session } from '$app/stores';

    export let visible;
    export let posts;
    export let post;
    export let title = '';
    export let errors = null;

    $: visible,
        () => {
            title = visible === false ? '' : title;
            post = visible == false ? null : post;
        };

    function togglePublish() {
        fetch($session.api_url + '/Post/Post', {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: 'Bearer ' + $session.auth
            },
            method: 'PUT',
            body: JSON.stringify({ postId: post.postId, published: !post.published })
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then((data) => {
                        errors = null;
                        posts[data.postId] = data;
                        post = posts[data.postId];
                    });
                    break;
                case 400:
                    response.json().then((data) => {
                        errors = parseErrors(data.errors);
                    });
            }
        });
    }

    function toggleList() {
        fetch($session.api_url + '/Post/Post', {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: 'Bearer ' + $session.auth
            },
            method: 'PUT',
            body: JSON.stringify({ postId: post.postId, list: !post.list })
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then((data) => {
                        errors = null;
                        posts[data.postId] = data;
                        post = posts[data.postId];
                    });
                    break;
                case 400:
                    response.json().then((data) => {
                        errors = parseErrors(data.errors);
                    });
            }
        });
    }

    function editVersion(postVersion) {
        window.location.href = '/Admin/EditPost/' + postVersion;
    }

    function makeCurrent(postVersionId) {
        fetch($session.api_url + '/Post/Post', {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: 'Bearer ' + $session.auth
            },
            method: 'PUT',
            body: JSON.stringify({ postId: post.postId, currentVersion: postVersionId })
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then((data) => {
                        errors = null;
                        posts[data.postId]['currentVersion'] = data['currentVersion'];
                        post = posts[data.postId];
                    });
                    break;
                case 400:
                    response.json().then((data) => {
                        errors = parseErrors(data.errors);
                    });
            }
        });
    }

    function createPostVersion() {
        fetch($session.api_url + '/Post/PostVersion', {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: 'Bearer ' + $session.auth
            },
            method: 'POST',
            body: JSON.stringify({ postId: post.postId, title: title })
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then((data) => {
                        errors = null;
                        posts[data.postId]['postVersions'][data.postVersionId] = data;
                        post = posts[data.postId];
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

<Modal bind:visible submit={togglePublish}>
    <h1>Edit post</h1>
    {#if post}
        <div>
                Status: {post.published ? "Published" : "Unpublished"}, {post.list ? "Listed" : "Unlisted"}
                <button class="btn btn-primary" on:click={togglePublish}>{post.published ? "Unpublish" : "Publish"}</button>
                <button class="btn btn-primary" on:click={toggleList}>{post.list ? "Unlist" : "List"}</button>
        </div>
        <hr />
        <Errors {errors} />
        <table style="width: 100%">
            <tr style="text-align: left">
                <th>Date</th>
                <th>Title</th>
                <th>Current</th>
                <th>Edit</th>
            </tr>
            {#each Object.entries(post.postVersions) as [postVersionId, version]}
                <tr>
                    <td>{version.postedDate.slice(0, 10)}</td>
                    <td>{version.title}</td>
                    {#if post.currentVersion.postVersionId === version.postVersionId}
                        <td>True</td>
                    {:else}
                        <td>
                            <button on:click={() => makeCurrent(version.postVersionId)}>Make Current</button>
                        </td>
                    {/if}
                    <td>
                        <button on:click={() => editVersion(version.postVersionId)}>Edit</button>
                    </td>
                </tr>
            {/each}
        </table>
        <div>
            <input type="text" bind:value={title} />
            <button class="btn btn-primary" on:click={createPostVersion}>Add Post Version</button>
        </div>
    {/if}
</Modal>
