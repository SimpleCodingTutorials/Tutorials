export default {
  async fetch(request, env) {
    try{
    const {text,source_lang="en",target_lang="de"} = await request.json();
    if(!text) return new Response("Text is required",{status:400});
    const aiResponse = await env.AI.run('@cf/meta/m2m100-1.2b', {text,source_lang,target_lang});
    if(!aiResponse.translated_text) {
      return new Response("Translation failed", {status:500});
    }
    return new Response(JSON.stringify({translatedText:aiResponse.translated_text}),{
      headers: {"Content-type":"application/json"},
    });
  } catch (error) {
    return new Response(`Error:${error.message}`,{status:400});
  }
  }
};

