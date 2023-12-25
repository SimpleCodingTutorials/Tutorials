const gameBoard = document.querySelector(".gameBoard");
const size = 9;
let move =0;
let flagsLeft =10;
let clearedNumber = 0;
let seconds =0;
let intervalId;
const directions = [
  [-1,-1],
  [-1,0],
  [-1,1],
  [0,-1],
  [0,1],
  [1,-1],
  [1,0],
  [1,1]
];

setupBoard();

let boardCellsArray = new Array(size);
fillBoardCellsArray(boardCellsArray);
function fillBoardCellsArray(array) {
  for (let i = 0; i < size; i++) {
    array[i] = new Array(size);
  }
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      array[i][j] = [0, false];
    }
  }
}

function setupBoard() {
  let counter=0;
  for (i = 0; i < size; i++) {
    for (j= -1; j < size+1; j++) {
      counter++;
      let squareColor = counter%2==0 ? "light" : "dark";
      if(!(j<size && i<size && j> -1)) continue;
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.classList.add(squareColor);
        cell.id = j.toString() + (size-i-1).toString();
        gameBoard.appendChild(cell);
        cell.addEventListener("click",onCellClick);
        cell.addEventListener("contextmenu",onCellRightClick);
  }
}
}
function placeMines (clickedSquareCoordinates) {
  for(let i=0;i<10;i++) {
    let row,col;
    do {
      row = Math.floor(Math.random()*9);
      col = Math.floor(Math.random()*9);
    } while (
      boardCellsArray[row][col][0] === -1 ||
      (row === clickedSquareCoordinates[0] &&
        col === clickedSquareCoordinates[1])
    );
    boardCellsArray[row][col][0] = -1;
  }
  for (let i=0; i<boardCellsArray.length;i++) {
    for (let j=0; j<boardCellsArray.length;j++) {
      if(boardCellsArray[i][j][0]!= -1)
        boardCellsArray[i][j][0] = getNumberOfMineInVicinity(i,j);
    }
  }
}

function getNumberOfMineInVicinity(x,y) {
  let mines = 0;
  for( let i=0; i<directions.length;i++) {
    let dx = directions[i][0];
    let dy = directions[i][1];
    let nx = x+dx;
    let ny = y+dy;
    if(
      nx>=0 &&
      ny>=0 &&
      nx < boardCellsArray.length &&
      ny<boardCellsArray[0].length &&
      boardCellsArray[nx][ny][0] === -1
    )
    mines++;
  }
  return mines;
}

function startTimer() {
  intervalId = setInterval(function(){
    seconds++;
    timer.innerHTML = seconds;
  },1000);
}

function stopTimer() {
  clearInterval(intervalId);
}


function onCellClick(event) {
  let clickedSquare = event.target.closest(".cell");
  let clickedSquareX = parseInt(clickedSquare.id.charAt(0));
  let clickedSquareY = parseInt(clickedSquare.id.charAt(1));
  let clickedSquareCoordinates = [clickedSquareX,clickedSquareY];
  if(move == 0) {
    placeMines(clickedSquareCoordinates);
    startTimer();
  }
  if(boardCellsArray[clickedSquareX][clickedSquareY][0]== -1) {
    removeClickEventFromCells();
    showAlert("Game Over!");
    updateHTMLBoard(true);
    return;
  }
  clearCells(clickedSquareX,clickedSquareY);
  updateHTMLBoard(false);
  if(clearedNumber == size * size - 10) {
    removeClickEventFromCells();
    updateHTMLBoard(true);
    showAlert("You Won!");
  }
  move++;
}

function onCellRightClick(event) {
  event.preventDefault();
  let clickedSquare = event.target.closest(".cell");
  if(clickedSquare.innerHTML == `<i class="fa-solid fa-flag" style="color: #ba1717"></i>` && !clickedSquare.classList.contains("lightCleared")&&!clickedSquare.classList.contains("darkCleared")) {
    clickedSquare.innerHTML = "";
    flagsLeft++;
    flag.innerHTML=flagsLeft;
    return;
  }
  if(clickedSquare.innerHTML == "" && !clickedSquare.classList.contains("lightCleared")&&!clickedSquare.classList.contains("darkCleared")) {
    clickedSquare.innerHTML =`<i class="fa-solid fa-flag" style="color: #ba1717"></i>`;
    flagsLeft--;
    flag.innerHTML = flagsLeft;
    return;
  }
}

function removeClickEventFromCells() {
  document.querySelectorAll(".cell").forEach((element)=>{
    element.removeEventListener("click",onCellClick);
    element.removeEventListener("contextmenu",onCellRightClick);
  });
}
function clearCells(x,y) {
  let queue =[];
  queue.push([x,y]);
  if(!boardCellsArray[x][y][1])
    clearedNumber++;
  boardCellsArray[x][y][1] = true;
  let i=0;
  while(queue.length>0 && i<=size*size){
    i++;
    let [x,y]=queue[0];
    if(
      x<0 ||
      y<0 ||
      x>=boardCellsArray.length ||
      y>=boardCellsArray.length[0]
    ){
      continue;
    }
    if(boardCellsArray[x][y][0] !==0) {
      continue;
    }
    boardCellsArray[x][y][1] =true;
    for(let i=0;i<directions.length;i++) {
      let dx = directions[i][0];
      let dy = directions[i][1];
      let nx = x+dx;
      let ny = y+dy;
      if(
        nx>=0 &&
        ny>=0 &&
        nx<boardCellsArray.length &&
        ny<boardCellsArray[0].length && !boardCellsArray[nx][ny][1]
      ) {
        clearedNumber++;
        boardCellsArray[nx][ny][1] = true;
        if(boardCellsArray[nx][ny][0]==0) {
          queue.push([nx,ny]);
        }
      }
    }
    queue.shift();
  }

}

function updateHTMLBoard(isEndGame) {
  for(let x=0;x<boardCellsArray.length;x++) {
    for(let y=0;y<boardCellsArray.length;y++) {
      if(boardCellsArray[x][y][0] === -1) {
        if(isEndGame)
          document.getElementById(`${x}${y}`).innerHTML =`<i class="fa-solid   fa-bomb" style="color:black"></i>`;
        continue; 
      }
      if(boardCellsArray[x][y][1] || isEndGame) {
        let cell = document.getElementById(`${x}${y}`);
        cell.innerHTML = boardCellsArray[x][y][0] ? boardCellsArray[x][y][0] : "";
        cell.classList.add(`value${boardCellsArray[x][y][0]}`);
        let color = cell.classList.contains("light") ? "light" : "dark";
        cell.classList.replace(color,`${color}Cleared`);
      }
    }
  }
}

function showAlert(message) {
  stopTimer();
  const alert = document.getElementById("alert");
  alert.innerHTML = message;
  alert.style.display = "flex";
  setTimeout(function(){
    alert.style.display = "none";
  },3000);
}



































