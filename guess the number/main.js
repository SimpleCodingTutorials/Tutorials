let secretNumber;
let attempts=0;
let minInput = document.getElementById("min");
let maxInput = document.getElementById("max");
let startButton = document.getElementById("start");
let guessInput = document.getElementById("guess");
let submitButton = document.getElementById("submit");
let restartButton = document.getElementById("restart");
let message = document.getElementById("message");

startButton.addEventListener("click",()=>{
  let min = +minInput.value;
  let max = +maxInput.value;
  if(!isFinite(min)||!isFinite(max)|| min>max){
    message.textContent = "Please enter a valid range.";
    return;
  }
  secretNumber = Math.floor(Math.random()*(max-min+1))+min;
  attempts=0;
  guessInput.disabled=false;
  submitButton.disabled=false;
  restartButton.disabled=false;
  message.textContent="";
  minInput.disabled = true;
  maxInput.disabled =true;
  startButton.disabled =true;
});
submitButton.addEventListener("click",()=>{
  let guess = +guessInput.value;
  attempts++;
  if(!isFinite(guess)|| guess==="") {
    message.textContent = "Please enter a valid number.";
    return;
  }
  if(guess<secretNumber){
    message.textContent = `your guess of ${guess} is too low.`;
    return;
  }
  if(guess>secretNumber){
    message.textContent = `your guess of ${guess} is too high.`;
    return;
  }
  message.textContent = `Congratulations! You guessed the number in ${attempts} attemps.`;
  guessInput.disabled = true;
  submitButton.disabled = true;
});

restartButton.addEventListener("click",()=>{
  let min = +minInput.value;
  let max = +maxInput.value;
  secretNumber = Math.floor(Math.random()*(max-min+1))+min;
  attempts=0;
  guessInput.value = "";
  message.textContent = "";
  minInput.disabled = false;
  maxInput.disabled = false;
  guessInput.disabled = false;
  maxInput.disabled = false;
  submitButton.disabled = false;
  startButton.disabled = false;
});








































