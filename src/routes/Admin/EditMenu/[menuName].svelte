<script>
    import { onMount } from 'svelte';
    import { API_PROTOCOL, API_SERVER } from '../../../js/apiConfig';
    import { page } from '$app/stores';
    import MenuItem from '../../../components/MenuItem.svelte';

    onMount(() => {
        fetch(API_PROTOCOL + API_SERVER + '/Menu/Menu/' + $page.params.menuName + '?rawMenuItems=true', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            method: 'GET'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then((data) => {
                        menu = data;
                        structure = getMenuStructure(menu.menuItems);
                    });
                    break;
            }
        });
        fetch(API_PROTOCOL + API_SERVER + '/Admin/Posts/', {
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
    });
    let menu = null;
    let structure = null;
    let posts = null;

    function getMenuStructure(menuItems) {
        let structure = {};
        let parents = [];
        for (let item of menuItems) {
            let current = structure[item.menuItemId] ?? { item: item, children: [] };
            if (structure[item.parentMenuItemId]) {
                structure[item.parentMenuItemId]['children'].push(current);
            } else {
                parents.push(current);
                structure[item.menuItemId] = { item: item, children: [] };
            }
        }
        return structure;
    }

    function refresh() {
        structure = getMenuStructure(menu.menuItems);
    }

</script>

<svelte:head>
    <title>Edit Menu - iNOBStudios</title>
</svelte:head>

<main>
    <h1>Edit Menu</h1>
    <hr />
    {#if menu}
        {#each Object.values(structure).sort((a, b) => {
            return (a.item.priority < b.item.priority) ? 1 : -1;
        }) as item}
            <MenuItem menu={menu} posts={posts} refresh={refresh} item={item} />
        {/each}
    {/if}
</main>
