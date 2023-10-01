let socket = io();
let username;

function setUsername(){
  username = document.querySelector("#usernameInput").value;
  if(username) {
    socket.emit("Set Username",username);
    document.querySelector("#setUsername").style.display="none";
    document.querySelector("#chat").style.display="block";

  }
}

document.querySelector("form").addEventListener("submit",function(e){
  e.preventDefault();
  let message = document.querySelector("#messageInput").value;
  socket.emit("chat message",{username: username, message:message});
  document.querySelector("#messageInput").value = "";
  return false;
});


socket.on("chat message",function(data){
  let messageContainer = document.createElement("div");
  messageContainer.classList.add("message");
  let usernameDiv = document.createElement("div");
  usernameDiv.classList.add("username");
  let messageContent = document.createElement("div");
  messageContent.classList.add("messageContent");
  usernameDiv.innerHTML = data.username;
  messageContent.innerHTML = data.message;
  messageContainer.appendChild(usernameDiv);
  messageContainer.appendChild(messageContent);

  document.querySelector("#messages").appendChild(messageContainer);
  document.querySelector("#messages").scrollTop =document.querySelector("#messages").scrollHeight ;
});
































