<script context="module">

</script>

<script>
	import "../global.css";
	import 'highlight.js/styles/default.css';
	import { beforeUpdate } from 'svelte';

	export let menu = [];


	menu.push({'name': 'Home', 'url': '/'})

	beforeUpdate(() => {
		if(localStorage.getItem('jwt')) {
			menu.push({'name': 'Admin', 'url': '/Admin'})
			menu.push({'name': 'Logout', 'function': logout})
		}
	})

	function logout() {
		localStorage.clear();
		menu = menu.filter((value => {
			return value.name != 'Admin' && value.name != 'Logout'
		}));
	}
</script>

<svelte:head>

</svelte:head>

<nav class='nav container'>
	{#each menu as item}
		{#if item.function}
			<a on:click={item.function} href="">{item.name}</a>
		{:else}
			<a href={item.url}>{item.name}</a>
		{/if}
	{/each}
</nav>
<header class="header container" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px">
	<img src="/banner.svg" style="width: 100%" alt='iNOBStudios logo'>
</header>
<div class="container" style="border-top-left-radius: 10px; border-top-right-radius: 10px">
	<slot />
</div>

<footer class='footer container'>
	© 2012-2021 - iNOBStudios -
</footer>

<style>
    .nav {
        padding: 1rem;
        background-color: #f8f9fa !important;
    }
    a {
        text-decoration: none;
        color: #4f4f4f;
        margin-right: 1rem;
    }

    @media (min-width: 992px) {
        .container {
            max-width: 960px;
        }
    }

    .container {
        margin-left: auto;
        margin-right: auto;
        background-color: #e9ecef;
        padding: 1rem 2rem;
    }

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
