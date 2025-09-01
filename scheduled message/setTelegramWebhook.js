export async function setTelegramWebhook() {
    const token = "96074871422:htGLQdnHz0ETAQwok-ejaHyr2dfaChFG";
    const webhookUrl = "https://sct--98fe56ryeryy634111f0a0a30226534hdfh84.web.val.run";

    const res = await fetch(
        `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`,
    );
    const result = await res.json();
    console.log(result);
}
setTelegramWebhook();






















  const token = "96074871422:htGLQdnHz0ETAQwok-ejaHyr2dfaChFG";

