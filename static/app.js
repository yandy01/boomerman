import { MiniFrame } from "./src/miniframe.js";
import { Store } from './src/store.js'


const GameTitle = MiniFrame.createElement('H1', { id: "game" })
const SecHeader = MiniFrame.createElement('div', { id: "sec" })
const SecFooter = MiniFrame.createElement('div', { id: "secf" })

var timee = false
let counter = 0;
var timeractive = false

CreateForm()

// ------------------------------------------------ FONCTIONS -----------------------------------------------

function CreateForm() {
    const Title = MiniFrame.createElement('H3', { id: "title" })

    const label = MiniFrame.createElement('label', { id: "Toggle-label" })
    const err = MiniFrame.createElement('p', { id: "err" })
    const Input = MiniFrame.createElement('input', { id: "nickname", placeholder: "Enter your Nickname", type: "text" })
    const Submit = MiniFrame.createElement('input', { id: "button", type: "button", value: "Valider" })

    const Form = MiniFrame.createElement('form', { method: "post", action: "" }, [label, err, Input, Submit])

    const Contain = MiniFrame.createElement('div', {
        class: "contain",
        id: "IDContainer",
    }, [Title, Form])

    const app = MiniFrame.createElement('div', {
        class: "app",
        id: "IDapp",
    }, [SecHeader, GameTitle, Contain, SecFooter])

    MiniFrame.render(app, document.body)

    Title.textContent = "Rejoindre le jeu"
    GameTitle.textContent = "BOOMBERMAN GAME"
    err.textContent = "veuillez entrez votre pseudo SVP !"
    err.style.color = "red"
    err.style.fontStyle = "italic"
    err.style.visibility = "hidden"
}

function ClearForm() {
    const formContainer = document.querySelector('#IDapp');
    if (formContainer) {
        formContainer.remove();
    }
}



const initialState = {
    players: []
};

const store = new Store(initialState);


function UpdateRoom() {
    ClearForm();
    const Title = MiniFrame.createElement('H3', { id: "title" });
    const room = MiniFrame.createElement('div', { class: "roomPart" });
    const time = MiniFrame.createElement('p', { class: "time", id: "time" })

    const state = store.getState();
    state.players.forEach(player => {
        const playerElement = MiniFrame.createElement('div', { class: "player", id: "userList" }, player);
        room.appendChild(playerElement);
    });

    const Contain = MiniFrame.createElement('div', { class: "contain", id: "IDContainer" }, [time, Title, room]);
    const app = MiniFrame.createElement('div', { class: "app", id: "IDapp" }, [SecHeader, GameTitle, Contain, SecFooter]);
    MiniFrame.render(app, document.body);

    time.textContent = "00:20"
    Title.textContent = "-- rOOm --";
    GameTitle.textContent = "BOOMBERMAN GAME";


}

function addPlayerToStore(playerName) {
    const state = store.getState();
    const newPlayers = [...state.players, playerName];
    store.updateState({ ...state, players: newPlayers });
}


const socket = new WebSocket('ws://127.0.0.1:8080/ws');


function updateUserList(users) {
    const userList = document.querySelector('#userList');

    userList.innerHTML = '';

    users.forEach((user, index) => {
        const roomPartNumber = index + 1;
        const listItem = document.createElement('div')
        const img = document.createElement('img');
        img.classList.add("image")
        img.src = `/assets/default${roomPartNumber}.jpg`
        listItem.textContent = user;
        listItem.classList.add(`roomPart${roomPartNumber}`);
        listItem.appendChild(img);
        userList.appendChild(listItem);
    });
}


const button = document.querySelector('#button');
if (button) {
    MiniFrame.on(button, 'click', () => {
        const nicknameInput = document.querySelector('#nickname');
        const nickname = nicknameInput.value.trim();

        if (nickname !== "") {
            addPlayerToStore(nickname);

            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'playerJoined', playerName: nickname }));

            }
            UpdateRoom()

            nicknameInput.value = '';
        } else {
            const err = document.querySelector('#err');
            err.style.visibility = "visible";
        }
    });
}

socket.addEventListener('message', function (event) {
    const message = JSON.parse(event.data);
    if (message.type === 'usersUpdate') {
        updateUserList(message.users);
        if (message.users.length >= 2 && !timee) {
            timed();
        }
    } else if (message.type == "timer") {
        counter = message.level;
        if (counter >= 50) {
            // Arrêtez le timer si le niveau dépasse 50
            clearInterval(intervalID);
            console.log("Fin de l'intervalle !");
            timee = false;
        }
    }
});

function timed() {
    timee = true;
    let intervalID = setInterval(function () {
        console.log("Interval ! Counter:", counter);
        counter++;

        // Envoyer le niveau du timer au serveur à intervalles réguliers
        socket.send(JSON.stringify({ type: 'timer', level: counter }));

        if (counter >= 50) {
            clearInterval(intervalID);
            console.log("Fin de l'intervalle !");
            timee = false; // Réinitialisez timee à false lorsque le timer est terminé
            socket.send(JSON.stringify({ type: 'timerEnd' }));
        }
    }, 1000);
}

updateUserList([]);
    
    // Exemple avec setTimeout
    // setTimeout(function() {
    //     // Code à exécuter après un délai spécifié (en millisecondes)
    //     console.log("Le délai est écoulé !");
    // }, 5000); // Délai de 5000 millisecondes (5 secondes)
    
    
