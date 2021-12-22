import { getCanonicalUrl } from '../js/helpers.js';
import { env } from '$lib/env.js';

function createXMLEntry(post, hostname) {
    return `
<url>
    <loc>${getCanonicalUrl(hostname, post.postId, post.title, post.alias)}</loc>
    <lastmod>${post.lastUpdated.substr(0, 10)}</lastmod>
</url>`
}

export async function get({}) {
    const res = await fetch(env.api_url + '/Post/SitemapPosts');
    if (res.ok) {
        let xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
    <loc>${env.hostname}</loc>
</url>
<url>
    <loc>${env.hostname+'/Post'}</loc>
</url>\n`;
        for(const post of await res.json()) {
            xml += createXMLEntry(post, env.hostname);
        }
        xml += '</urlset>';
        return {
            headers: {
                'Content-Type': 'application/xml'
            },
            body: xml
        };
    }
}