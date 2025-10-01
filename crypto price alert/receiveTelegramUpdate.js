const BOT_TOKEN = "96074871422:htGLQdnHz0ETAQwok-ejaHyr2dfaChFG";

export default async function (req) {

  const body = await req.json();
  const messageText = body?.message?.text;
  const chatId = body?.message?.chat?.id;

  if(!chatId || !messageText) {
    return new Response("No chat ID or message",{status: 400});
  }
  let textToSend = "";

  if(messageText.startsWith("/track")) {
    const symbol = messageText.split(" ")[1];
    await fetch("https://SCTtest--80c36356709511f0ae0e0224a6c84d84.web.val.run",{
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({chatId,symbol}),
    });
    textToSend = `Now tracking ${symbol.toUpperCase()} for you`;
  } else if (messageText.startsWith("/untrack")) {
    const symbol = messageText.split(" ")[1];
    if(!symbol) {
      textToSend = "Please provide a symbol, e.g. , /untrack btc";
    } else {
      await fetch("https://SCTtest--80c36356709511f0ae0e0224a6c84d84.web.val.run",{
        method: "DELETE",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({chatId,symbol}),
      });
      textToSend = `Stopped tracking ${symbol.toUpperCase()}.`;
    }
  }
  
  else if (messageText === "/stop") {
    await fetch("https://SCTtest--80c36356709511f0ae0e0224a6c84d84.web.val.run",{
      method: "DELETE",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({chatId}),
    });
    textToSend = "Tracking stopped."
  } else {
    textToSend = "Send /track SYMBOL to start tracking or /untrack SYMBOL to stop tracking.";
  }

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      chat_id: chatId,
      text: textToSend,
    }),
  });
  return new Response("OK");
}
















