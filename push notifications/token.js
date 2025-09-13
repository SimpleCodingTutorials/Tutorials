import {blob} from "https://esm.town/v/std/blob";

let pushTokens = new Set();

const load = async () => {
  const saved = await blob.getJSON("pushTokens");
  if(Array.isArray(saved)) {
    pushTokens = new Set(saved);
  }
};

await load();


export default async function(req) {
  const method = req.method;
  if(method === "GET") {
    return new Response(JSON.stringify(Array.from(pushTokens)),{
      headers: {"Content-Type": "application/json"},
    });
  }
  if(method === "POST") {
    try {
      const body = await req.json();
      const expoPushToken = body.expoPushToken;

      if(expoPushToken) {
        pushTokens.add(expoPushToken);
        await blob.setJSON("pushTokens",Array.from(pushTokens));
        return new Response("Token stored");
      } else {
        return new Response("Missing token", {status: 400});
      }
    } catch {
      return new Response("Invalid JSON", {status: 400});
    }
  }
  return new Response("Method not supported", {status: 405});

}


























