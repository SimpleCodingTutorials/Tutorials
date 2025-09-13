import {blob} from "https://esm.town/v/std/blob";

export async function sendPushNotification() {
  let pushTokens: string[] = [];
  try{
    const res = await fetch("https://sct--c04a76ea75d611f08a410224a6c84d84.web.val.run",{
      method: "GET",
    });
    if(!res.ok) throw new Error("Failed to fetch tokens");
    pushTokens = await res.json();

    if(!Array.isArray(pushTokens)) pushTokens = [];
  } catch {
    pushTokens = [];
  }
  if(pushTokens.length === 0) {
    return Response.json({status: "no_tokens"});
  }
  const messages = pushTokens.map((token)=>({
    to: token,
    title: "Hello!",
    body: "This is test notification",
    channelId: "high-priority"
  }));
  try {
    const res = await fetch("https://exp.host/--/api/v2/push/send",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(messages),
    });
    const result = await res.json();
    return Response.json(result);
  }catch(err) {
    console.error("Push error:", err);
    return Response.json({error: String(err)});
  }
}

sendPushNotification();
























