const BOT_TOKEN = "96074871422:htGLQdnHz0ETAQwok-ejaHyr2dfaChFG";
const API = "https://api.coingecko.com/api/v3/simple/price";

const symbolToId = {
  btc: "bitcoin",
  eth: "ethereum",
  doge: "dogecoin",
  sol: "solana",
  ada: "cardano",
  xrp: "ripple",
  dot: "polkadot",
  ltc: "litecoin",
};
const lastPrices = new Map();

export default async function () {
  const response = await fetch(
    "https://SCTtest--80c36356709511f0ae0e0224a6c84d84.web.val.run",
  );
  const users = await response.json();
  for (const [chatId, symbols] of Object.entries(users)) {
    for (const symbol of symbols) {
      const symbolId = symbolToId[symbol.toLowerCase()];
      if (!symbolId) continue;
      try {
        const url = `${API}?ids=${symbolId}&vs_currencies=usd`;
        const priceRes = await fetch(url);
        const data = await priceRes.json();
        const price = data[symbolId]?.usd;
        if (!price) continue;

        const last = lastPrices.get(`${chatId}=${symbol}`) || price;
        const change = ((price - last) / last) * 100;

        if (Math.abs(change) >= 0) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: `${symbol.toUpperCase()} moved ${
                change.toFixed(2)
              }%: $${price}`,
            }),
          });
          lastPrices.set(`${chatId}-${symbol}`, price);
        }
      } catch (err) {
        console.log("Error fetching price for", symbol, err.message);
      }
    }
  }
}








//7507475327:AAGLQjnVNc0ETsAso9h-eHiJgk1uhq3DaDE























