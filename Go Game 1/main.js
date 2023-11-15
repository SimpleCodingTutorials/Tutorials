const gameBoard = document.querySelector(".goBoard");
const size =9;
let isBlackTurn = true;

setupBoard();

function setupBoard() {
  addColumnCoordinates();
  for(i=0;i<size;i++) {
    for(j=-1;j<size+1;j++){
      if(j<size && i<size && j> -1) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        let horizontalLine = document.createElement("div");
        let verticalLine = document.createElement("div");
        horizontalLine.className = "line horizontal";
        verticalLine.className = "line vertical";
        if(j==0) {
          horizontalLine.style.left = "50%";
          horizontalLine.style.width = "50%";
        }
        if(j==size-1) {
          horizontalLine.style.right = "50%";
          horizontalLine.style.width = "50%";
        }
        if(i==0) {
          verticalLine.style.top = "50%";
          verticalLine.style.height = "50%";
        }
        if(i==size-1) {
          verticalLine.style.bottom = "50%";
          verticalLine.style.height = "50%";
        }
        if((j==2 && i==2)||(j==6 && i==2)||(j==2 && i==6)||(j==6 && i==6)||(j==4 && i==4)){
          addStarPoint(cell);
        }
        cell.appendChild(horizontalLine);
        cell.appendChild(verticalLine);
        gameBoard.appendChild(cell);
        cell.addEventListener("click", insertPiece);
      }
      if (j==-1 || j==size) {  
        addRowCoordinate(size-(i));
      } 
    }
  }
  addColumnCoordinates();
}

function insertPiece(event) {
  let clickedSquare = event.target;
  if(clickedSquare.classList.contains("piece") || (clickedSquare.tagName=="IMG")){
    return;
  } 

  if(clickedSquare.classList.contains("line") || (clickedSquare.classList.contains("star"))){
    clickedSquare = clickedSquare.parentNode;
  } 
  let color = isBlackTurn ?  "black" : "white";
  var piece = document.createElement("div");
  piece.className = `piece ${color}`;
  let pieceImage = document.createElement("img");
  pieceImage.src = `${color}-disc.png`;
  piece.appendChild(pieceImage);
  clickedSquare.appendChild(piece);
  isBlackTurn = !isBlackTurn;
}
function addColumnCoordinates() {
  let alphabet ="ABCDEFGHJKLMNOPQRSTUVWXYZ";
  for(i=0;i<size+2;i++) {
    let coord = document.createElement("div");
    coord.classList.add("coords");
    if(i>0 && i<size+1)
      coord.innerHTML =alphabet[i-1];
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

