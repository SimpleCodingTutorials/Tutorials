const whiteScore = document.getElementById("whiteScore");
const blackScore = document.getElementById("blackScore");
const reversiBoard = document.getElementById("reversiBoard");
let squares = document.getElementsByClassName("square");
let squaresToFlip=[];
let isWhiteTurn = true;
let whiteCount = 2;
let blackCount = 2;
let noLegalMove = false;

setupBoard();

function setupBoard(){
  for (let i=0;i<squares.length;i++){
    let row = 8 - Math.floor(i/8);
    let col = (i%8)+1;
    let id= row*10+col;
    squares[i].setAttribute("id",id);
    squares[i].addEventListener("click",onSquareClick);
  }
  let legalSquares = getLegalSquares("white");
  highlightLegalSquares(legalSquares);
  whiteScore.classList.add("active");
}

function getLegalSquares(pieceColor) {
  let legalSquares=[];
  for (let i=0;i<squares.length;i++) {
    let row = 8 - Math.floor(i/8);
    let col =(i%8)+1;
    let id = (row*10+col).toString();
    let square = document.getElementById(id);
    let isSquareLegal = false;
    if(isSquareOccupied(square)!="blank")continue;

    let stopSquareContent = moveToEighthRow(id,pieceColor);
    if(stopSquareContent!="blank" && squaresToFlip.length>0){
      isSquareLegal = true;
    }
    squaresToFlip.length = 0;

    stopSquareContent = moveToFirstRow(id,pieceColor);
    if(stopSquareContent!="blank" && squaresToFlip.length>0){
      isSquareLegal = true;
    }
    squaresToFlip.length = 0;

    stopSquareContent = moveToEighthColumn(id,pieceColor);
    if(stopSquareContent!="blank" && squaresToFlip.length>0){
      isSquareLegal = true;
    }
    squaresToFlip.length = 0;

    stopSquareContent = moveToFirstColumn(id,pieceColor);
    if(stopSquareContent!="blank" && squaresToFlip.length>0){
      isSquareLegal = true;
    }
    squaresToFlip.length = 0;

    stopSquareContent = moveToEighthRowEighthColumn(id,pieceColor);
    if(stopSquareContent!="blank" && squaresToFlip.length>0){
      isSquareLegal = true;
    }
    squaresToFlip.length = 0;

    stopSquareContent = moveToEighthRowFirstColumn(id,pieceColor);
    if(stopSquareContent!="blank" && squaresToFlip.length>0){
      isSquareLegal = true;
    }
    squaresToFlip.length = 0;

    stopSquareContent = moveToFirstRowEighthColumn(id,pieceColor);
    if(stopSquareContent!="blank" && squaresToFlip.length>0){
      isSquareLegal = true;
    }
    squaresToFlip.length = 0;

    stopSquareContent = moveToFirstRowFirstColumn(id,pieceColor);
    if(stopSquareContent!="blank" && squaresToFlip.length>0){
      isSquareLegal = true;
    }
    squaresToFlip.length = 0;
    if(isSquareLegal) {
      legalSquares.push(id);
    }
  }
  return legalSquares;
}
function isSquareOccupied(square) {
  if(square.querySelector(".piece")){
    const color = square.querySelector(".piece").getAttribute("color");
    return color;
  } else {
    return "blank";
  }
}
function moveToEighthRow(startingSquareId,pieceColor) {
  const row = startingSquareId.charAt(0);
  const column = startingSquareId.charAt(1);
  const rowNumber = parseInt(row);
  let squaresToFlipTemp = [];
  let currentRow = rowNumber;
  while (currentRow!=8) {
    currentRow++;
    let currentSquareId =currentRow+column;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    if(squareContent == pieceColor) {
      squaresToFlip.push(...squaresToFlipTemp);
      return squareContent;
    }
    if(squareContent == "blank") return squareContent;
    squaresToFlipTemp.push(currentSquareId);
  }
  return "blank";
}
function moveToFirstRow(startingSquareId,pieceColor) {
  const row = startingSquareId.charAt(0);
  const column = startingSquareId.charAt(1);
  const rowNumber = parseInt(row);
  let squaresToFlipTemp = [];
  let currentRow = rowNumber;
  while (currentRow!=1) {
    currentRow--;
    let currentSquareId =currentRow+column;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    if(squareContent == pieceColor) {
      squaresToFlip.push(...squaresToFlipTemp);
      return squareContent;
    }
    if(squareContent == "blank") return squareContent;
    squaresToFlipTemp.push(currentSquareId);
  }
  return "blank";
}
function moveToEighthColumn(startingSquareId,pieceColor) {
  const row = startingSquareId.charAt(0);
  const column = startingSquareId.charAt(1);
  const columnNumber = parseInt(column);
  let squaresToFlipTemp = [];
  let currentColumn = columnNumber;
  while (currentColumn!=8) {
    currentColumn++;
    let currentSquareId =row+currentColumn;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    if(squareContent == pieceColor) {
      squaresToFlip.push(...squaresToFlipTemp);
      return squareContent;
    }
    if(squareContent == "blank") return squareContent;
    squaresToFlipTemp.push(currentSquareId);
  }
  return "blank";
}
function moveToFirstColumn(startingSquareId,pieceColor) {
  const row = startingSquareId.charAt(0);
  const column = startingSquareId.charAt(1);
  const columnNumber = parseInt(column);
  let squaresToFlipTemp = [];
  let currentColumn = columnNumber;
  while (currentColumn!=1) {
    currentColumn--;
    let currentSquareId =row+currentColumn;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    if(squareContent == pieceColor) {
      squaresToFlip.push(...squaresToFlipTemp);
      return squareContent;
    }
    if(squareContent == "blank") return squareContent;
    squaresToFlipTemp.push(currentSquareId);
  }
  return "blank";
}
function moveToFirstRowEighthColumn(startingSquareId,pieceColor) {
  const row = startingSquareId.charAt(0);
  const column = startingSquareId.charAt(1);
  const rowNumber =parseInt(row);
  const columnNumber = parseInt(column);
  let squaresToFlipTemp = [];
  let currentColumn = columnNumber;
  let currentRow = rowNumber;

  while (currentColumn!=8 && currentRow!=1) {
    currentColumn++;
    currentRow--;
    let currentSquareId =currentRow.toString()+currentColumn.toString();
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    if(squareContent == pieceColor) {
      squaresToFlip.push(...squaresToFlipTemp);
      return squareContent;
    }
    if(squareContent == "blank") return squareContent;
    squaresToFlipTemp.push(currentSquareId);
  }
  return "blank";
}
function moveToFirstRowFirstColumn(startingSquareId,pieceColor) {
  const row = startingSquareId.charAt(0);
  const column = startingSquareId.charAt(1);
  const rowNumber =parseInt(row);
  const columnNumber = parseInt(column);
  let squaresToFlipTemp = [];
  let currentColumn = columnNumber;
  let currentRow = rowNumber;

  while (currentColumn!=1 && currentRow!=1) {
    currentColumn--;
    currentRow--;
    let currentSquareId =currentRow.toString()+currentColumn.toString();
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    if(squareContent == pieceColor) {
      squaresToFlip.push(...squaresToFlipTemp);
      return squareContent;
    }
    if(squareContent == "blank") return squareContent;
    squaresToFlipTemp.push(currentSquareId);
  }
  return "blank";
}

