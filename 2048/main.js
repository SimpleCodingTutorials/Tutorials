let board=[];
let score = 0;
let wonGame = false;
let tileContainer = document.querySelector(".tileContainer");
let scoreElement = document.getElementById("scoreElement");
const alert = document.getElementById("alert");

createBoard();
addRandomTile();
addRandomTile();
//addTileAt(2,3,1024);
//addTileAt(2,2,1024);
function createBoard() {
  for (let i=0;i<4;i++) {
    let row=[];
    for (let j=0;j<4;j++) {
      row.push(0);
    }
    board.push(row);
  }
}

function addRandomTile() {
  let emptyTiles=[];
  for (let i=0;i<board.length;i++) {
    for (let j=0;j<board[i].length;j++) {
      if(board[i][j]===0) {
        emptyTiles.push([i,j]);
      }
    }
  }
  let [randomI,randomJ]=emptyTiles[Math.floor(Math.random()*emptyTiles.length)];
  board[randomI][randomJ] = Math.random()<0.9 ? 2 : 4;
  addTileToPage(randomI,randomJ,board[randomI][randomJ]);
}

function addTileToPage(row,column,value) {
  let tile = document.createElement("div");
  tile.classList.add(
    "tile",
    "row"+(row+1),
    "column"+(column+1),
    "value"+value
  );
  tile.innerHTML = value;
  tileContainer.appendChild(tile);
  tile.classList.add("merged");
  tile.addEventListener("animationend",function(){
    tile.classList.remove("merged");
  });
}

function startNewGame() {
  alert.style.display="none";
  tileContainer.innerHTML="";
  scoreElement.innerHTML = 0;
  board = [];
  score =0;
  wonGame =false;
  window.addEventListener("keydown",onDirectionKeyPress);
  createBoard();
  addRandomTile();
  addRandomTile();
}

function continuePlaying() {
  alert.style.display="none";
  window.addEventListener("keydown",onDirectionKeyPress);
}

window.addEventListener("keydown",onDirectionKeyPress);

function onDirectionKeyPress(event) {
  let movePossible;
  switch(event.key) {
    case "ArrowUp":
      movePossible = moveTiles(1,0);
      break;
    case "ArrowDown":
      movePossible = moveTiles(-1,0);
     break;
    case "ArrowLeft":
      movePossible = moveTiles(0,-1);
      break;
    case "ArrowRight":
      movePossible = moveTiles(0,1);
      break;
  }
  if(movePossible) {
    addRandomTile();
    let gameOver = isGameOver();
    if(gameOver.gameOver) showAlert(gameOver.message);
  }
 
}

function moveTiles (directionY,directionX) {
  let movePossible = false;
  let mergedRecently = false;

  if(directionX !=0) {
    let startX = directionX === 1 ? 3 : 0;
    let stepX = directionX === 1 ? -1 : 1;

    for (let i=0;i<4;i++) {
      let j = startX;
      while ((j<=3 && stepX === 1) || (j>=0 && stepX === -1)) {
        if(board[i][j]===0) {
          j+= stepX;
          continue;
        }
        let destination = getDestinationSquare(i,j,0,directionX);
        let tileClass = ".row"+(i+1)+".column"+(j+1);
        let tile = document.querySelector(tileClass);
        if(!destination.merge || (destination.merge && mergedRecently)) {
          mergedRecently = false;
          destination.destinationX += destination.merge ? stepX : 0;
          board[i][destination.destinationX] = board[i][j];
          if(destination.destinationX !==j) {
            movePossible = true;
            board[i][j] = 0;
          }
          moveTileOnPage(i,destination.destinationX,tile,false);
          j+=stepX;
          continue;
        }
        mergedRecently = true;
        board[i][destination.destinationX] = board[i][j]*2;
        score +=board[i][destination.destinationX];
        scoreElement.innerHTML = score;
        movePossible = true;
        board[i][j] = 0;
        moveTileOnPage(i,destination.destinationX,tile,destination.merge);
        j+=stepX;
      }
    }
  } else if (directionY !=0) {
    let startY = directionY === 1 ? 3 : 0;
    let stepY = directionY === 1 ? -1 : 1;

    for (let j=0;j<4;j++) {
      let i = startY;
      while ((i<=3 && stepY === 1) || (i>=0 && stepY === -1)) {
        if(board[i][j]===0) {
          i+= stepY;
          continue;
        }
        let destination = getDestinationSquare(i,j,directionY,0);
        let tileClass = ".row"+(i+1)+".column"+(j+1);
        let tile = document.querySelector(tileClass);
        if(!destination.merge || (destination.merge && mergedRecently)) {
          mergedRecently = false;
          destination.destinationY += destination.merge ? stepY : 0;
          board[destination.destinationY][j] = board[i][j];
          if(destination.destinationY !==i) {
            movePossible = true;
            board[i][j] = 0;
          }
          moveTileOnPage(destination.destinationY,j,tile,false);
          i+=stepY;
          continue;
        }
        mergedRecently = true;
        board[destination.destinationY][j] = board[i][j]*2;
        score +=board[destination.destinationY][j];
        scoreElement.innerHTML = score;
        movePossible = true;
        board[i][j] = 0;
        moveTileOnPage(destination.destinationY,j,tile,destination.merge);
        i+=stepY;
      }
    }
  }
  return movePossible;
}

