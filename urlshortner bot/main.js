const telegramAuthToken =`1234567890`;
const webhookEndpoint = "/endpoint";
addEventListener ("fetch",event=>{
  event.respondWith(handleIncomingRequest(event));
});

async function handleIncomingRequest(event) {
  let url = new URL(event.request.url);
  let path = url.pathname;
  let method = event.request.method;
  let workerUrl = `${url.protocol}//${url.host}`;

  if(method === "POST" && path === webhookEndpoint) {
    const update = await event.request.json();
    event.waitUntil(processUpdate(update,workerUrl));
    return new Response("Ok");
  } else if(method === "GET" && path === "/configure-webhook") {
    const url = `https://api.telegram.org/bot${telegramAuthToken}/setWebhook?url=${workerUrl}${webhookEndpoint}`;

    const response = await fetch(url);

    if(response.ok) {
      return new Response("Webhook set successfully",{status:200});
    } else {
      return new Response("Failed to set webhook",{status:response.status});
    }
  } 
  else if(method === "GET" && path.startsWith("/")) {
    const id= path.substring(1);
    const redirectUrl = await URL_List.get(id);
    if(redirectUrl) {
      return Response.redirect(redirectUrl,301);
    } else {
      return new Response("Not found",{status:404});
    }
  }
  else {
    return new Response("Not found",{status:404});
  }

}

async function processUpdate(update,workerUrl) {
  if("message" in update && "text" in update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text;
    if(text.startsWith("/shorten ")) {
      const originalUrl = text.replace("/shorten ","").trim();
      const id= await generateId();
      await URL_List.put(id,originalUrl);
      const responseText = `Shortened URL: ${generateShortUrl(id,workerUrl)}`;
      const url = `https://api.telegram.org/bot${telegramAuthToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(responseText)}`;
      await fetch(url);
    } else {
      const responseText =`Usage: /shorten <URL>`;
      const url = `https://api.telegram.org/bot${telegramAuthToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(responseText)}`;
  
      await fetch(url);
  
    }
  }
}

async function generateId() {
  let id;
  let exists;
  do{
    id=Math.random().toString(36).substring(2,8);
    exists = await URL_List.get(id);
  } while (exists);
  return id;
}
function generateShortUrl(id,workerUrl) {
  return `${workerUrl}/${id}`;
}
