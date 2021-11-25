<script>
	import Modal from './Modal.svelte';
	import { API_PROTOCOL, API_SERVER } from '../../js/apiConfig';
	import { parseErrors } from '../../js/ErrorParser';
	import Errors from '../Errors.svelte';
	export let visible;
	export let menus;
	export let name = '';
	export let errors = null;

	$: visible, name = '';

	function submit() {
		fetch(API_PROTOCOL + API_SERVER + '/Menu/Menu', {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": "Bearer " + localStorage.getItem("jwt")
			},
			method: 'POST',
			body: '{"name": "'+name+'"}'
		}).then((response) => {
			switch (response.status) {
				case 200:
					response.json().then((data) => {
						errors = null;
						menus[data.name] = data;
						visible = false;
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
<Modal bind:visible={visible} submit={submit}>
	<h1>Create Menu</h1>
	<p>Create a new menu</p>
	<hr />
	<table>
		<tbody>
			<tr>
				<td>Name</td>
				<input bind:value={name}>
			</tr>
		</tbody>
	</table>
	<Errors errors={errors}/>
</Modal>
