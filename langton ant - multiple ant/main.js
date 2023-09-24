let size=120;
let rule = ["L","R"];

function filterInput(event){
  let input =event.target;
  let value = input.value;
  let filteredValue = value.replace(/[^LRCU]/g,"");
  input.value =filteredValue;
  if(filteredValue.length>0)
    rule = filteredValue.split("");
}
function filterSizeInput(event){
  let input =event.target;
  let value = input.value;
  let filteredValue = value.replace(/[^0123456789]/g,"");
  input.value =filteredValue;
  if(filteredValue.length>0)
    size = filteredValue;
}
let grid={};
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let squareSize;
let colors = rule.map(()=>`#${Math.floor(Math.random()*16777215).toString(16)}`);
colors[0]=`#ECECED`;

function setupGrid(){
  for(let x = -size; x<=size;x++){
    for(let y = -size; y<=size;y++){
      grid[`${x},${y}`]=0;
    }
  }
  squareSize = Math.min(canvas.width,canvas.height)/(size*2);
  colors = rule.map(()=>`#${Math.floor(Math.random()*16777215).toString(16)}`);
  colors[0]=`#ECECED`;
}

setupGrid();

function drawSquare(x,y,color){
  ctx.fillStyle = color;
  let centerX = canvas.width/2;
  let centerY = canvas.height/2;
  let x0 = centerX+squareSize*x;
  let y0 = centerY+squareSize*y;

  ctx.fillRect(x0,y0,squareSize,squareSize);
}

function updateAnts(ants) {
  for (let i=0;i<ants.length;i++){
    updateAnt(ants[i]);
  }
}

function updateAnt(ant){
  let cellColor =grid[`${ant.x},${ant.y}`];
  grid[`${ant.x},${ant.y}`] = (cellColor+1)%rule.length;

  switch(rule[cellColor]) {
    case "L":
      ant.direction = (ant.direction+3)%4;
      break;
      case "R":
        ant.direction = (ant.direction+1)%4;
      break;
      case "U":
        ant.direction = (ant.direction+2)%4;
      break;
      case "C":
       default:
        break;
  }
  switch(ant.direction) {
    case 0:
      ant.y--;
      break;
    case 1:
      ant.x++;
      break;
    case 2:
      ant.y++;
      break;
    case 3:
      ant.x--;
      break;
  }
}

let startPauseButton = document.getElementById("startPause");
let resetButton = document.getElementById("reset");
const speed = document.getElementById("speed");
let intervalId;
let step = parseInt(speed.value);
let isRunning = false;
let iterationCount=0;
startPauseButton.addEventListener("click",function(){
  gridSize.disabled = true;
  rules.disabled=true;
  if(isRunning) {
    clearInterval(intervalId);
    isRunning = !isRunning;
    startPauseButton.innerHTML ='<i class="fa-solid fa-play"></i>';
    return;
  }
  clearInterval(intervalId);
  isRunning =!isRunning;
  startPauseButton.innerHTML ='<i class="fa-solid fa-pause"></i>';
  if(iterationCount ==0) setupGrid();
  getAnts();
  intervalId = setInterval(function(){
    for(let i=0;i<step;i++){
      updateAnts(ants);
      iterationCount++;
      iteration.innerHTML = "Iteration:"+iterationCount;
    }
    for(let x=-size;x<=size;x++) {
      for(let y=-size;y<=size;y++){
          let cellColor = grid[`${x},${y}`];
          drawSquare(x,y,colors[cellColor]);
      }
    }
  },10);
});

resetButton.addEventListener("click",function(){
  ants=[];
  gridSize.disabled = false;
  rules.disabled = false;
  iterationCount =0;
  iteration.innerHTML = "Iteration:"+iterationCount;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  isRunning = false;
  startPauseButton.innerHTML ='<i class="fa-solid fa-play"></i>';
  clearInterval(intervalId);
  colors = rule.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
  colors[0]=`#FFFFFF`;
  for(let x in grid) {
    grid[x]=0;
  }
});

speed.addEventListener("change",()=>{
  step = parseInt(speed.value);
});

