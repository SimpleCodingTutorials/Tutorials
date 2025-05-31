const user = JSON.parse(localStorage.getItem("user"));
if(user) {
  document.getElementById("welcome").textContent = `Hello, ${user.name}`;
   document.getElementById("pic").src = user.picture;
 document.getElementById("email").textContent = user.email;
} else {
  window.location.href="/";
}

document.getElementById("signout").addEventListener("click",()=>{
  localStorage.removeItem("user");
  google.accounts.id.disableAutoSelect();
  window.location.href="/";
});



















