const gameBoard = document.getElementById("gameBoard");
const squares = document.getElementsByClassName("square");
const numbers = document.getElementsByClassName("number");
const solveButton = document.getElementById("solveButton");
const newGameButton = document.getElementById("newGameButton");
const eraseButton = document.getElementById("eraseButton");
const hintButton = document.getElementById("hintButton");
const hints = document.getElementById("hint");
const mistakeElement = document.getElementById("mistakes");
let mistake =0;
let hintNumber =3;

let level = difficulty.value;
let board = sudoku.generate(level,false);
let solvedString = sudoku.solve(board);
let sudokuString = board;
let sudokuBoard = stringToArray(sudokuString);
let sudokuSolved = stringToArray(solvedString);

setupBoard();
fillBoard(sudokuBoard);


function setupBoard() {
  for (let i=0;i<squares.length;i++){
    let row = 9 - Math.floor(i/9);
    let column = (i%9)+1;
    let id= row*10+column;
    squares[i].setAttribute("id",id);
    squares[i].addEventListener("click",onSquareClick);  
  }
  for(let i=0;i<numbers.length;i++){
    let id=i+1;
    numbers[i].setAttribute("id",id);
    numbers[i].addEventListener("click",onNumberClick);  
  }
}
function onSquareClick(){
  let activeSquares = document.querySelectorAll(".active");
  if(activeSquares.length===1 && this.classList.contains("active")) {
    this.classList.toggle("active");
    return;
  }
  activeSquares.forEach((square)=>square.classList.remove("active"));
  this.classList.add("active");
}

function fillBoard(board) {
  for (let i=0;i<squares.length;i++) {
    let row = 9-Math.floor(i/9);
    let column = (i%9)+1;
    let id= row*10+column;
    let square = document.getElementById(id);
    if(board[row-1][column-1]!=0)square.classList.add("filled");
      square.innerHTML = board[row-1][column-1]==0 ? "" : board[row-1][column-1];
  }
}
function stringToArray(sudokuString) {
   let board = [];
   let row = [];
   for (let i=0;i<sudokuString.length;i++) {
    if(sudokuString[i]===".") {
      row.push(0);
    } else {
      row.push(parseInt(sudokuString[i]));
    }
    if(row.length===9) {
      board.push(row);
      row=[];
    }

   }
   return board;
}
function onNumberClick() {
  let activeSquare = document.querySelector(".active");
  if(activeSquare.classList.contains("filled")) return;
  if(!activeSquare || activeSquare.classList.contains("filled")) return;
  activeSquare.innerHTML = this.innerHTML;
  let userInput = parseInt(this.innerHTML);
  let row = parseInt(activeSquare.id.charAt(0));
  let column = parseInt(activeSquare.id.charAt(1));

  let isCorrect = userInput == sudokuSolved[row-1][column-1];
  activeSquare.classList.remove(isCorrect ? "filled" : "true");
  activeSquare.classList.add(isCorrect ? "filled" : "false");

  if(isCorrect) {
    activeSquare.classList.add("true");
    let filledSquares = document.getElementsByClassName("filled");
    if(filledSquares.length==81)
      endGame("Bravo! Sudoku Conquered!","green");
    return;
  }
  mistake++;mistakeElement.innerHTML=mistake+"/3";
  if(mistake==3) endGame("Game Over! 3 Strikes,Try Again!","darkred");
}

function endGame(message,color){
    for (let i=0;i<squares.length;i++) {
      squares[i].removeEventListener("click",onSquareClick);
    }
    let activeSquares = document.querySelectorAll(".active");
    activeSquares.forEach((square)=>square.classList.remove("active"));
    showAlert(message,color);
}
eraseButton.addEventListener("click",function(){
  let activeSquare = document.querySelector(".active");
  if(activeSquare==null)return;
  activeSquare.classList.remove("active");
  if(activeSquare.classList.contains("filled")) return;
  activeSquare.innerHTML="";
});

hintButton.addEventListener ("click",function(){
  if(hintNumber==0) {
    showAlert("Oops! You've used all your hints.");
    return;
  }
  let activeSquare = document.querySelector(".active");
  activeSquare.classList.remove("active");
  if(activeSquare.classList.contains("filled")) return;
  let row = parseInt(activeSquare.id.charAt(0));
  let column = parseInt(activeSquare.id.charAt(1));
  activeSquare.innerHTML = sudokuSolved[row-1][column-1];
  activeSquare.classList.add("filled");
  activeSquare.classList.add("true");
  hintNumber--;
  hints.innerHTML = hintNumber+"/3";
});
solveButton.addEventListener("click",function(){
  resetBoard();
  fillBoard(sudokuSolved);
});
newGameButton.addEventListener("click",function(){
  resetBoard();
  level = difficulty.value;
  board = sudoku.generate(level,false);
  sudokuString = board;
  solvedString = sudoku.solve(board);
  sudokuBoard = stringToArray(sudokuString);
  sudokuSolved = stringToArray(solvedString);
  setupBoard();
  fillBoard(sudokuBoard);
  mistake = 0;
  mistakeElement.innerHTML = "0/3";
  hintNumber =3;
  hints.innerHTML = "3/3";
});

function resetBoard() {
  for(let i=0;i<squares.length;i++) {
    squares[i].classList.remove("filled");
    squares[i].classList.remove("false");
    squares[i].classList.remove("active");
    squares[i].classList.remove("true");
  }
}


function showAlert(message, color) {
  const alert = document.getElementById("alert");
  alert.innerHTML = message;
  alert.style.display = "block";
  alert.style.color = color;
  gameBoard.style.opacity = 0.5;
  setTimeout(function () {
    alert.style.display = "none";
    gameBoard.style.opacity = 1;
  }, 3000);
}