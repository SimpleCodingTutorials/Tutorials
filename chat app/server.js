const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const port = 3000;
const app = express();

app.use(express.static("."));
const server =http.createServer(app);
const io = socketIo(server);

io.on("connection",socket =>{
    console.log("User Connected");

    socket.on("chat message",function(data){
        io.emit("chat message",data);
    });
    socket.on("disconnect",()=>{
        console.log("User Disconnected");
    });

});

server.listen(port,()=>console.log(`Listening on port ${port}`));



























