
//test
const message = document.getElementById("message");
message.addEventListener("click",onClick);
message.innerHTML="Hello World!"
function onClick() {
    message.innerHTML="You clicked on me!"
}