function getDestinationSquare(i,j,directionY,directionX) {
  let destinationY = i;
  let destinationX = j;
  let merge = false;

  while(
    (destinationY<3 && directionY ===1) ||
    (destinationY>0 && directionY ===-1) ||
    (destinationX<3 && directionX ===1) ||
    (destinationX>0 && directionX ===-1)
  ) {
    let nextY = destinationY + directionY;
    let nextX = destinationX + directionX;
    let nextCell = board[nextY][nextX];
    let currentCell = board[i][j];

    if(nextCell ===0 || nextCell === currentCell) {
      destinationY = nextY;
      destinationX = nextX;
      merge = nextCell === currentCell;
    }
    if(nextCell ===0 || nextCell === currentCell) {
      destinationY = nextY;
      destinationX = nextX;
      merge = nextCell === currentCell;
    }
    if(nextCell !== 0 && nextCell !== currentCell) 
    break;

    if(merge)
      break;
  }
  return {
    merge:merge,
    destinationY:destinationY,
    destinationX:destinationX
  }
}

function moveTileOnPage(row,column,tile,merge) {
  let classes = Array.from(tile.classList);
  classes.forEach((className)=>{
    if(className.startsWith("row") || className.startsWith("column")) {
      tile.classList.remove(className);
    }
  });
  tile.classList.add("row"+(row+1),"column"+(column+1));
  if(merge) {
    let elements = tileContainer.querySelectorAll(".row"+(row+1)+".column"+(column+1));
    while(elements.length>1) {
      tileContainer.removeChild(elements[0]);
      elements = tileContainer.querySelectorAll(".row"+(row+1)+".column"+(column+1));
    }
    elements[0].className = "tile "+"row"+(row+1)+" column"+(column+1)+" "+"value"+board[row][column];
    elements[0].innerHTML = board[row][column];
    elements[0].classList.add("merged");
    elements[0].addEventListener("animationend",function(){
      tile.classList.remove("merged");
    });
  }
}

function isGameOver() {
  let emptySquare = false;
  for (let i=0;i<board.length;i++) {
    for (let j=0;j<board[i].length;j++) {
      if(board[i][j]=== 0) emptySquare = true;
      if(board[i][j]=== 2048 && !wonGame) return {gameOver:true,message:"You won!"};
      if(j!=3 && board[i][j] === board[i][j+1]) emptySquare = true;
      if(i!=3 && board[i][j] === board[i+1][j]) emptySquare = true;

    }
  }
  if(emptySquare)
    return {gameOver:false,message:""};
  return {gameOver:true,message:"Game over!"};
}

function showAlert(message) {
  if(message=="Game over!")
    alert.innerHTML = '<div>Game over!</div> <button class="newGame" onclick="startNewGame()">Try again</button>';
  if(message=="You won!") {
    wonGame = true;
    alert.innerHTML ='<div>You won!</div> <button class="newGame" onclick="startNewGame()">New game</button><button class="newGame" onclick="continuePlaying()">Continue</button>';
    window.removeEventListener("keydown",onDirectionKeyPress);
  }
  alert.style.display="flex";
  alert.style.flexDirection="column";
}














































function addTileAt(x,y,value) {
  board[x][y] = value;
  addTileToPage(x, y, board[x][y]);
}