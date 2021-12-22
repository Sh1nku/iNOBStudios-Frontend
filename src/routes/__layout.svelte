<script context='module'>

    export const hydrate = false;
    export const router = false;

    import { parseMenu } from '../js/MenuParser';
    import '../navbar.css';

    export async function load({ fetch, session }) {
        const res = await fetch(session.api_url + '/Menu/Menu/Main');
        if (res.ok) {
            const menu = parseMenu(await res.json());
            if (session.auth) {
                menu.push({ name: 'Admin', link: '/Admin' });
                menu.push({ name: 'Logout', link: '/Account/Logout' });
            }
            return {
                props: {
                    menu: menu
                }
            };
        }
        return {
            status: res.status,
            error: new Error()
        };
    }
</script>

<script>
    import '../global.css';
    import 'highlight.js/styles/default.css';
    import Navbar from '../components/Navbar.svelte';



    export let menu;
</script>

<svelte:head />

<Navbar menu={menu} />
<header class='header container' style='border-bottom-left-radius: 10px; border-bottom-right-radius: 10px'>
    <img alt='iNOBStudios logo' src='/banner.svg' style='width: 100%' />
</header>
<div class='container' style='border-top-left-radius: 10px; border-top-right-radius: 10px'>
    <slot />
</div>

<footer class='footer container'>© 2012-2021 - iNOBStudios - <a href='/Post'>All posts</a></footer>

<style>

    .footer {
        padding-top: 0px;
        padding-bottom: 0px;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        color: #6c757d;
        background-color: #f8f9fa;
    }

    .header {
        margin-bottom: 10px;
    }
</style>
