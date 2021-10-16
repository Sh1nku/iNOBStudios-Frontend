<script>
	import { API_PROTOCOL, API_SERVER } from '../js/apiConfig';
	import { parseErrors } from '../js/ErrorParser';
	export let post;
	export let errors;

	function removeFile(id) {
		fetch(API_PROTOCOL + API_SERVER + '/ExternalFile/ExternalFile/' + id, {
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("jwt")
			},
			method: 'DELETE',
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

		fetch(API_PROTOCOL + API_SERVER + '/ExternalFile/ExternalFile', {
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("jwt")
			},
			method: 'POST',
			body: formData,
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
		})
	}

</script>

<h4>Attachments</h4>
{#if post.externalFiles && post.externalFiles.length > 0}
	<table class="table">
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
					<a href={API_PROTOCOL+API_SERVER+'/ExternalFile/'+file.fileName}>{file.fileName}</a>
				</td>
				<td><button on:click={() => removeFile(file.fileName)}>Delete</button>
				</td>
			</tr>
		{/each}
		</tbody>
	</table>
{:else}
	No attachments
{/if}
<hr />
<input type="file" id="file" />
<button on:click={uploadFile}>Upload</button>
