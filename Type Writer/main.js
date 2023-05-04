const introDiv = document.getElementById("introDiv");
const introString = "In this tutorial, you will learn how to create a text typing animation. The effect you are currently seeing in this introduction has been created using this tutorial. The steps provided are simple and easy to follow, allowing even those with minimal experience to achieve the desired effect. ";
const typingSpeed = 50;
//Counts number of typed letters
let letterCount=0;
const typingInterval=setInterval(function(){typeString(introString)}, typingSpeed);
// This function types the specified string
function typeString (str) {
    let letter="";
    letter = str.charAt(letterCount);
    introDiv.innerHTML+=letter;
    letterCount++;
    //Verifying if the last letter has been typed.
    if(letterCount==introString.length){
      clearInterval(typingInterval);
    }
}

