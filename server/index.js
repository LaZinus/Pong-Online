import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3500;
const serverURL = "http://raspberrypi";

const app = express();

var serverCode = 1;
var serverCodeList = [];
var spielerProServer = [];

var spieler = [];

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {

    const resetServerList = []

    fs.writeFile("serverList.json", JSON.stringify(resetServerList, null, 2), err => {
        if(err) throw err;

        console.log("[Server] Serverliste gelöscht!")
    })
    console.log(`[Server] listening on ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500", "http://raspberrypi:5500"]
    }
});

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);

    addGamesToServerList(socket);

    socket.on('createServer', (name, password) => {
        console.log(`Server erfollgreich erstellt. Name: ${name} | Passwort: ${password} | Code: ${serverCode}  | Status: Open | User: ${socket.id}`);

        var data = fs.readFileSync('serverList.json');
        var newObject = JSON.parse(data);

        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

        for(let i = 0; i < 25; i++) {
            const randomInd = Math.floor(Math.random() * characters.length)
            result += characters.charAt(randomInd);
        }

        const newServer = {
            "name": name,
            "code": serverCode,
            "password": password,
            "status": "Open",
            "id": result,
            "time": 2
        }

        newObject.push(newServer);
        var newData = JSON.stringify(newObject, null, 2);
        fs.writeFile('serverList.json', newData, err => {
            if(err) throw err;

            socket.emit('redirectToGame', `${serverURL}:${PORT}/${serverCode}/${result}`)
            console.log("[Server] Server added")
            serverCodeList.push(serverCode);
            console.log(serverCodeList.toString());
            spielerProServer[serverCode - 1] = 0;
            serverCode++;
            if(serverCode == 10000) {
                serverCode = 1;
            }
        })
        
    })

    socket.on('goBack', () => {
        socket.emit("directToUrl", `${serverURL}:${PORT}/`)
    }) 

    socket.on("playGame", (code) => {
        var data = fs.readFileSync('serverList.json');
        var server = JSON.parse(data)

        var serverGefunden = 0;
        var gefundenerServer;
        for(let i = 0; i < server.length; i++) {
            if(code == server[i].code) {
                serverGefunden = serverGefunden +1;
                gefundenerServer = server[i];
            }
        }

        if(serverGefunden > 0) {
            socket.emit("redirectToGame", `${serverURL}:${PORT}/${code}`);
        }
    })

    socket.on("join", (password, code) => {
        var data = fs.readFileSync('serverList.json');
        var newObject = JSON.parse(data);

        var gefunden = 0;
        for(let i = 0; i < newObject.length; i++) {
            if (newObject[i].code == code) {
                gefunden++;
                if(spielerProServer[code - 1] < 2) {
                    if(newObject[i].password == password) {
                        socket.emit("directToUrl", `${serverURL}:${PORT}/${newObject[i].code}/${newObject[i].id}`)

                        if(spielerProServer[code -1] == 2) {
                            newObject[i].status = "Closed";
                            var newData = JSON.stringify(newObject, null, 2);
                            fs.writeFile('serverList.json', newData, err => {if(err) throw err;})
                        }
                    } else {
                        socket.emit("passwortWarnung", "Password does not match");
                    }
                } else {
                    socket.emit("directToUrl", `${serverURL}:${PORT}/`)
                }
            }
        }
        if(gefunden == 0) {
            socket.emit("passwortWarnung", "Server wurde nicht gefunden / wurde gelöscht");
        }
    })

    socket.on("userConnceted", () => {
        console.log("User Connected");
    })

    socket.on("disconnect", function()  {
        for(let i = 0; i < spieler.length; i++) {
            if(spieler[i].name == socket.id) {
                spielerProServer[spieler[i].game - 1]--;

                delete spieler[i]
            }
        }
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

        socket.emit("addGameToServerList", data.name, data.code, password, data.status);
    });
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.get('/:code', function(req, res) {
    var data = fs.readFileSync('serverList.json');
    var newObject = JSON.parse(data);

    var gefunden = 0;

    if(newObject != null) {
        for(let i = 0; i < newObject.length; i++) {
            if(req.param('code') == newObject[i].code) {
                if(spielerProServer[newObject[i].code - 1] < 2) {
                    if(newObject[i].password.length > 0) {
                        res.sendFile(path.join(__dirname, "/public/password.html"));
                        return;
                    } else {
                        res.redirect(`${serverURL}:${PORT}/${newObject[i].code}/${newObject[i].id}`)
                        gefunden++;
                        return;
                    }
                } else {
                    res.sendFile(path.join(__dirname, "/public/toManyPlayers.html"));
                    console.log("Player: " + spielerProServer[newObject[i].code - 1]);
                    return;
                }
            }
        }
    }

    if(gefunden == 0) {
        res.sendFile(path.join(__dirname, "/public/notFound.html"));
    }
})

app.get('/:code/:id', function(req, res) {
    var data = fs.readFileSync('serverList.json');
    var newObject = JSON.parse(data);

    if(newObject != null) {
        for(let i = 0; i < newObject.length; i++) {
            if(req.param('code') == newObject[i].code) {
                if(req.param('id') == newObject[i].id) {
                    if(spielerProServer[newObject[i].code - 1] < 2) {
                        res.sendFile(path.join(__dirname, "/game/index.html"));
                        spielerProServer[newObject[i].code - 1]++;

                        newObject[i].time = 2;

                        if(spielerProServer[newObject[i].code - 1] > 1) {
                            newObject[i].status = "Closed";
                        }

                        var newData = JSON.stringify(newObject, null, 2);
                        fs.writeFile('serverList.json', newData, err => {if(err) throw err;})

                        console.log("Player: " + spielerProServer[newObject[i].code - 1]);

                        const newPlayer = {
                            "name": req.socket.id,
                            "game": newObject[i].code
                        }

                        spieler.push(newPlayer);
                        return;
                    } else {
                        res.sendFile(path.join(__dirname, "/public/toManyPlayers.html"));
                        console.log("Player: " + spielerProServer[newObject[i].code - 1]);
                        return;
                    }
                }
            }
        }
    }

    res.sendFile(path.join(__dirname, "/public/notFound.html"));
})

setInterval(function() {
    var data = fs.readFileSync('serverList.json');
    var newObject = JSON.parse(data);

    if(newObject != null) {
        for(let i = 0; i < newObject.length; i++) {
            if(spielerProServer[newObject[i].code - 1] == 0) {
                if(newObject[i].time > 0) {
                    newObject[i].time--;
                } else {
                    delete newObject[i]
                }
            }
        }

        var newJSON = [];
        if(newObject == null) {
            var newData = JSON.stringify(newJSON, null, 2);
            fs.writeFile('serverList.json', newData, err => {if(err) throw err;})
        } else {
            var newData = JSON.stringify(newObject, null, 2);
            fs.writeFile('serverList.json', newData, err => {if(err) throw err;})
        }
    }
}, 30000)