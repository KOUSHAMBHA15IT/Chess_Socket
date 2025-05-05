const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();

let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res)=>{
    res.render("index",{title : "Chess Game"});
});

io.on("connection", function (uniquesocket){//callback function when a new socket connects
    console.log("Connected");

    if(!players.white){
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "W");//telling the player that he is white
    }else if(!players.black){
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "B");//telling the player that he is black
    }
    else{
        uniquesocket.emit("spectatorRole");
    }
});

server.listen(3000, function () {
    console.log("Server is running on port 3000");
});