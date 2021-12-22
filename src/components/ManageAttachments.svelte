<script>
    import { parseErrors } from '../js/ErrorParser';
    import { session } from '$app/stores';

    export let post;
    export let errors;

    function removeFile(id) {
        fetch($session.api_url + '/ExternalFile/ExternalFile/' + id, {
            headers: {
                Authorization: 'Bearer ' + $session.auth
            },
            method: 'DELETE'
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.text().then(() => {
                        post.externalFiles = post.externalFiles.filter(function(obj) {
                            return obj.fileName !== id;
                        });
                    });
                    break;
                case 400:
                    response.json().then((data) => {
                        errors = parseErrors(data.errors);
                    });
            }
        });
    }

    function uploadFile() {
        let formData = new FormData();
        formData.append('rawFile', document.getElementById('file').files[0]);
        formData.append('postId', post.postId);

        fetch($session.api_url + '/ExternalFile/ExternalFile', {
            headers: {
                Authorization: 'Bearer ' + $session.auth
            },
            method: 'POST',
            body: formData
        }).then((response) => {
            switch (response.status) {
                case 200:
                    response.json().then((data) => {
                        post.externalFiles.push(data);
                        post.externalFiles = post.externalFiles;
                        document.getElementById('file').value = null;
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

<h4>Attachments</h4>
{#if post.externalFiles && post.externalFiles.length > 0}
    <table class='table'>
        <thead>
        <tr>
            <th>Link</th>
            <th>Manage</th>
        </tr>
        </thead>
        <tbody>
        {#each post.externalFiles as file}
            <tr>
                <td>
                    <a href={$session.api_url + '/ExternalFile/' + file.fileName}>{file.fileName}</a>
                </td>
                <td>
                    <button on:click={() => removeFile(file.fileName)}>Delete</button>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
{:else}
    No attachments
{/if}
<hr />
<input id='file' type='file' />
<button on:click={uploadFile}>Upload</button>
