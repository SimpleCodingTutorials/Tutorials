import {blob} from "https://esm.town/v/std/blob";

let chatIds = new Set();

const load = async () => {
  const saved = await blob.getJSON("chatIds");
  if(Array.isArray(saved)) {
    chatIds = new Set(saved);
  }
};

await load();

export default async function (req) {
  const method = req.method;

  if(method === "GET") {
    return new Response(JSON.stringify({chatIds:Array.from(chatIds)}),{
      headers: {"Content-Type": "application/json"},
    });
  }
  if(method === "PUT") {
    try {
      const body = await req.json();
      const newId = body.chatId;
      if(newId) {
        chatIds.add(newId);
        await blob.setJSON("chatIds",Array.from(chatIds));
        return new Response("Chat ID added");
      } else {
        return new Response("Missing chatId", {status: 400});
      }
    } catch {
      return new Response("Invalid JSON", {status:400});
    }
  }
  if(method === "DELETE") {
    try {
      const body = await req.json();
      const idToRemove = body.chatId;
      if(idToRemove) {
        chatIds.delete(idToRemove);
        await blob.setJSON("chatIds",Array.from(chatIds));
        return new Response("Chat ID removed");
      } else {
        return new Response("Missing chatId", {status: 400});
      }
    } catch {
       return new Response("Invalid JSON", {status:400})
    }
  }
  return new Response("Method not supported", {status: 405});
}





















