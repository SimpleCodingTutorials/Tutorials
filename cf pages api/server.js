//https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/c884b49e-7c2c-4a98-8d4e-96abaa72c21c

//21e642cf.cloudflare-pages-api.pages.dev
export default {
    async fetch(request, env) {
        try {
            const { method, headers } = request;
            const contentType = headers.get('content-type') || '';

            if (method === 'OPTIONS') {
                return new Response(null, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': '*',
                    },
                    status: 200
                });
            }

            if (method === 'GET') {
                const responseBody = 'This is a GET request response.';
                return new Response(responseBody, {
                    headers: {
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*',
                    },
                    status: 200
                });
            }

            if (method === 'POST') {
                const data = await request.text();
                const responseBody = 'This is a POST request response.';
                return new Response(responseBody, {
                    headers: {
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*',
                    },
                    status: 200
                });
            }

            const errorResponse = new Response(`Method ${method} Not Allowed`, {
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                },
                status: 405
            });
            return errorResponse;
        } catch (error) {
            return new Response(`Error: ${error.message}`, {
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                },
                status: 500
            });
        }
    },
};
