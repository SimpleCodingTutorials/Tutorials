let playerScore=0;
let computerScore=0;

function computerPlay() {
  const choices = ["rock","paper","scissors"];
  const randomIndex = Math.floor(Math.random()*choices.length);
  return choices[randomIndex];
}

function playGame(playerSelection) {
  const computerSelection = computerPlay();
  if(playerSelection === computerSelection) {
    document.getElementById("result").innerText = "It's a tile!";
    document.getElementById("result").style.color = "blue";
  } else if(
    (playerSelection === "rock" && computerSelection === "scissors") ||
    (playerSelection === "paper" && computerSelection === "rock") ||
    (playerSelection === "scissors" && computerSelection === "paper") 
  ) {
    document.getElementById("result").innerText = `You win! ${playerSelection} beats ${computerSelection}`;
    playerScore++;
    document.getElementById("result").style.color = "green";
  } else {
    document.getElementById("result").innerText = `You lose! ${computerSelection} beats ${playerSelection}`;
    computerScore++;
    document.getElementById("result").style.color = "red";
  }
  changeImageSrc(playerSelection,computerSelection);
  document.getElementById("playerScoreElement").innerText = playerScore;
  document.getElementById("computerScoreElement").innerText = computerScore;

}
function changeImageSrc(option1,option2) {
  const option1Image = option1+"1.png";
  const option2Image = option2+"1.png";
  document.getElementById("player1").querySelector("img").src = option1Image;
  document.getElementById("computer").querySelector("img").src = option2Image;

}


















