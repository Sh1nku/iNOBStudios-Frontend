<script>
    export let errors;
</script>

{#if errors}
    <ul>
        {#each errors as error}
            <li style="color: red">{error}</li>
        {/each}
    </ul>
{/if}