function moveToEighthRowEighthColumn(startingSquareId,pieceColor) {
  const row = startingSquareId.charAt(0);
  const column = startingSquareId.charAt(1);
  const rowNumber =parseInt(row);
  const columnNumber = parseInt(column);
  let squaresToFlipTemp = [];
  let currentColumn = columnNumber;
  let currentRow = rowNumber;

  while (currentColumn!=8 && currentRow!=8) {
    currentColumn++;
    currentRow++;
    let currentSquareId =currentRow.toString()+currentColumn.toString();
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    if(squareContent == pieceColor) {
      squaresToFlip.push(...squaresToFlipTemp);
      return squareContent;
    }
    if(squareContent == "blank") return squareContent;
    squaresToFlipTemp.push(currentSquareId);
  }
  return "blank";
}
function moveToEighthRowFirstColumn(startingSquareId,pieceColor) {
  const row = startingSquareId.charAt(0);
  const column = startingSquareId.charAt(1);
  const rowNumber =parseInt(row);
  const columnNumber = parseInt(column);
  let squaresToFlipTemp = [];
  let currentColumn = columnNumber;
  let currentRow = rowNumber;

  while (currentColumn!=1 && currentRow!=8) {
    currentColumn--;
    currentRow++;
    let currentSquareId =currentRow.toString()+currentColumn.toString();
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    if(squareContent == pieceColor) {
      squaresToFlip.push(...squaresToFlipTemp);
      return squareContent;
    }
    if(squareContent == "blank") return squareContent;
    squaresToFlipTemp.push(currentSquareId);
  }
  return "blank";
}

