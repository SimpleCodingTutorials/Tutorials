const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];
let gameState = {
  isOngoing: false,
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  moves: [],
  isWhiteTurn:true,
  players: {},
  fenArray:[],
  pgn:""
};
gameState.fenArray.push("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
wss.on("connection", (ws) => {
  if (clients.length >= 2) {
    ws.send(JSON.stringify({ type: "error", message: "Room is full" }));
    ws.close();
    return;
  }

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "join") {
      clients.push({ ws, username: data.username });
      const players = clients.map(client => client.username);
      clients.forEach(client => {
        client.ws.send(JSON.stringify({ type: "playerList", players }));
      });
      if (clients.length === 2) {
        assignColors();
        gameState.isOngoing = true;
      }
    } else if (data.type === "move") {
      console.log("Received move from client:", data);
      clients.forEach(client => {
        console.log(`Checking client: ${client.username}, WebSocket state: ${client.ws.readyState}`);

        if (client.ws !== ws) 
          {
            console.log(`Sending move to ${client.username}`);

            client.ws.send(JSON.stringify({
              type: "move",
              startSquare: data.startSquare,
              endSquare: data.endSquare,
              promotedTo: data.promotedTo
            }));
        }
      });
      if(clients.length>1)
      console.log("move push "+data.startSquare+" - "+data.endSquare + " length= "+ clients.length+"  "+clients[0].username+"   "+clients[1].username);
      gameState.moves.push({
        from: data.startSquare,
        to: data.endSquare,
        pieceType: data.pieceType,
        pieceColor: data.pieceColor,
        captured: data.captured,
        promotedTo: data.promotedTo,
      });

    } else if (data.type === "resign") {
      clients.forEach(client => {
        if (client.ws !== ws) {
          client.ws.send(JSON.stringify({
            type: "resign",
            winner: data.winner,
          }));
        }
      });
      resetGame();
      console.log("game resetted");

    } else if (data.type === "reconnect") {
      console.log("fen="+gameState.fen);

      if(!gameState.isOngoing) return;
      const playerColor = gameState.players[data.username];
      const opponent = Object.keys(gameState.players).find(name => name !== data.username);
      ws.send(JSON.stringify({
        type: "reconnect",
        color: playerColor,
        isOngoing: gameState.isOngoing,
        fen: gameState.fen,
        moves: gameState.moves,
        opponent: opponent || null,
        fenArray: gameState.fenArray,
        pgn: gameState.pgn
      }));

      const existingClient = clients.find(client => client.username === data.username);
       {

        console.log("clients.length="+clients.length);

        if (existingClient) {
          existingClient.ws = ws; // Update WebSocket connection
        } else {
          if(clients.length<2) 
           clients.push({ ws, username: data.username });
          console.log("clients.length 2 = "+clients.length+" "+data.username);
        }
      }
     
    }
    else if (data.type === "fen") {
      clients.forEach(client => {
        if (client.ws !== ws) {
          client.ws.send(JSON.stringify({
            type: "fen",
            fen: data.fen,
          }));
        }
      });
      gameState.fen = data.fen;
      gameState.fenArray.push(data.fen);
    }    
    else if (data.type === "pgn") {
      clients.forEach(client => {
        if (client.ws !== ws) {
          client.ws.send(JSON.stringify({
            type: "pgn",
            pgn: data.pgn,
          }));
        }
      });
      gameState.pgn = data.pgn;
    }

  });

  ws.on('close', () => {
    const index = clients.findIndex(client => client.ws === ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

function assignColors() {
  const randomColor = Math.random() < 0.5 ? ["white", "black"] : ["black", "white"];
  clients[0].ws.send(JSON.stringify({ type: "color", color: randomColor[0] }));
  clients[1].ws.send(JSON.stringify({ type: "color", color: randomColor[1] }));
  
  // Save the players and their assigned colors in the gameState
  gameState.players[clients[0].username] = randomColor[0];
  gameState.players[clients[1].username] = randomColor[1];
}

function resetGame() {
    clients = [];
    clients.length =0;
    gameState = {
    isOngoing: false,
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    moves: [],
    isWhiteTurn:true,
    players: {},
    fenArray:[],
    pgn:""
  };
  gameState.fenArray.push("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
}
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
