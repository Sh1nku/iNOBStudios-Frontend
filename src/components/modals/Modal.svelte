<script>
    export let visible;
    export let submit;

    function toggleSelf(event) {
        if (event.currentTarget == event.target) {
            visible = false;
        }
    }
</script>

{#if visible}
    <div class="backgroundStyle" on:mousedown={toggleSelf}>
        <div class="modalStyle">
            <span class="closeStyle" on:click={() => (visible = false)}>&times;</span>
            <slot />
            <button type="button" class="btn btn-primary" on:click={submit}>Submit</button>
            <button type="button" class="btn btn-primary" on:click={() => (visible = false)}>Cancel</button>
        </div>
    </div>
{/if}

<style>
    .backgroundStyle {
        z-index: 5;
        display: block;
        position: fixed;
        padding-top: 100px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .modalStyle {
        background-color: #fefefe;
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
    }

    .closeStyle {
        color: #aaaaaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }
</style>
