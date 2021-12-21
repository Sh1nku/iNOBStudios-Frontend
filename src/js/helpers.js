import { HOSTNAME } from './apiConfig.js';

export function getCanonicalUrl(postId, title, alias) {
    if (alias) {
        return HOSTNAME + '/' + encodeURIComponent(alias);
    }
    else {
        return HOSTNAME + '/Post/'+postId+'/'+encodeURIComponent(title);
    }
}