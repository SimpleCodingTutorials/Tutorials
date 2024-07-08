const squares = document.querySelectorAll(".square");
const container = document.querySelector(".container");
const rows=6;
const columns=7;
let counter =0;
let isYellowTurn = true;
let isGameOver = false;
let pieceCount = 0;

setupBoard();

function setupBoard() {
    for(let row=0; row<rows;row++) {
        for(let col=0; col<columns;col++) {
            squares[counter].id = `square-${row}-${col}`;
            counter++;
        }
    }
    for(let col=0;col < columns;col++) {
        for(let row=0; row<rows;row++) {
            document.getElementById(`square-${row}-${col}`).addEventListener("click",function(){
                handleClick(col);
            });
        }
    }
}

function handleClick(col) {
    if(isGameOver) return;
    for(let row = rows - 1; row>=0;row--) {
        let square = document.getElementById(`square-${row}-${col}`);
        if(!square.querySelector(".piece")) {
            let piece = document.createElement("div");
            piece.className = "piece";
            let img = document.createElement("img");
            if(isYellowTurn) {
                piece.classList.add("yellow");
                img.src = './yellow-chip.png';
            } else {
                piece.classList.add("red");
                img.src = './red-chip.png';
            }
            piece.appendChild(img);
            piece.style.position = "absolute";
            square.appendChild(piece);
            pieceCount++;
            if(checkWin(row,col,isYellowTurn ? "yellow": "red")) {
                let message = ((isYellowTurn ? "Yellow" : "Red") + " wins!");
                setTimeout(() => {
                    showAlert(message);
                }, 500);
                isGameOver = true;
            } else if(pieceCount === rows*columns) {
                showAlert('Its\'s a draw!');
                isGameOver = true;
            }
            isYellowTurn = !isYellowTurn;
            break;
        }
    }
}

function checkWin(row,col,color) {
    return(
        checkDirection(row,col,1,0,color) ||
        checkDirection(row,col,0,1,color) ||
        checkDirection(row,col,1,1,color) ||
        checkDirection(row,col,1,-1,color) 
    );
}

function checkDirection(row,col,rowDir,colDir,color) {
    let count =0;
    let winningPieces = [];
    for(let i=-3; i<=3;i++) {
        let r=row+i*rowDir;
        let c=col+i*colDir;
        if(r>=0 && r<rows && c>=0 && c< columns) {
            let square = document.getElementById(`square-${r}-${c}`);
            if(square.querySelector(`.${color}`)) {
                count++;
                winningPieces.push(square.querySelector(`.${color}`));
                if(count === 4) {
                    winningPieces.forEach(piece => {
                        piece.style.animation = "blink 1s infinite";
                    });
                    return true;
                }
            }  else {
                count = 0;
                winningPieces = [];
            }
        }
    }
    return false;
}

function resetGame() {
    isGameOver = false;
    isYellowTurn =true;
    pieceCount = 0;
    for(let row=0; row<rows;row++) {
        for(let col=0; col<columns; col++) {
            let square = document.getElementById(`square-${row}-${col}`);
            square.innerHTML = "";
        }
    }
}


























// Function to check in a particular direction




function showAlert(message) {
    const alert = document.getElementById("alert");
    alert.style.display ="flex";
    alert.innerHTML = message;
    setTimeout(function(){
        alert.style.display = "none";
    },3000);
}