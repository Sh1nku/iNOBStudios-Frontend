<script>
    import Modal from './Modal.svelte';
    import { parseErrors } from '../../js/ErrorParser';
    import Errors from '../Errors.svelte';
    import { session } from '$app/stores';

    export let visible;
    export let menus;
    export let menu;
    export let errors = null;

    function submit() {
        fetch($session.api_url + '/Menu/Menu/' + menu.name, {
            headers: {
                Authorization: 'Bearer ' + $session.auth
            },
            method: 'DELETE'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    delete menus[menu.name];
                    menus = menus;
                    visible = false;
                    menu = null;
                    break;
                case 400:
                    response.json().then((data) => {
                        errors = parseErrors(data.errors);
                    });
            }
        });
    }
</script>

<Modal bind:visible {submit}>
    <h1>Delete Menu</h1>
    <p>Are you sure you want to delete <b>{menu.name}</b></p>
    <hr />
    <Errors {errors} />
</Modal>
