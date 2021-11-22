export function parseMenu(menuData) {
	let menu = [];
	for(let item of JSON.parse(menuData.json)) {
		menu.push(recurse(item));
	}
	return menu;
}

function recurse(item) {
	return {
		'name': item.name,
		'url': '/',
		'children': Array.from(item.childMenuItems, x => recurse(x))
	}
}
