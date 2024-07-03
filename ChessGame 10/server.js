const express = require("express");
const http = require("http");
const { type } = require("os");
const WebSocket = require("ws");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

let clients = [];

wss.on("connection",(ws)=>{
  if(clients.length >=2) {
    ws.send(JSON.stringify({type:"error",message: "Room is full"}));
    ws.close();
    return;
  }
  ws.on("message",(message)=>{
    const data = JSON.parse(message);
    if(data.type === "join") {
      clients.push({ws,username:data.username});
      const players = clients.map(client => client.username);
      clients.forEach(client => {
        client.ws.send(JSON.stringify({type:"playerList",players}));
      });
      if(clients.length === 2) {
        assignColors();
      }
    } else if (data.type === "move") {
      clients.forEach(client => {
        if(client.ws !== ws) {
          client.ws.send(JSON.stringify({
            type: "move",
            startSquare: data.startSquare,
            endSquare:data.endSquare,
            promotedTo: data.promotedTo
          }));
        }
      });
    } else if(data.type === "resign") {
      clients.forEach(client =>{
        if(client.ws !== ws) {
          client.ws.send(JSON.stringify({
            type: "resign",
            winner: data.winner,
          }));
        }
      });
    }
  });
  
  ws.on('close', () => {
    const index = clients.findIndex(client => client.ws === ws);
    if (index !== -1) {
      clients.splice(index, 1);
      const players = clients.map(client => client.username);
      clients.forEach(client => {
        client.ws.send(JSON.stringify({ type: 'playerList', players }));
      });
    }
  });
  
})



function assignColors() {
  const randomColor = Math.random() <0.5 ? ["white","black"] : ["black","white"];
  clients[0].ws.send(JSON.stringify({type:"color",color:randomColor[0]}));
  clients[1].ws.send(JSON.stringify({type:"color",color:randomColor[1]}));
}

server.listen(3000,()=> {
  console.log("Server is listening on port 3000");
});





















