import { blob } from "https://esm.town/v/std/blob";

let userMap = new Map();

const load = async () => {
  const saved = await blob.getJSON("cryptoUsers");
  if (saved && typeof saved === "object") {
    userMap = new Map(Object.entries(saved));
  }
};

await load();

export default async function (req) {
  const method = req.method;
  const body = await req.json().catch(() => ({}));
  const chatId = String(body.chatId);
  const symbolRaw = body.symbol;
  if (!chatId) return new Response("Missing chatId", { status: 400 });
  if (method === "GET") {
    return new Response(
      JSON.stringify(
        Object.fromEntries(userMap),
      ),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  if (method === "PUT") {
    if (!symbolRaw) return new Response("Missing symbol", { status: 400 });
    const symbol = symbolRaw.toLowerCase();

    let current = userMap.get(chatId);
    if (!current) {
      current = [];
    } else if (!Array.isArray(current)) {
      current = [current.toLowerCase()];
    }
    if (!current.includes(symbol)) {
      current.push(symbol);
      userMap.set(chatId, current);
      await blob.setJSON("cryptoUsers", Object.fromEntries(userMap));
      return new Response("Tracking added");
    }
    return new Response("Already tracking this symbol");
  }
  if (method === "DELETE") {
    let current = userMap.get(chatId);
    if (!current) {
      return new Response("Nothing to remove");
    }
    if (!Array.isArray(current)) current = [current.toLowerCase()];

    const symbol = symbolRaw?.toLowerCase();
    if (!symbol) {
      userMap.delete(chatId);
    } else {
      const filtered = current.filter((s) => s != symbol);
      if (filtered.length) {
        userMap.set(chatId, filtered);
      } else {
        userMap.delete(chatId);
      }
    }
    await blob.setJSON("cryptoUsers", Object.fromEntries(userMap));
    return new Response("Tracking removed");
  }
  return new Response("Method not supported", { status: 405 });
}