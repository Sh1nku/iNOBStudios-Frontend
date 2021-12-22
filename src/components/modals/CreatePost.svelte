<script>
    import Modal from './Modal.svelte';
    import { parseErrors } from '../../js/ErrorParser';
    import Errors from '../Errors.svelte';
    import { session } from '$app/stores';

    export let visible;
    export let posts;
    export let name = '';
    export let errors = null;

    $: visible, (name = '');

    function submit() {
        fetch($session.api_url + '/Post/Post', {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: 'Bearer ' + $session.auth
            },
            method: 'POST',
            body: '{"title": "' + name + '"}'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then((data) => {
                        errors = null;
                        posts[data.postId] = data;
                        visible = false;
                    });
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
    <h1>Create Post</h1>
    <p>Create a new post</p>
    <hr />
    <table>
        <tbody>
            <tr>
                <td>Name</td>
                <input bind:value={name} />
            </tr>
        </tbody>
    </table>
    <Errors {errors} />
</Modal>
