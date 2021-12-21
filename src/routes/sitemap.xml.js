import { API_PROTOCOL, API_SERVER, HOSTNAME } from '../js/apiConfig.js';
import { getCanonicalUrl } from '../js/helpers.js';

function createXMLEntry(post) {
    return `
<url>
    <loc>${getCanonicalUrl(post.postId, post.title, post.alias)}</loc>
    <lastmod>${post.lastUpdated.substr(0, 10)}</lastmod>
</url>`
}

export async function get({ host }) {
    const res = await fetch(API_PROTOCOL + API_SERVER + '/Post/SitemapPosts');
    if (res.ok) {
        let xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
    <loc>${HOSTNAME+'/'}</loc>
</url>
<url>
    <loc>${HOSTNAME+'/Post'}</loc>
</url>\n`;
        for(const post of await res.json()) {
            xml += createXMLEntry(post, host);
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