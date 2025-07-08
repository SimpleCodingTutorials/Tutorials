let tokenClient;
let accessToken = null;

function gsiInit() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: "52677784884-87658h6utyutiyi7asad1tjpf5wf3t5abbnj.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/drive",
    callback: (response) => {
      if(response.error) {
        console.error("Token error:", response);
        return;
      }
      accessToken = response.access_token;
      console.log("Access token:", accessToken);
      localStorage.setItem("accessToken",accessToken);
      window.location.href = "/profile.html";
    },
  });
}
 
function handleDriveAuth() {
  tokenClient.requestAccessToken({prompt: "consent"});
}























