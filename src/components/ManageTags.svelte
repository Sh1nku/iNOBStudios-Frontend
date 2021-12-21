<script>
    import { parseErrors } from '../js/ErrorParser';
    import Errors from './Errors.svelte';
    import { session } from '$app/stores';

    export let post;
    export let tags;
    let selectedTag = null;
    let newTag = '';
    let errors = null;

    function deletePostTag(tag) {
        if (tag) {
            fetch($session.api_url + '/Post/Post/', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: 'Bearer ' + $session.auth
                },
                body: JSON.stringify({
                    postId: post.postId,
                    postTags: post.postTags.filter((el) => {
                        return el != tag;
                    })
                }),
                method: 'PUT'
            }).then((response) => {
                switch (response.status) {
                    case 200:
                        response.json().then((data) => {
                            post = data;
                            selectedTag = null;
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

    function addPostTag() {
        if (selectedTag) {
            fetch($session.api_url + '/Post/Post/', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: 'Bearer ' + $session.auth
                },
                body: JSON.stringify({ postId: post.postId, postTags: post.postTags.concat([selectedTag]) }),
                method: 'PUT'
            }).then((response) => {
                switch (response.status) {
                    case 200:
                        response.json().then((data) => {
                            post = data;
                            selectedTag = null;
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

    function createTag() {
        if (newTag.length > 0) {
            fetch($session.api_url + '/Tag/Tag/', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: 'Bearer ' + $session.auth
                },
                body: JSON.stringify({ name: newTag }),
                method: 'POST'
            }).then((response) => {
                switch (response.status) {
                    case 200:
                        response.text().then((data) => {
                            tags.push(data);
                            tags = tags;
                            newTag = '';
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

<h4>Tags</h4>
<Errors {errors} />
{#if post.postTags && post.postTags.length > 0}
    <ul>
        {#each post.postTags as tag}
            <li>
                {tag}
                <button on:click={() => deletePostTag(tag)}>Delete</button>
            </li>
        {/each}
    </ul>
{:else}
    <p>No tags</p>
{/if}
<hr />
<select bind:value={selectedTag}>
    {#each tags.filter((el) => {
        return !post.postTags.includes(el);
    }) as tag}
        <option value={tag}>{tag}</option>
    {/each}
</select>
<button on:click={addPostTag}>Add tag to post</button>
<br />
<input bind:value={newTag} type="text" />
<button on:click={createTag}>Create Tag</button>
