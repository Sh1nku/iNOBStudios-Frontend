import { env } from '$lib/env'

export function getSession(request) {
    let auth = null;
    if(request.headers.cookie) {
        const match = request.headers.cookie.match(/jwt=([a-zA-Z0-9-_.]+)/)
        if(match) {
            auth = match[1];
        }
    }
    return {
        auth: auth,
        userAgent: request.headers['user-agent'],
        hostname: env.VITE_HOSTNAME,
        api_url: env.VITE_API_SERVER
    }
}