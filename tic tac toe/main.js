const board = document.getElementById("board");
const cells = Array.from(document.querySelectorAll(".cell"));
const winningMessageText = document.querySelector(".winning-message-text");
const winningMessage = document.getElementById("winningMessage");
const restartButton = document.getElementById("restartButton");

let oTurn;
let isGameOVer = false;
const X_CLASS = "x";
const O_CLASS = "o";
const WINNING_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

startGame();
restartButton.addEventListener("click",startGame);

function startGame() {
  oTurn = false;
  cells.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener("click",handleClick);
    cell.addEventListener("click",handleClick,{once:true});
    cell.innerText="";
  });
  setBoardHoverClass();
  winningMessage.classList.remove("show");
  isGameOVer = false;
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell,currentClass);
  if(checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if(draw) {
    winningMessageText.innerText = "Draw";
  } else {
    winningMessageText.innerText = `${oTurn ? "O" : "X"} Wins!`;
  }
  if(isGameOVer)
    return;
  winningMessage.classList.add("show");
  setTimeout(function(){
    winningMessage.classList.remove("show");
  },3000);
  isGameOVer = true;
}

function isDraw() {
  return [...cells].every(cell=>{
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell,currentClass) {
  if(isGameOVer)
    return;
  cell.classList.add(currentClass);
  cell.innerText = currentClass.toUpperCase();
}
function swapTurns() {
  oTurn = !oTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if(oTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination =>{
    return combination.every(index => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

