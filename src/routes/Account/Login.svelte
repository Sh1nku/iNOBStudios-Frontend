<script>
    import { API_PROTOCOL, API_SERVER } from '../../js/apiConfig';
    import { onMount } from 'svelte';
    import { parseErrors } from '../../js/ErrorParser';

    export let username;
    export let password;
    export let errors = null;

    export function login() {
        let json = '{ "username" : "' + username + '", "password" : "' + password + '" }';

        fetch(API_PROTOCOL + API_SERVER + '/Account/Login', {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            method: 'POST',
            body: json
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.text().then((data) => {
                        localStorage.setItem('jwt', data);
                        window.location.href = '/';
                    });
                    break;
                case 404:
                    errors = ['User not found'];
                    break;
                case 403:
                    errors = ['Wrong password'];
                    break;
                case 400:
                    response.json().then((data) => {
                        errors = parseErrors(data.errors);
                    });
            }
        });
    }

    export function checkEnter(e) {
        if (e.keyCode === 13) {
            login();
        }
    }

    onMount(() => {
        localStorage.clear();
    });
</script>

<svelte:head>
    <title>Login - iNOBStudios</title>
</svelte:head>

<main>
    <h1>Log in</h1>
    <h4>Use a local account to log in.</h4>
    <hr />
    {#if errors}
        <ul>
            {#each errors as error}
                <li style='color: red'>{error}</li>
            {/each}
        </ul>
    {/if}
    <table>
        <tbody>
        <tr>
            <td><label>Username</label></td>
            <td><input bind:value={username} id='username' on:keypress={checkEnter} /></td>
        </tr>
        <tr>
            <td><label>Password</label></td>
            <td><input bind:value={password} id='password' on:keypress={checkEnter} type='password' /></td>
        </tr>
        <tr>
            <td>
                <button id='button' on:click={login}>Log in</button>
            </td>
        </tr>
        </tbody>
    </table>
    <div />
</main>
