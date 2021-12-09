<script>
    import { API_PROTOCOL, API_SERVER } from '../js/apiConfig';
    import Errors from './Errors.svelte';
    import { parseErrors } from '../js/ErrorParser';
    import '../admin.css';

    export let item = null;
    export let indent = 0;
    export let refresh = null;
    export let menu = null;
    export let errors = null;
    export let posts = null;

    function updateItem() {
        fetch(API_PROTOCOL + API_SERVER + '/Menu/MenuItem/', {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                menuItemId: item.item.menuItemId,
                link: item.item.link !== undefined && item.item.link !== '' ? item.item.link : null,
                priority: item.item.priority,
                name: item.item.name,
                parentMenuItemId: item.item.parentMenuItemId,
                postId: item.item.postId
            }),
            method: 'PUT'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then(() => {
                        refresh();
                        errors = null;
                    });
                    break;
                case 400:
                    response.json().then((data) => {
                        errors = parseErrors(data);
                    });
                    break;
                default:
                    alert('Unknown error');
            }
        });
    }
</script>

<table class='displaytable' style='padding-left: {indent}px;'>
    <tr>
        <th>Parent</th>
        <th>Name</th>
        <th>Priority</th>
        <th>Link</th>
        <th>Post</th>
    </tr>
    <tr>
        <td>
            <select bind:value={item.item.parentMenuItemId}>
                <option value={null}>None</option>
                {#each menu.menuItems.filter((el) => {
                    return el.menuItemId !== item.item.menuItemId;
                }) as parent}
                    <option value={parent.menuItemId}>{parent.name}</option>
                {/each}
            </select>
        </td>
        <td><input bind:value={item.item.name} placeholder='None' /></td>
        <td><input bind:value={item.item.priority} placeholder='None' /></td>
        <td><input bind:value={item.item.link} placeholder='None' /></td>
        {#if posts}
            <td>
                <select bind:value={item.item.postId}>
                    <option value={null}>None</option>
                    {#each Object.values(posts) as post}
                        <option value={post.postId}>{post.currentVersion.title}</option>
                    {/each}
                </select>
            </td>
        {/if}
        <td>
            <button on:click={updateItem}>Apply</button>
        </td>
    </tr>
</table>
<Errors errors={errors} />

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    td button {
        width: 100%;
    }

    td {
        border: 1px solid;
    }

    th {
        text-align: left;
    }
</style>

{#each item.children.sort((a, b) => {
    return (a.item.priority < b.item.priority) ? 1 : -1;
}) as child}
    <svelte:self item={child} posts={posts} refresh={refresh} menu={menu} indent={indent + 24} />
{/each}
