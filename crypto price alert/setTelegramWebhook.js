export async function setTelegramWebhook() {
    const token = "96074871422:htGLQdnHz0ETAQwok-ejaHyr2dfaChFG";
    const webhookUrl = "https://sct--59fe56346d8111f0a0a30224a6c84d84.web.val.run";

    const res = await fetch(
        `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`,
    );
    const result = await res.json();
    console.log(result);
}
setTelegramWebhook();






















  const token = "96074871422:htGLQdnHz0ETAQwok-ejaHyr2dfaChFG";

