const stars =document.querySelectorAll(".star");
const rating = document.querySelector(".rating");
const rateThis = document.getElementById("rateThis");
const ratingSystem = document.querySelector(".ratingSystem");
const container = document.querySelector(".container");
const rateButton = document.getElementById("rateButton");
const closeButton = document.getElementById("closeButton");
const starRating = document.getElementById("starRating");
const removeRatingButton = document.getElementById("removeRatingButton");

let submitedRating=0;
let selectedRating=0;

starRating.addEventListener("click",displayStarRating);
closeButton.addEventListener("click",closeStarRating);
rateButton.addEventListener("click",submitRating);
removeRatingButton.addEventListener("click",removeRating);

for (let i=0;i<stars.length;i++) {
  stars[i].starValue=i+1;
  ["click","mouseover","mouseout"].forEach(function(e){
    stars[i].addEventListener(e,showRating);
  });
}
function displayStarRating() {
  container.style.display="flex";
  rateButton.disabled=true;
  rateButton.style.background="rgba(74,74,74,0.5)";
  rateButton.style.color = "darkgray";
}

function showRating(e) {
  let type=e.type;
  let starValue=this.starValue;
  if(type==="click"){
    if(starValue>0) {
      selectedRating=starValue;
    }
  }
  stars.forEach(function(element,index){
    if(type==="click") {
      rateButton.disabled=true;
      rateButton.style.background="rgba(74,74,74,0.5)";
      rateButton.style.color="darkgray";

      if(starValue != submitedRating) {
        rateButton.style.background="#f5c518";
        rateButton.style.color = "black";
        rateButton.disabled = false;
      }
      element.classList.toggle("blue",index<starValue);
      element.classList.toggle("fa-regular",index>=starValue);
      element.classList.toggle("fa-solid",index<starValue);
    }   
    if(type==="mouseover") {
      if(index<starValue){
        element.classList.add("blue");
        element.classList.remove("fa-regular");
        element.classList.add("fa-solid");
        return;
      }
        element.classList.remove("blue");
        element.classList.add("fa-regular");
        element.classList.remove("fa-solid");
    }
    if(type==="mouseout") {
      if(selectedRating==0) {
        element.classList.remove("blue");
        element.classList.add("fa-regular");
        element.classList.remove("fa-solid");
        return;
      }
      if(index>=selectedRating && starValue>=selectedRating) {
        element.classList.remove("blue");
        element.classList.add("fa-regular");
        element.classList.remove("fa-solid");
      }
      if(index>=starValue && starValue<selectedRating && index<selectedRating) {
        element.classList.add("blue");
        element.classList.remove("fa-regular");
        element.classList.add("fa-solid");
      }
    }
  
  })



}
































function closeStarRating() {
  container.style.display="none";
  selectedRating=submitedRating;
  stars.forEach(function(element,index){
    if(index+1>submitedRating) {
      element.classList.remove("blue");
      element.classList.remove("fa-solid");
      element.classList.add("fa-regular");
      return;
    }
    element.classList.add("blue");
    element.classList.add("fa-solid");
    element.classList.remove("fa-regular");
  });
}

function submitRating() {
  container.style.display="none";
  if(selectedRating>0){
    starRating.innerHTML=" "+selectedRating+"/10";
    submitedRating = selectedRating;
    const starElement = document.querySelector("#rateThis .fa-star");
    starElement.classList.remove("fa-regular");
    starElement.classList.add("fa-solid");
  }
}
function removeRating() {
  container.style.display="none";
  selectedRating=0;
  submitedRating=0;
  starRating.innerHTML=" Rate ";
  resetStars();
  const starElement = document.querySelector("#rateThis .fa-star");
  starElement.classList.remove("fa-solid");
  starElement.classList.add("fa-regular");
}
function resetStars(){
  stars.forEach(function(element){
    element.classList.remove("blue");
    element.classList.remove("fa-solid");
    element.classList.add("fa-regular");

  });
}





































































































































































