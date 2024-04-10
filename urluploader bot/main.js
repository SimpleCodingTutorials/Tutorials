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
    event.waitUntil(processUpdate(update));
    return new Response("Ok");
  } else if(method === "GET" && path === "/configure-webhook") {
    const url = `https://api.telegram.org/bot${telegramAuthToken}/setWebhook?url=${workerUrl}${webhookEndpoint}`;

    const response = await fetch(url);

    if(response.ok) {
      return new Response("Webhook set successfully",{status:200});
    } else {
      return new Response("Failed to set webhook",{status:response.status});
    }
  } else {
    return new Response("Not found",{status:404});
  }

}

async function processUpdate(update) {
  if("message" in update) {
    const chatId = update.message.chat.id;
    const userText = update.message.text;
    if(isValidUrl(userText)) {
      const fileResponse = await fetch(userText);
      const fileBlob = await fileResponse.blob();
      const fileExtension = userText.split(".").pop();

      const newBlob = new Blob([fileBlob],{type: `application/${fileExtension}`});
      const formData = new FormData();
      formData.append("chat_id",chatId);
      formData.append("document",newBlob,`file.${fileExtension}`);
      const url = `https://api.telegram.org/bot${telegramAuthToken}/sendDocument`;

      await fetch(url,{
        method: "POST",
        body: formData
      });
    } else {
      const responseText = "Invalid URL!";
      const url = `https://api.telegram.org/bot${telegramAuthToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(responseText)}`;
      await fetch(url);

    }
  }
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch(_) {
    return false;
  }
}














