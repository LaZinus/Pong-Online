const socket = io('ws://raspberrypi:3500');

let createGame = false;

const hintergrund = document.createElement('div');

var selectedGame;

function CreateGame() {
    if(createGame == false) {
        const button = document.getElementById('createButton');
        button.style.boxShadow = "0 0 5px #3a3a3a"
        hintergrund.style.background = "#252525";
        hintergrund.style.width = "20rem";
        hintergrund.style.height = "25rem";
        hintergrund.style.position = "fixed";
        hintergrund.style.borderRadius = "3px";
        hintergrund.style.border = "solid #3a3a3a 2px"
        hintergrund.style.bottom = "100px";
        hintergrund.style.right = "5px";
        hintergrund.id = "createGameScreen";
        hintergrund.style.textAlign = "center";
        hintergrund.style.boxShadow = "0 0 5px #3a3a3a"
        const closeIcon = document.createElement('span');
        closeIcon.style.position = "relative"
        closeIcon.className = "material-symbols-outlined";
        closeIcon.textContent = "close";
        closeIcon.style.width = "100%";
        closeIcon.style.height = "100%";


        const closeButton = document.createElement('button');
        closeButton.style.position = "absolute";
        closeButton.className = "closeButton";
        closeButton.style.background = "#252525";
        closeButton.style.border = "solid #3a3a3a 2px";
        closeButton.style.borderRadius = "3px"
        closeButton.style.width = "1.75rem";
        closeButton.style.height = "1.75rem";
        closeButton.style.top = "5px";
        closeButton.style.right = "5px";
        closeButton.style.color = "#fff";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = function CloseScreen() {
            hintergrund.remove();
            button.style.boxShadow = "0 0 0 0";
            createGame = false;
        }


        const text1 = document.createElement('h1');
        text1.textContent = "Create Game";
        text1.style.width = "100%"
        text1.style.position = "absolute";
        text1.style.top = "25px"
        text1.style.left = "50%";
        text1.style.transform = "translateX(-50%)";
        text1.style.fontSize = "20px"
        const text2 = document.createElement('h3');
        text2.textContent = "Server Name *";
        text2.style.fontSize = "15px"
        text2.style.left = "10%"


        const nameInput = document.createElement('input');
        nameInput.style.position = "absolute";
        nameInput.style.top = "35%";
        nameInput.style.left = "50%";
        nameInput.style.transform = "translateX(-50%)";
        nameInput.style.width = "80%";
        nameInput.style.height = "35px";
        nameInput.style.background = "#252525";
        nameInput.style.border = "solid #3a3a3a 2px";
        nameInput.style.borderRadius = "3px";
        nameInput.style.outline = "none";
        nameInput.style.paddingLeft = "15px";
        nameInput.style.color = "#fff";
        nameInput.style.fontWeight = "500";
        nameInput.placeholder = "Server Name *";
        nameInput.required = "true";
        nameInput.maxLength = "25";
        nameInput.id = "createServerName";
        const text3 = document.createElement('h3');
        text3.textContent = "Server Password";
        text3.style.fontSize = "15px";
        text3.style.left = "10%";
        text3.style.top = "50%"


        const passwordInput = document.createElement('input');
        passwordInput.type = "password";
        passwordInput.style.position = "absolute";
        passwordInput.style.top = "57%";
        passwordInput.style.left = "50%";
        passwordInput.style.transform = "translateX(-50%)";
        passwordInput.style.width = "80%";
        passwordInput.style.height = "35px";
        passwordInput.style.background = "#252525";
        passwordInput.style.border = "solid #3a3a3a 2px";
        passwordInput.style.borderRadius = "3px";
        passwordInput.style.outline = "none";
        passwordInput.style.paddingLeft = "15px";
        passwordInput.style.color = "#fff";
        passwordInput.style.fontWeight = "500";
        passwordInput.placeholder = "Server Password";
        passwordInput.id = "createServerPassword"
        passwordInput.maxLength = "25";


        const createButton = document.createElement('button');
        createButton.id = "createServerButton";
        createButton.textContent = "Create Game";
        createButton.style.position = "absolute";
        createButton.style.width = "50%";
        createButton.style.height = "40px"
        createButton.style.outline = "none";
        createButton.style.border = "solid #3a3a3a 2px";
        createButton.style.borderRadius = "3px";
        createButton.style.background = "#252525";
        createButton.style.bottom = "50px";
        createButton.style.left = "50%";
        createButton.style.transform = "translateX(-50%)";
        createButton.style.color = "#fff";
        createButton.style.cursor = "pointer";
        createButton.onclick = function CreateServer() {
            if(document.getElementById('createServerName').value.toString().length > 0) {
                const name = document.getElementById('createServerName').value;
                if(document.getElementById('createServerPassword').value.toString().length > 0) {
                    const password = document.getElementById('createServerPassword').value;
                    socket.emit('createServer', name, password);
                } else {
                    socket.emit('createServer', name, "");
                }
            }
        }

        hintergrund.appendChild(closeButton);
        hintergrund.appendChild(text1);
        hintergrund.appendChild(text2);
        hintergrund.appendChild(text3);
        hintergrund.appendChild(nameInput);
        hintergrund.appendChild(passwordInput);
        hintergrund.appendChild(createButton);
        closeButton.appendChild(closeIcon)
        document.getElementById('container').appendChild(hintergrund);
        createGame = true;
    }
}

