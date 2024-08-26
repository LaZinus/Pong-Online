import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const serverURL = "http://raspberrypi";

const app = express();

var serverCode = 1;
var serverCodeList = [];

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
    var resetServerList = []
    fs.writeFile("serverList.json", JSON.stringify(resetServerList, null, 2), err => {
        if(err) throw err;

        console.log("[Server] Serverliste gelöscht!")
    })
    console.log(`[Server] listening on ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
});

app.get('/:code', function(req, res) {
    if(serverCodeList.length > 0) {
        for(var i = 0; i < serverCodeList; i++) {
            if(req.param('code') == serverCodeList[i]) {
                res.send("Game gefunden auf Code: " + req.param('code'));
            } else {
                res.send("Game  nicht gefunden auf Code: " + req.param('code'));
            }
        }
    }
    else {
        res.send("Es gibt derzeit kein Game");
    }
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);

    addGamesToServerList(socket);

    socket.on('createServer', (name, password) => {
        console.log(`Server erfollgreich erstellt. Name: ${name} | Passwort: ${password} | Code: ${serverCode}  | Status: Open | User: ${socket.id}`);

        var data = fs.readFileSync('serverList.json');
        var newObject = JSON.parse(data);

        const newServer = {
            "name": name,
            "code": serverCode,
            "password": password,
            "status": "Open"
        }

        newObject.push(newServer);
        var newData = JSON.stringify(newObject, null, 2);
        fs.writeFile('serverList.json', newData, err => {
            if(err) throw err;

            socket.emit('redirectToGame', `${serverURL}:${PORT}/${serverCode}`)
            console.log("[Server] Server added")
            serverCodeList.push(serverCode);
            console.log(serverCodeList.toString());
            serverCode++;
            if(serverCode == 10000) {
                serverCode = 1;
            }
        })
    })
});

function addGamesToServerList(socket) {
    const serverData = JSON.parse(fs.readFileSync('serverList.json', 'utf8'));

    serverData.forEach(data => {
        var password;
        if(data.password.length > 0) {
            password = true;
        } else {
            password = false;
        }

        socket.emit("addGameToServerList", data.name, data.code, password, "Open");
    });

}