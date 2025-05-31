function handleCredentialResponse(response) {
    const idToken = response.credential;
    const userInfo = parseJwt(idToken);
    localStorage.setItem("user",JSON.stringify(userInfo));
    window.location.href = "/profile.html";
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = decodeURIComponent(atob(base64Url).split("").map(c=>"%"+("00"+c.charCodeAt(0).toString(16)).slice(-2)).join(""));
  return JSON.parse(base64);
}




























