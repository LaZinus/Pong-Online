function createServer(name, code, password, ping, country, status) {
    const serverListe = document.getElementById('serverListe');

    const tr = document.createElement('tr');
    tr.className = "serverListe";

    const serverName = document.createElement('th');
    serverName.className = "serverNameClass";
    serverName.textContent = name;

    const serverCode = document.createElement('th');
    serverCode.textContent = code;

    const serverPassword = document.createElement('th');
    serverPassword.className = "Locked";

    const serverPasswordIcon = document.createElement('span');
    serverPasswordIcon.className = "material-symbols-outlined";

    if(password > 0) {
        serverPasswordIcon.textContent = "key";
    } else {
        serverPasswordIcon.textContent = "lock_open_right";
    }

    const serverPing = document.createElement('th');
    serverPing.textContent = ping;

    const serverCountry = document.createElement('th');
    serverCountry = country;

    const serverStatus = document.createElement('th');
    serverStatus.textContent = status;

    serverListe.appendChild(tr);
    tr.appendChild(serverName);
    tr.appendChild(serverCode);
    tr.appendChild(serverPassword);
    serverPassword.appendChild(serverPasswordIcon);
    tr.appendChild(serverPing);
    tr.appendChild(serverCountry);
    tr.appendChild(serverStatus);
}