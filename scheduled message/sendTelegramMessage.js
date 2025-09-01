const BOT_TOKEN = "96074871422:htGLQdnHz0ETAQwok-ejaHyr2dfaChFG";

export default async function () {
  const response = await fetch(
    "https://sct--98fe56ryeryy634111f0a0a30226534hdfh84.web.val.run",
  );
  const {chatIds} = await response.json();
  for (const id of chatIds) {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({chat_id: id,text: "Update!"}),
      },
    );
    const data = await res.json();
  }
}























