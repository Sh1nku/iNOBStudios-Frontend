import { getCanonicalUrl } from '../js/helpers.js';
import { env } from '$lib/env.js';
import { parsePost } from '../js/PostParser';

function createXMLEntry(post, hostname, api_url) {
    return `
    <entry>
        <title>${post.firstPublished}</title>
        <link href='${getCanonicalUrl(hostname, post.postId, post.currentVersion.title, post.alias)}'/>
        <id>${getCanonicalUrl(hostname, post.postId, post.currentVersion.title, post.alias)}</id>
        <updated>${new Date(post.firstPublished).toISOString()}</updated>
        <summary type='html'>
            ${parsePost(api_url, post.currentVersion.previewText)['text']}
        </summary>
    </entry>`;
}

export async function get({}) {
    const res = await fetch(env.api_url + '/Post/Posts?offset=0&limit=10');
    if (res.ok) {
        const posts = (await res.json()).posts;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <id>${env.hostname}</id>
    <title>iNOBStudios.com</title>
    <link href="${env.hostname}"/>
    <updated>${posts ? new Date(posts[0].firstPublished).toISOString() : '0000-00-00T00:00:00Z'}</updated>
    <icon>${env.hostname}/favicon.png</icon>
    
    ${posts
        .map(function (post) {
            return createXMLEntry(post, env.hostname, env.api_url);
        })
        .join('\n')}
    
</feed>`;
        return {
            headers: {
                'Content-Type': 'application/atom+xml; charset=utf-8'
            },
            body: xml
        };
    }
}
