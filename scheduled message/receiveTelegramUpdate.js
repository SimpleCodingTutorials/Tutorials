const BOT_TOKEN = "96074871422:htGLQdnHz0ETAQwok-ejaHyr2dfaChFG";

export default async function (req) {
  let body = {};
  try {
    body = await req.json();
  } catch (err) {
    console.log("No JSON body");
    return new Response("Bad request", {status: 400});
  }

  const messageText = body?.message?.text;
  const chatId = body?.message?.chat?.id;

  if(!chatId || !messageText) {
    return new Response("No chat ID or message",{status: 400});
  }
  let textToSend = "";
  textToSend = messageText;
  if(messageText === "/start") {
    await fetch("https://sct--98fe56ryeryy634111f0a0a30226534hdfh84.web.val.run",{
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({chatId}),
    });
    textToSend = "You are now subscribed to updates.";
  } else if (messageText === "/stop") {
    await fetch("https://sct--98fe56ryeryy634111f0a0a30226534hdfh84.web.val.run",{
      method: "DELETE",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({chatId}),
    });
    textToSend = "You have been unsubscribed from updates."
  } else {
    textToSend = "Send /start to subscribe or /stop to unsubscribe.";
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
















