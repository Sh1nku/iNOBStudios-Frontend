<script>
    import { API_PROTOCOL, API_SERVER } from '../js/apiConfig';
    import Errors from './Errors.svelte';
    import { parseErrors } from '../js/ErrorParser';
    import '../admin.css';
    import { onMount } from 'svelte';

    export let item = null;
    export let indent = 0;
    export let refresh = null;
    export let menu = null;
    export let errors = null;
    export let posts = null;

    onMount(() => {
        if (item == null) {
            resetItem();
        }
    });

    function resetItem() {
        item = {
            children: [],
            item: {
                priority: 500,
                name: ''
            }
        };
    }

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

    function createItem() {
        fetch(API_PROTOCOL + API_SERVER + '/Menu/MenuItem/', {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                link: item.item.link !== undefined && item.item.link !== '' ? item.item.link : null,
                priority: item.item.priority,
                name: item.item.name,
                parentMenuItemId: item.item.parentMenuItemId,
                postId: item.item.postId,
                parentMenuName: menu.name
            }),
            method: 'POST'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then(() => {
                        refresh();
                        errors = null;
                        resetItem();
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

    function deleteItem(id) {
        fetch(API_PROTOCOL + API_SERVER + '/Menu/MenuItem/' + id, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            method: 'DELETE'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    errors = null;
                    refresh();
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
{#if item}

    <table class='displaytable' style='padding-left: {indent}px;'>
        <tr>
            <th>Name</th>
            <th>Parent</th>
            <th>Priority</th>
            <th>Link</th>
            <th>Post</th>
        </tr>
        <tr>
            <td><input bind:value={item.item.name} placeholder='None' /></td>
            <td style='width: 100px'>
                <select bind:value={item.item.parentMenuItemId}>
                    <option value={undefined}>None</option>
                    {#each menu.menuItems.filter((el) => {
                        return el.menuItemId !== item.item.menuItemId;
                    }) as parent}
                        <option value={parent.menuItemId}>{parent.name}</option>
                    {/each}
                </select>
            </td>
            <td style='width: 40px'><input bind:value={item.item.priority} placeholder='None' /></td>
            <td><input bind:value={item.item.link} placeholder='None' /></td>
            {#if posts}
                <td>
                    <select bind:value={item.item.postId}>
                        <option value={undefined}>None</option>
                        {#each Object.values(posts) as post}
                            <option value={post.postId}>{post.currentVersion.title}</option>
                        {/each}
                    </select>
                </td>
            {/if}
            {#if item.item.menuItemId !== undefined}
                <td>
                    <button on:click={updateItem}>Apply</button>
                </td>
                <td>
                    <button on:click={() => deleteItem(item.item.menuItemId)}>X</button>
                </td>
            {:else}
                <td>
                    <button on:click={createItem}>Create</button>
                </td>
            {/if}
        </tr>
    </table>

    <Errors errors={errors} />

    {#each item.children.sort((a, b) => {
        return (a.item.priority < b.item.priority) ? 1 : -1;
    }) as child}
        <svelte:self item={child} posts={posts} refresh={refresh} menu={menu} indent={indent + 24} />
    {/each}
{/if}
