<script context='module'>

    export const hydrate = false;
    export const router = false;
    import '../../static/navbar.css';

    export async function load({ fetch, session }) {
        let admin = '';
        if (session.auth) {
            admin = '&admin=true';
        }
        const res = await fetch(session.hostname + '/External/header.html?navbar=true&header=true' + admin);
        if (res.ok) {
            return {
                props: {
                    navbar: await res.text()
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

    export let navbar;
</script>

<svelte:head />

{@html navbar}
<div class='container' style='border-top-left-radius: 10px; border-top-right-radius: 10px'>
    <slot />
</div>

<footer class='footer container'>
    © 2012-2021 - iNOBStudios - <a href='/Post'>All posts</a> <a href='/rss'>RSS</a>
</footer>

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
