const calculateSumButtonPost = document.getElementById("calculateSumButtonPost");
const calculateSumButtonGet = document.getElementById("calculateSumButtonGet");
const calculateDifferenceButtonGet = document.getElementById("calculateDifferenceButtonGet");

const num1Element = document.getElementById("num1");
const num2Element = document.getElementById("num2");

calculateSumButtonPost.addEventListener("click",function(){
  calculateSumPost(parseInt(num1Element.value),parseInt(num2Element.value));
});
calculateSumButtonGet.addEventListener("click",function(){
  calculateSumGet(num1Element.value,num2Element.value);
});
calculateDifferenceButtonGet.addEventListener("click",function(){
  calculateDifferenceGet(num1Element.value,num2Element.value);
});
function calculateSumGet(num1,num2) {
    result.innerHTML = "Waiting for server response...";
    fetch(`https://shocking-super-promotion.glitch.me?number1=${num1}&number2=${num2}`)
    .then(response=>response.text())
    .then(data=>result.innerHTML=data)
    .catch((error)=>{
      console.error("Error:",error);
    });
}

function calculateSumPost(number1,number2) {
  result.innerHTML = "Waiting for server response...";
  fetch(`https://shocking-super-promotion.glitch.me`,{
    method: "POST",
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({num1:number1,num2:number2}),
  })
  .then(response => response.text())
  .then(data=>(result.innerHTML = data))
  .catch((error)=>{
    console.error("Error",error);
  });
}

function calculateDifferenceGet(num1,num2) {
  result.innerHTML = "Waiting for server response...";
  fetch(`https://shocking-super-promotion.glitch.me/subtract?number1=${num1}&number2=${num2}`)
  .then(response=>response.text())
  .then(data=>result.innerHTML=data)
  .catch((error)=>{
    console.error("Error:",error);
  });
}











