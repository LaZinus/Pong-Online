let createGame = false;

const hintergrund = document.createElement('div');

function CreateGame() {
    if(createGame == false) {
        const button = document.getElementById('createButton');
        button.style.boxShadow = "0 0 5px #3a3a3a";

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
        hintergrund.style.boxShadow = "0 0 5px #3a3a3a";

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
        };

        const text1 = document.createElement('h1');
        text1.textContent = "Create Game";
        text1.style.width = "100%"
        text1.style.position = "absolute";
        text1.style.top = "25px"
        text1.style.left = "50%";
        text1.style.transform = "translateX(-50%)";
        text1.style.fontSize = "20px";

        const text2 = document.createElement('h3');
        text2.textContent = "Server Name *";
        text2.style.fontSize = "15px"
        text2.style.left = "10%";

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

        const text3 = document.createElement('h3');
        text3.textContent = "Server Password";
        text3.style.fontSize = "15px";
        text3.style.left = "10%";
        text3.style.top = "50%";

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

        const createButton = document.createElement('button');
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


        hintergrund.appendChild(closeButton);
        hintergrund.appendChild(text1);
        hintergrund.appendChild(text2);
        hintergrund.appendChild(text3);
        hintergrund.appendChild(nameInput);
        hintergrund.appendChild(passwordInput);
        hintergrund.appendChild(createButton);
        closeButton.appendChild(closeIcon);

        document.getElementById('container').appendChild(hintergrund);
        createGame = true;
    }
}