const telegramAuthToken = `1234567890`;
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
    
    let source_lang = "en";
    let target_lang = "de";
    let textToTranslate = userText;

    const commandMatch = userText.match(/^\/translate (\w{2}) (\w{2}) (.+)/);
    if(commandMatch) {
      source_lang = commandMatch[1];
      target_lang = commandMatch[2];
      textToTranslate = commandMatch[3]
    } else {
      source_lang = "en";
      target_lang = "en";
      textToTranslate =`Invalid command format. Correct format: /translate <source_lang> <target_lang> <text>`;
    }
    const translationRequest = new Request("https://url",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text:textToTranslate,source_lang,target_lang})
    });
    try{
      const apiResponse = await translator.fetch(translationRequest);
      const {translatedText} = await apiResponse.json();
      const url = `https://api.telegram.org/bot${telegramAuthToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(translatedText)}`;
      await fetch(url);


    } catch(error) {
      const errorMsg = `Translation failed: ${error.message}`;
      const url = `https://api.telegram.org/bot${telegramAuthToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(errorMsg)}`;
      await fetch(url);
    }
  }
}