socket.on('redirectToGame', newUrl => {
    window.location = newUrl;
})

socket.on('addGameToServerList', (name, code, password, status) => {
    const tabelle = document.getElementById('serverListe');

    const tr = document.createElement('tr');

    tr.className = "serverListe";
    tr.onclick = function clickGame() {
        selectedGame = code;
    }

    const serverName = document.createElement('th');
    serverName.textContent = name;
    serverName.className = "serverNameClass";

    const serverCode = document.createElement('th');
    serverCode.textContent = code;

    const serverPassword = document.createElement('th');
    serverPassword.className = "Locked";
    const serverPasswordIcon = document.createElement('span');
    serverPasswordIcon.className = "material-symbols-outlined";

    if(password == true) {
        serverPasswordIcon.textContent = "key";
    } else {
        serverPasswordIcon.textContent = "lock_open_right";
    }

    const serverPing = document.createElement('th');
    serverPing.textContent = "2";

    const serverStatus = document.createElement('th');
    serverStatus.textContent = status;

    tr.appendChild(serverName);
    tr.appendChild(serverCode);
    serverPassword.appendChild(serverPasswordIcon);
    tr.appendChild(serverPassword);
    tr.appendChild(serverPing);
    tr.appendChild(serverStatus);
    tabelle.appendChild(tr);
})

socket.on("notFound", (code) => {
    const socketWebsite = io(`ws://raspberrypi:8080/${code}`);
    var body = document.querySelector('body');
    body.style.background = "#1c1c1c";

})

socket.on("playGamePassword", (code) => {
    const container = document.getElementById('container');

    const hintergrund = document.createElement('div');
    hintergrund.style.position = "fixed";
    hintergrund.style.top = "50%";
    hintergrund.style.left = "50%";
    hintergrund.style.transform = "translate(-50%, -50%)";
    hintergrund.style.width = "25%";
    hintergrund.style.height = "35%";
    hintergrund.style.background = "#252525";
    hintergrund.style.borderRadius = "3px";
    hintergrund.style.border = "solid #3a3a3a 2px";
    hintergrund.style.boxShadow = "0 0 5px #3a3a3a";

    const h1 = document.createElement('h1');
    h1.textContent = "Password";
    h1.style.fontSize = "30px";

    const input = document.createElement('input');
    input.style.position = "absolute";
    input.type = "password";
    input.placeholder = "Password";
    input.style.width = "75%";
    input.style.height = "3rem";
    input.style.borderRadius = "3px";
    input.style.left = "50%";
    input.style.top = "45%";
    input.style.fontSize = "20px";
    input.style.transform = "translate(-50%, -45%)";
    input.maxLength = "25";
    input.style.paddingLeft = "15px";
    input.style.paddingRight = "10px";
    input.style.outline = "none";
    input.style.border = "solid #3a3a3a 2px";
    input.style.color = "#fff";
    input.style.background = "#252525";

    const button = document.createElement('button');
    button.style.position = "absolute";
    button.textContent = "Join";
    button.style.width = "75%";
    button.style.height = "3rem";
    button.style.bottom = "15%";
    button.style.left = "50%";
    button.style.transform = "translateX(-50%)";
    button.style.outline = "none";
    button.style.background = "#252525";
    button.style.borderRadius = "3px";
    button.style.border = "solid #3a3a3a 2px"
    button.style.color = "#fff";
    button.style.fontSize = "25px";
    button.style.fontWeight = "500";
    button.style.cursor = "pointer";
    button.onclick = function () {
        socket.emit("join", code);
    }

    container.appendChild(hintergrund)
    hintergrund.appendChild(h1);
    hintergrund.appendChild(input);
    hintergrund.appendChild(button);
}) 