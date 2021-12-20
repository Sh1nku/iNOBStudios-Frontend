<script>
    export let menu;

    function generateNavbar() {
        let navbar = '';
        for (let item of menu) {
            navbar += recursiveGenerateNavbar(item);
        }
        return navbar;
    }

    function recursiveGenerateNavbar(item) {
        let navbar = item.link != '' ?
          `<li><a href='${item.link}'>${item.name}</a>` :
          `<li><a>${item.name}</a>`;

        if (item.children && item.children.length > 0) {
            navbar += '<ul>';
            for (let sub_item of item.children) {
                navbar += recursiveGenerateNavbar(sub_item);
            }
            navbar += '</ul>';
        }
        navbar += '</li>';
        return navbar;
    }
</script>

<nav class='container'>
    {#if menu}
        <ul class='navbar-row'>
            {@html generateNavbar()}
        </ul>
    {/if}
</nav>

<style>
    .container {
        padding: 0;
    }

</style>
