const BASE_URL = "https://remotestorage-346a1-default-rtdb.europe-west1.firebasedatabase.app/";
const USERS_PATH = "/users";
const TASKS_PATH = "/tasks";
const CONTACTS_PATH = "/contacts";
let users = [];
let tasks = [];
let contacts = [];
let subtaskArray = [];

async function initLogin() {
    await loadUsers();
    setTimeout(() => {
        includeHTML();
    }, 1500);
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseAsJson = await response.json();
}

async function loadTasks() {
    try {
        tasks = await loadData(TASKS_PATH);
    } catch (error) {
        console.error("Loading users error:", error);
    }
}

async function loadUsers() {
    try {
        users = await loadData(USERS_PATH);
    } catch (error) {
        console.error("Loading users error:", error);
    }
}

async function loadContacts() {
    try {
        contacts = await loadData(CONTACTS_PATH);
    } catch (error) {
        console.error("Loading users error:", error);
    }
}

async function postData(path = "", users = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(users)
    });
    return responseAsJson = await response.json();
}

function getDataFromInput() {
    let userName = document.getElementById('name');
    let userEmail = document.getElementById('email');
    let userPassword = document.getElementById('password');
    let userId;
    if (users && users.length > 0) {
        userId = users.length;
    } else {
        userId = 0;
    }
    let data = { "name": userName.value, "email": userEmail.value, "password": userPassword.value, "id": userId };
    return data;
}

async function register() {
    await pushDataToUsers();
    await postData(USERS_PATH, users);
}

async function pushDataToUsers() {
    let data = getDataFromInput();
    if (!users) {
        users = [];
    }
    users.push(data);
    return users;
}

async function deleteAllUsers() {
    users = [];
    await postData(USERS_PATH, users);
}

async function deleteUser() {
    users.splice(1, 1);
    await postData(USERS_PATH, users);
}

function addNewSubtask() {
    let addNewSubtask = document.getElementById('subtasks').value;

    if (subtaskArray.length < 2) {
        subtaskArray.push(addNewSubtask);
        getNewSubtask();
    } else {
        alert("You can only add a maximum of two subtasks.");
    }
}



function getNewSubtask() {
    console.log("getNewSubtask() wird aufgerufen")
    let newSubtask = document.getElementById('newSubtask');

    newSubtask.innerHTML = ``;

    for (i = 0; i < subtaskArray.length; i++) {
        newSubtask.innerHTML += `
        <div> 
             <b> •${subtaskArray[i]} </b> 
         </div>`

    }

    document.getElementById('subtasks').value = ``;
}

function clearForm() {

    document.getElementById('title').value = ""; // Titel löschen
    document.getElementById('description').value = ""; // Beschreibung löschen
    document.getElementById('assigned').selectedIndex = 0; // Auswahl zurücksetzen
    document.getElementById('date').value = ""; // Datum löschen
    document.getElementById('category').selectedIndex = 0; // Auswahl zurücksetzen
    document.getElementById('subtasks').value = ""; // Subtasks löschen
    subtaskArray = []; // Subtask-Array leeren
    getNewSubtask(); // Anzeige der Subtasks aktualisieren

}