function onSquareClick(e) {
  let clickedSquare = e.target;
  let pieceColor = isWhiteTurn ? "white" : "black";
  let piece = createPiece(pieceColor);
  let isSquareLegal = false;
  let availableSquares = getLegalSquares(pieceColor);
  if(!availableSquares.includes(clickedSquare.id))return;
  isSquareLegal = true;
  clickedSquare.appendChild(piece);
  pieceColor == "white" ? whiteCount++ : blackCount++;
  checkAndFlip(clickedSquare.id,pieceColor);
  switchTurn();
  checkEndGame();
}

function createPiece(color){
  let piece = document.createElement("div");
  piece.setAttribute("class","piece");
  piece.setAttribute("color",color);
  let img = document.createElement("img");
  img.setAttribute("src",color+"-disc.png");
  piece.appendChild(img);
  return piece;
}

function highlightLegalSquares(legalSquares) {
  clearLegalSquares();
  legalSquares.forEach((square)=>{
    const squareElement = document.getElementById(square);
    squareElement.classList.add("legal-square");
  });
}
function clearLegalSquares() {
  const legalSquares = document.querySelectorAll(".legal-square");
  for(const square of legalSquares) {
    square.classList.remove("legal-square");
  }
}
function checkAndFlip(clickedSquareId,pieceColor){
  moveToEighthColumn(clickedSquareId,pieceColor);
  moveToEighthRow(clickedSquareId,pieceColor);
  moveToEighthRowEighthColumn(clickedSquareId,pieceColor);
  moveToEighthRowFirstColumn(clickedSquareId,pieceColor);
  moveToFirstColumn(clickedSquareId,pieceColor);
  moveToFirstRow(clickedSquareId,pieceColor);
  moveToFirstRowEighthColumn(clickedSquareId,pieceColor);
  moveToFirstRowFirstColumn(clickedSquareId,pieceColor);
  reversePieces(pieceColor);
  squaresToFlip.length=0;
}

function reversePieces(color){
  squaresToFlip.forEach((squareId)=>{
    let square = document.getElementById(squareId);
    while(square.firstChild){
      square.firstChild.remove();
    }
    let piece = createPiece(color);
    square.appendChild(piece);
    piece.classList.add("flip");
    color == "white"
    ? whiteCount++ && blackCount-- : whiteCount-- && blackCount++;
    whiteScore.innerHTML = "White Score: "+whiteCount;
    blackScore.innerHTML = "Black Score: "+blackCount;
  });
  squaresToFlip.length =0;
}

function switchTurn() {
  isWhiteTurn = !isWhiteTurn;
  whiteScore.classList.toggle("active",isWhiteTurn);
  blackScore.classList.toggle("active",!isWhiteTurn);
  pieceColor = isWhiteTurn ? "white" : "black";
  availableSquares = getLegalSquares(pieceColor);
  highlightLegalSquares(availableSquares);
  if(availableSquares.length == 0) {
    isWhiteTurn = !isWhiteTurn;
    whiteScore.classList.toggle("active",isWhiteTurn);
    blackScore.classList.toggle("active",!isWhiteTurn);
    pieceColor = isWhiteTurn ? "white" : "black";
    availableSquares = getLegalSquares(pieceColor);
    highlightLegalSquares(availableSquares);
    if(availableSquares.length===0) noLegalMove = true;
  }
}
function checkEndGame() {
  let message = "";
  if(
    !(
      whiteCount+blackCount ==64 ||
      whiteCount ==0 ||
      blackCount ==0 ||
      noLegalMove
    )
  )
  return;
  if(whiteCount>blackCount)message = "White Wins!";
  if(whiteCount<blackCount)message = "Black Wins!";
  if(whiteCount==blackCount)message = "Draw!";
      showEndGameMessage(message);
}



























function showEndGameMessage(message) {
  const alert = document.getElementById("alert");
  alert.style.display = "block";
  reversiBoard.style.opacity = 0.5;
  alert.innerHTML = message;
  setTimeout(function () {
    alert.style.display = "none";
    reversiBoard.style.opacity = 1;
  }, 4000);
}
