export function getCanonicalUrl(hostname, postId, title, alias) {
    if (alias) {
        return hostname + '/' + encodeURIComponent(alias);
    }
    else {
        return hostname + '/Post/'+postId+'/'+encodeURIComponent(title);
    }
}