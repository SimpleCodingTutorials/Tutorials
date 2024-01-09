let name = document.getElementById("name");
let email = document.getElementById("email");
let message = document.getElementById("message");

(function() {
  emailjs.init("5SbHnDjNb9pK4sU1p");
})();

let templateParams = {
  to_name : "Simple Coding Tutorials",
  from_name: name.value,
  from_email:email.value,
  message:message.value
}

function submitMessage() {
  templateParams.to_name = "Simple Coding Tutorials";
  templateParams.from_name = name.value;
  templateParams.from_email = email.value;
  templateParams.message = message.value;
  emailjs.send("service_gf1iej8","template_4wummlb",templateParams)
  .then(function(){
    showAlert("Message sent successfully!");
    name.value="";
    email.value="";
    message.value="";
  }),function() {
    showAlert("Failed to send message!");
  }
}


 function showAlert(message) {
   const alert = document.getElementById("alert");
   alert.innerHTML = message;
   alert.style.display = "flex";
   setTimeout(function(){
     alert.style.display = "none";
   },3000);
 }
 

