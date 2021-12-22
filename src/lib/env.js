export const env = {
    api_url: process.env['VITE_API_SERVER'] ?? import.meta.env.VITE_API_SERVER,
    hostname: process.env['VITE_HOSTNAME'] ?? import.meta.env.VITE_HOSTNAME
}