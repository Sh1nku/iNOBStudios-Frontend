<script>
    import { onMount } from 'svelte';

    onMount(() => {
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    });
</script>
