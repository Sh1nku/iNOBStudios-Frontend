import { parseMenu } from '../../js/MenuParser';
import { env } from '$lib/env';

async function get_menu(api_url, admin) {
    const res = await fetch(api_url + '/Menu/Menu/Main');
    if (res.ok) {
        const menu = parseMenu(await res.json());
        if (admin) {
            menu.push({ name: 'Admin', link: '/Admin' });
            menu.push({ name: 'Logout', link: '/Account/Logout' });
        }
        return menu;
    }
    return null;
}

function generateNavbar(menu) {
    let navbar = '';
    for (let item of menu) {
        navbar += recursiveGenerateNavbar(item);
    }
    return navbar;
}

function recursiveGenerateNavbar(item) {
    let navbar = item.link != '' ? `<li><a href='${item.link}'>${item.name}</a>` : `<li><a>${item.name}</a>`;

    if (item.children && item.children.length > 0) {
        navbar += '<ul>';
        for (let sub_item of item.children) {
            navbar += recursiveGenerateNavbar(sub_item);
        }
        navbar += '</ul>';
    }
    navbar += '</li>';
    return navbar;
}

function isQueryParameterTrue(query, parameter) {
    return query.get(parameter) && query.get(parameter) === 'true';
}

export async function get({ query }) {
    let debug = '';
    let navbar = '';
    let header = '';
    if (isQueryParameterTrue(query, 'debug')) {
        debug = `<head>
                   <link rel='stylesheet' href='${env.hostname + '/' + 'navbar.css'}'>
                  </head>`;
    }
    if (isQueryParameterTrue(query, 'header')) {
        header = `<header class='header container' style='border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;'>
                    <img alt='iNOBStudios logo' src='${env.hostname + '/' + 'banner.svg'}' style='width: 100%' />
                  </header>`;
    }
    if (isQueryParameterTrue(query, 'navbar')) {
        const menu = await get_menu(env.api_url, isQueryParameterTrue(query, 'admin'));
        if (!menu) {
            return {
                status: 500,
                body: 'Could not fetch menu'
            };
        }
        const navbar_logo = isQueryParameterTrue(query, 'navbar_logo')
            ? `<li><a style='padding: 10px' href='${env.hostname + '/'}'> <img style='height: 30px' src='${
                  env.hostname + '/' + 'banner.svg'
              }' /></a></li>`
            : '';
        navbar = `<nav style='padding: 0' class='container'>
                  <ul class='navbar-row'>
                        ${navbar_logo}
                        ${generateNavbar(menu)}
                     </ul>
                  </nav>`;
    }
    return {
        headers: {
            'Content-Type': 'text/html'
        },
        body: `
            ${debug}
            ${navbar}
            ${header}
            `
    };
}
