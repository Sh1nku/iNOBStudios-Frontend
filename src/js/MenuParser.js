export function parseMenu(menuData) {
    let menu = [];
    for (let item of JSON.parse(menuData.json)) {
        menu.push(recurse(item));
    }
    return menu;
}

function recurse(item) {
    let link = '';
    if (
        item.link != null &&
        (item.childMenuItems == undefined || item.childMenuItems == null || item.childMenuItems.length == 0)
    ) {
        link = item.link;
    }
    return {
        name: item.name,
        link: link,
        children: Array.from(item.childMenuItems, (x) => recurse(x))
    };
}
