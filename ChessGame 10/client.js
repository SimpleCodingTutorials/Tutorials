let ws;
let username;
let color;

function joinGame() {
  username = document.getElementById("usernameInput").value;
  if(!username) {
    alert("Please enter a username");
    return;
  }
  join.style.display = "none";
  ws = new WebSocket("ws://localhost:3000");
  ws.onopen = () => {
    ws.send(JSON.stringify({type:"join",username}));
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.type === "playerList") {
      players = data.players;
      updatePlayerInfo();
      if(players.length === 2) {
        let countdown = 3;
        const updateCounter = () =>{
          if(countdown>0){
            counter.innerText = countdown;
            countdown--;
          } else {
            clearInterval(intervalId);
            counter.innerText = "";
          }
        };
        updateCounter();
        const intervalId = setInterval(updateCounter,1000);
        setTimeout(()=>{
          assignColors();
          document.getElementById("join").style.display = "none";
          document.querySelector(".container").style.display = "flex";
          gamePlayerInfo.style.display = "flex";
          playerInfo.style.display = "none";
        },3000)
      }
    }
    if(data.type === "color") {
      color = data.color;
      if(color === "black") {
        flipBoard();
      }
    }
    if(data.type === "move") {
      const startSquare = data.startSquare;
      const endSquare = data.endSquare;
      const promotedTo = data.promotedTo;
      displayMove(startSquare,endSquare,promotedTo);
    }
    if(data.type === "resign") {
      allowMovement = false;
      showAlert(data.winner+ " won!");
    }
  };
  ws.onclose = () => {
    alert("Disconnected from the server");
  };
}

function updatePlayerInfo() {
  const playerInfoDiv = document.getElementById("playerInfo");
  playerInfoDiv.innerHTML = `Player 1: ${players[0] || 'Waiting...'} - Player 2:${players[1] || 'Waiting...'}`;
  player1.innerText = username;
  if(username === players[0]) {
    player2.innerText = players[1];
  } else {
    player2.innerText = players[0];
  }
}

function assignColors() {
  const randomColor = Math.random() < 0.5 ? ["white","black"] : ["black","white"];
  ws.send(JSON.stringify({type: "assignColors", colors: randomColor}));
}

function sendMove(startSquare,endSquare,promotedTo="blank") {
  if(!startSquare || !endSquare) {
    alert("Invalid move");
    return;
  }
  const move = {type: "move", username,startSquare,endSquare,promotedTo};
  ws.send(JSON.stringify(move));
}

function sendResign(winner) {
  ws.send(JSON.stringify({type:"resign",winner:winner}));
}


















