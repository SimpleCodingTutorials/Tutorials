const gameBoard = document.querySelector(".goBoard");
const size = 9;
let isBlackTurn = true;
const alphabet = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
setupBoard();

let boardCellsArray = new Array(size);
fillBoardCellsArray(boardCellsArray);
function fillBoardCellsArray(array) {
  for (let i=0;i<size;i++) {
    array[i] = new Array(size);
  }
  for(let i=0;i<size;i++) {
    for(let j=0;j<size;j++) {
      array[i][j]=0;
    }
  }
}

function setupBoard() {
  addColumnCoordinates();
  for (i = 0; i < size; i++) {
    for (j = -1; j < size + 1; j++) {
      if (j < size && i < size && j > -1) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.id = j.toString() + (size - i - 1).toString();
        let horizontalLine = document.createElement("div");
        let verticalLine = document.createElement("div");
        horizontalLine.className = "line horizontal";
        verticalLine.className = "line vertical";
        if (j == 0) {
          horizontalLine.style.left = "50%";
          horizontalLine.style.width = "50%";
        }
        if (j == size - 1) {
          horizontalLine.style.right = "50%";
          horizontalLine.style.width = "50%";
        }
        if (i == 0) {
          verticalLine.style.top = "50%";
          verticalLine.style.height = "50%";
        }
        if (i == size - 1) {
          verticalLine.style.bottom = "50%";
          verticalLine.style.height = "50%";
        }
        if (
          (j == 2 && i == 2) ||
          (j == 6 && i == 2) ||
          (j == 2 && i == 6) ||
          (j == 6 && i == 6) ||
          (j == 4 && i == 4)
        ) {
          addStarPoint(cell);
        }
        cell.appendChild(horizontalLine);
        cell.appendChild(verticalLine);
        gameBoard.appendChild(cell);
        cell.addEventListener("click", insertPiece);
      }
      if (j == -1 || j == size) {
        addRowCoordinate(size - i);
      }
    }
  }
  addColumnCoordinates();
}

function insertPiece(event) {
  let clickedSquare = event.target;

  if (
    clickedSquare.classList.contains("piece") ||
    clickedSquare.tagName == "IMG"
  ) {
    return;
  }

  if (
    clickedSquare.classList.contains("line") ||
    clickedSquare.classList.contains("star")
  ) {
    clickedSquare = clickedSquare.parentNode;
  }
  let clickedSquareX = parseInt(clickedSquare.id.charAt(0));
  let clickedSquareY = parseInt(clickedSquare.id.charAt(1));
  let pieceColor = isBlackTurn ? 1:2;
  boardCellsArray[clickedSquareX][clickedSquareY] = pieceColor;
  let captures = checkCaptures(boardCellsArray,[clickedSquareX,clickedSquareY]);
  if(captures.length>0) {
    if(isValidCaptureMove(captures)) {
      captures.forEach(([x,y])=>removePiece(x,y));
      updateBoardArray(captures);
    }else {
      boardCellsArray[clickedSquareX][clickedSquareY]=0;
      captures.length=0;
      showAlert("Self capture is not allowed!");
      return;
    }
  }
  let color = isBlackTurn ? "black" : "white";
  var piece = document.createElement("div");
  piece.className = `piece ${color}`;
  let pieceImage = document.createElement("img");
  pieceImage.src = `${color}-disc.png`;
  piece.appendChild(pieceImage);
  clickedSquare.appendChild(piece);
  isBlackTurn = !isBlackTurn;
}
function addColumnCoordinates() {
  for (i = 0; i < size + 2; i++) {
    let coord = document.createElement("div");
    coord.classList.add("coords");
    if (i > 0 && i < size + 1) coord.innerHTML = alphabet[i - 1];
    gameBoard.appendChild(coord);
  }
}

function addRowCoordinate(rowLabel) {
  let coord = document.createElement("div");
  coord.classList.add("coords");
  coord.innerHTML = rowLabel;
  gameBoard.appendChild(coord);
}

function addStarPoint(cell) {
  let starPoint = document.createElement("div");
  starPoint.className = "star";
  starPoint.innerHTML = "•";
  cell.appendChild(starPoint);
}

function checkCaptures(board,lastMove) {
  let captures = [];
  let visited = Array(board.length).fill().map(()=>Array(board.length).fill(false));
  let dx = [-1,0,1,0];
  let dy = [0,1,0,-1];

  for (let i=0;i<board.length;i++){
    for (let j=0;j<board.length;j++){
      if(board[i][j] !==0 && !visited[i][j]) {
        let capturedGroup = bfs(i,j,board,visited);
        captures.push(...capturedGroup);


      }
    }
  }
  if(lastMove) {
    let [x,y] = lastMove;
    for( let i=0;i<4;i++) {
      let nx = x+dx[i];
      let ny = y+dy[i];
      if(nx>0 && ny>=0 && nx<board.length && ny<board.length && board[nx][ny]!==0 && !visited[nx][ny]) {
        let capturedGroup = bfs(nx,ny,board,visited);
        captures.push(...capturedGroup);
      }
    }
  }
  return captures;
}

function bfs(x, y,board,visited) {
  let dx = [-1, 0, 1, 0];
  let dy = [0, 1, 0, -1];
  let color = board[x][y];
  let queue = [[x, y]];
  let group = [[x, y]];
  visited[x][y] = true;
  let hasLiberty = false;

  while (queue.length > 0) {
      let [cx, cy] = queue.shift();
      for (let i = 0; i < 4; i++) {
          let nx = cx + dx[i];
          let ny = cy + dy[i];
          if (nx >= 0 && ny >= 0 && nx < board.length && ny < board.length && !visited[nx][ny]) {
              if (board[nx][ny] === color) {
                  queue.push([nx, ny]);
                  group.push([nx, ny]);
                  visited[nx][ny] = true;
              } else if (board[nx][ny] === 0) {
                  hasLiberty = true;
              }
          }
      }
  }

  return hasLiberty ? [] : group;
}

function removePiece(x,y) {
  let squareId = x.toString()+y.toString();
  let square = document.getElementById(squareId);
  let children  = square.childNodes;
  for (let i=children.length-1; i>=0;i--){
    if(!children[i].classList.contains("line") && !children[i].classList.contains("star")) {
      square.removeChild(children[i]);
    }
  }
}

function updateBoardArray(captures) {
  let turn = isBlackTurn ? 1 : 2;
  captures.forEach(element=>{
    if(turn!=boardCellsArray[element[0]][element[1]])
      boardCellsArray[element[0]][element[1]] =0;
  });
}

function isValidCaptureMove(captures) {
   let colors=[];
   captures.forEach(element=>{
    let x = element[0];
    let y = element[1];
    let color = boardCellsArray[x][y];
    colors.push(color);
   });
   let allCapturedSameColor = colors.every(element=>element === colors[0]);
   let selfCapture = (isBlackTurn && colors[0]==1) ||(!isBlackTurn && colors[0]==2);
   if(allCapturedSameColor && selfCapture)
   return false;
  return true;
}

function showAlert(message) {
  const alert = document.getElementById("alert");
  alert.innerHTML = message;
  alert.style.display = "flex";

  setTimeout(function () {
    alert.style.display = "none";
  }, 3000);
}