let addAntButton = document.getElementById("addAnt");
let antContainer = document.querySelector(".antContainer");

function createAnt(index) {
  let antDiv = document.createElement("div");
  antDiv.className = "ant";
  antDiv.id = "ant" + index;

  let deleteIcon = document.createElement("i");
  deleteIcon.className = "fas fa-times";
  deleteIcon.title = "Delete Ant";

  deleteIcon.addEventListener("click",function(){
    const index = ants.findIndex(ant=>ant.id===antDiv.id);
    if(index!==-1){
      ants.splice(index,1);
    }
    antDiv.parentNode.removeChild(antDiv);
  });

  antDiv.appendChild(deleteIcon);
  let antHeading = document.createElement("h3");
  antHeading.textContent = "Ant" + (index);
  antDiv.appendChild(antHeading);
  
  let initialXDiv = document.createElement("div");
  let initialXLabel=document.createElement("label");
  initialXLabel.htmlFor = "ant" + index + "x0";
  initialXLabel.textContent = "Initial X:";
  initialXDiv.appendChild(initialXLabel);
  let initialXInput=document.createElement("input");
  initialXInput.id = "ant" + index + "x0";
  initialXInput.type = "number";
  initialXInput.value =0;
  initialXDiv.appendChild(initialXInput);
  antDiv.appendChild(initialXDiv);

  let initialYDiv = document.createElement("div");
  let initialYLabel=document.createElement("label");
  initialYLabel.htmlFor = "ant" + index + "y0";
  initialYLabel.textContent = "Initial Y:";
  initialYDiv.appendChild(initialYLabel);
  let initialYInput=document.createElement("input");
  initialYInput.id = "ant" + index + "y0";
  initialYInput.type = "number";
  initialYInput.value =0;
  initialYDiv.appendChild(initialYInput);
  antDiv.appendChild(initialYDiv);

  let initialDirectionDiv = document.createElement("div");
  let initialDirectionLabel = document.createElement("label");
  initialDirectionLabel.textContent = "Initial Direction:"
  initialDirectionDiv.appendChild(initialDirectionLabel);
  let initialDirectionSelect = document.createElement("select");

  let directions = ["Up","Right","Down","Left"];
  for (let i=0;i<directions.length;i++) {
    let option = document.createElement("option");
    option.value = directions[i];
    option.text = directions[i];
    initialDirectionSelect.add(option);
  }
  initialDirectionDiv.appendChild(initialDirectionSelect);
  antDiv.appendChild(initialDirectionDiv);

  return antDiv;

}

var ants = [];
function getAnts() {
  // Get all ant divs
  var antDivs = document.querySelectorAll('.ant');
    // Create an array to store the ants
    // Loop through each ant div
  for (var i = 0; i < antDivs.length; i++) {
      // Get the ant div
      var antDiv = antDivs[i];
      // Create an object to store the ant data
      var ant = {};      
      // Get the inputs and select elements
      var inputs = antDiv.querySelectorAll('input, select');  

      ant.id = antDiv.id;

      const currentAnt = ants.find(anAnt => anAnt.id === antDiv.id);
      if(currentAnt) continue;

      // Loop through each input and select element
      for (var j = 0; j < inputs.length; j++) {
          // Get the input or select element
          var input = inputs[j];    
          // Get the value of the input or select element
          var value = input.value;          
          // Store the value in the ant object using a property name based on the input's type or tag name
          if (input.id.includes('x0')) {
              ant.x = value;
          } else if (input.id.includes('y0')) {
              ant.y = value;
          } else if (input.tagName === 'SELECT') {
              // Convert the direction value to a number from 0 to 3
              var directions = ['Up', 'Right', 'Down', 'Left'];
              var directionIndex = directions.indexOf(value);
              ant.direction = directionIndex;
          }
      }
      
      // Add the ant object to the ants array
      ants.push(ant);
  }
  

}


let antCount = 0;
addAntButton.addEventListener("click",function(){
    antCount++;
    let ant = createAnt(antCount);
    antContainer.appendChild(ant);
});

