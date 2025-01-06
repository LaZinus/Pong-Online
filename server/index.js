import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const serverURL = "http://pong";

const app = express();

var serverCode = 1;
var serverCodeList = [];
var spielerProServer = [];

var server = 0;
var spieler = 0;


app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {

    const resetServerList = []

    fs.writeFile("spieler.json", JSON.stringify(resetServerList, null, 2), err => {
        if(err) throw err;

        console.log("[Server] Spielerliste gelöscht!");
    })

    fs.writeFile("serverList.json", JSON.stringify(resetServerList, null, 2), err => {
        if(err) throw err;

        console.log("[Server] Serverliste gelöscht!");
    })

});

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500", "http://raspberrypi:5500"]
    }
});

io.on('connection', socket => {

    addGamesToServerList(socket);

    socket.on('createServer', (name, password) => {

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
            serverCodeList.push(serverCode);
            spielerProServer[serverCode - 1] = 0;
            serverCode++;
            if(serverCode == 10000) {
                serverCode = 1;
            }
            server++;
        })
        
    })

    socket.on('searchGame', (text) => {
        var data = fs.readFileSync('serverList.json');
        var server = JSON.parse(data)

        if(text != "") {
            if(text.toLowerCase() == "open") {
                for(let i = 0; i < server.length; i++) {
                    if(server[i].status == "Open") {
                        let password = false;
                        if(server[i].password.length > 0) {
                            password = true;
                        }
                        socket.emit("addGameToServerList", server[i].name, server[i].code, password, server[i].status);
                    }
                }
            } else {
                for(let i = 0; i < server.length; i++) {
                    if(server[i].name.includes(text)) {
                        let password = false;
                        if(server[i].password.length > 0) {
                            password = true;
                        }
                        socket.emit("addGameToServerList", server[i].name, server[i].code, password, server[i].status);
                    } else if (server[i].code == text) {
                        let password = false;
                        if(server[i].password.length > 0) {
                            password = true;
                        }
                        socket.emit("addGameToServerList", server[i].name, server[i].code, password, server[i].status);
                    }
                }
            }
        } else {
            addGamesToServerList(socket);
        }
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

    socket.on("playerJoined", (code, socketID) => {
        var data = fs.readFileSync('serverList.json');
        var newObject = JSON.parse(data);

        var spielerData = fs.readFileSync('spieler.json');
        var newSpielerObject = JSON.parse(spielerData);

        if(newObject != null) {
            for(let i = 0; i < newObject.length; i++) {
                if(newObject[i].code == code) {
                    spielerProServer[newObject[i].code - 1]++;

                    let playerID = 1;

                    if(newSpielerObject != null) {
                        for(let k = 0; k < newSpielerObject.length; k++) {
                            if(newSpielerObject[i].game == code) {
                                if(newSpielerObject[i].playerID == 1) {
                                    playerID = 2;
                                }
                            }
                        }
                    }

                    const newPlayer = {
                        "name": `${socketID}`,
                        "game": code,
                        "playerID": playerID,
                    }

                    newSpielerObject.push(newPlayer);

                    spieler++;

                    if(spielerProServer[newObject[i].code - 1] > 1) {
                        newObject[i].status = "Closed";
                    }

                    var newData = JSON.stringify(newObject, null, 2);
                    fs.writeFile('serverList.json', newData, err => {if(err) throw err;})

                    var newSpielerData = JSON.stringify(newSpielerObject, null, 2);
                    fs.writeFile('spieler.json', newSpielerData, err => {if(err) throw err;})
                }
            }
        }
    })

    socket.on("disconnect", function()  {
        var spielerData = fs.readFileSync('spieler.json');
        var newSpielerObject = JSON.parse(spielerData);

        var data = fs.readFileSync('serverList.json');
        var newObject = JSON.parse(data);

        if(newSpielerObject.length > 0) {
            for(let i = 0; i < newSpielerObject.length; i++) {
                if(newSpielerObject[i].name == socket.id) {
                    spielerProServer[newSpielerObject[i].game - 1]--;
                    
                    for(let k = 0; k < newObject.length; k++) {
                        if(newObject[k].code == newSpielerObject[i].game) {
                            newObject[k].status = "Open";
                        }
                    }

                    newSpielerObject.splice(i, 1);
                    spieler--;

                    if(spieler == 0) {
                        newSpielerObject = [];
                        var newSpielerData = JSON.stringify(newSpielerObject, null, 2);
                        fs.writeFile('spieler.json', newSpielerData, err => {if(err) throw err;})
                    } else {
                        var newSpielerData = JSON.stringify(newSpielerObject, null, 2);
                        fs.writeFile('spieler.json', newSpielerData, err => {if(err) throw err;})
                    }

                    var newData = JSON.stringify(newObject, null, 2);
                    fs.writeFile('serverList.json', newData, err => {if(err) throw err;})
                    
                }
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
                        newObject[i].time = 2;
                        var newData = JSON.stringify(newObject, null, 2);
                        fs.writeFile('serverList.json', newData, err => {if(err) throw err;})
                        return;
                    } else {
                        res.sendFile(path.join(__dirname, "/public/toManyPlayers.html"));
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

    var liste = [];

    if(newObject != null) {
        for(let i = 0; i < newObject.length; i++) {
            if(spielerProServer[newObject[i].code - 1] == 0) {
                if(newObject[i].time > 0) {
                    newObject[i].time--;
                } else {
                    liste.push(i);
                    server--;
                }
            }
        }

        for(let k = 0; k < liste.length; k++) {
            newObject.splice(liste[k], 1);
        }

        var newJSON = [];
        if(server == 0) {
            var newData = JSON.stringify(newJSON, null, 2);
            fs.writeFile('serverList.json', newData, err => {if(err) throw err;})
        } else {
            var newData = JSON.stringify(newObject, null, 2);
            fs.writeFile('serverList.json', newData, err => {if(err) throw err;})
        }
    }
}, 30000)