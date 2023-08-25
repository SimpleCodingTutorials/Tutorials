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
colors[0]=`#FFFFFF`;

function setupGrid(){
  for(let x = -size; x<=size;x++){
    for(let y = -size; y<=size;y++){
      grid[`${x},${y}`]=0;
    }
  }
  squareSize = Math.min(canvas.width,canvas.height)/(size*2);
  colors = rule.map(()=>`#${Math.floor(Math.random()*16777215).toString(16)}`);
  colors[0]=`#FFFFFF`;
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

let antX=0;let antY=0;let antDir=0;
function updateAnt(){
  let cellColor =grid[`${antX},${antY}`];
  grid[`${antX},${antY}`] = (cellColor+1)%rule.length;

  switch(rule[cellColor]) {
    case "L":
      antDir = (antDir+3)%4;
      break;
      case "R":
      antDir = (antDir+1)%4;
      break;
      case "U":
      antDir = (antDir+2)%4;
      break;
      case "C":
       default:
        break;
  }
  switch(antDir) {
    case 0:
      antY--;
      break;
    case 1:
      antX++;
      break;
    case 2:
      antY++;
      break;
    case 3:
      antX--;
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

  intervalId = setInterval(function(){
    for(let i=0;i<step;i++){
      updateAnt();
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
  gridSize.disabled = false;
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
  antX=antY=antDir=0;
});

speed.addEventListener("change",()=>{
  step = parseInt(speed.value);
});

