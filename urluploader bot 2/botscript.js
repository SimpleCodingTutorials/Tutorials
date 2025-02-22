const telegramAuthToken = `7743994456:AAG3jNy_ztYJznRPPpVSSFKpnLwiX9dm0sE`;
const webhookEndpoint = "/endpoint";
const nodeServerUrl = "https://927bf4ae-7244-4a0d-b913-125438b204cb-00-1j333k7sj7lis.spock.replit.dev";
addEventListener("fetch", event => {
  event.respondWith(handleIncomingRequest(event));
});

async function handleIncomingRequest(event) {
  let url = new URL(event.request.url);
  let path = url.pathname;
  let method = event.request.method;
  let workerUrl = `${url.protocol}//${url.host}`;

  if (method === "POST" && path === webhookEndpoint) {
    const update = await event.request.json();
    event.waitUntil(processUpdate(update));
    return new Response("Ok");
  } else if (method === "GET" && path === "/configure-webhook") {
    const url = `https://api.telegram.org/bot${telegramAuthToken}/setWebhook?url=${workerUrl}${webhookEndpoint}`;
    const response = await fetch(url);

    if (response.ok) {
      return new Response("Webhook set successfully", { status: 200 });
    } else {
      return new Response("Failed to set webhook", { status: response.status });
    }
  } else {
    return new Response("Not found", { status: 404 });
  }
}

async function processUpdate(update) {
  if("message" in update) {
    const chatId = update.message.chat.id;
    const userText = update.message.text;
    if(isValidUrl(userText)) {
      try{
        const response = await fetch(`${nodeServerUrl}/uploads`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-with": "XMLHttpRequest"
          },
          body: JSON.stringify({fileUrl: userText})
        });
      } catch (error) {
        const responseText = `Error uploading file: ${error.message}`;
        await sendMessageToBot(chatId,responseText);
      }
    }  else if (!(update.message.document || update.message.text.startsWith("Uploading file") || update.message.text.startsWith("Downloading file"))){
      const responseText = "Invalid URL!";
      await sendMessageToBot(chatId,responseText);
    }
  }
}
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

async function sendMessageToBot(chatId,message) {
  const url = `https://api.telegram.org/bot${telegramAuthToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
  await fetch(url);
}














