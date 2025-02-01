export default {
    async fetch(request) {
        const url = new URL(request.url);
        const apiKey = "833f6523050c4c6c8f37a66580af5dd8";
        const spoonacularBaseUrl = "https://api.spoonacular.com";
        let targetUrl;

        if(url.pathname.startsWith("/recipes/search")) {
            const query = url.searchParams.get("query");
            targetUrl = `${spoonacularBaseUrl}/recipes/complexSearch?apiKey=${apiKey}&query=${query}`;
        } else if (url.pathname.startsWith("/recipes/details")) {
            const recipeId = url.searchParams.get("id");
            targetUrl = `${spoonacularBaseUrl}/recipes/${recipeId}/information?apiKey=${apiKey}`;
        } else {
            return new Response("Invalid endpoint", {status: 404});
        }
        try {
            const response = await fetch(targetUrl);
            const data = await response.json();
            return new Response(JSON.stringify(data),{
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            });
        } catch (error) {
            return new Response(JSON.stringify({error: "Failed to fetch data"}),{
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            });
        }
    },
};




















