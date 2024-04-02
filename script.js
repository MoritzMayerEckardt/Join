const BASE_URL = "https://remotestorage-346a1-default-rtdb.europe-west1.firebasedatabase.app/";
let currentUserIndex;
const USERS_PATH = "/users";
let TASKS_PATH;
let CONTACTS_PATH;
let GUEST_LOGIN_PATH = "/guest";
let users = [];
let tasks = [];
let contacts = [];
let guest;
let smallMenuOpen = false;
let taskIdCounter = localStorage.getItem('taskIdCounter') ? parseInt(localStorage.getItem('taskIdCounter')) : 0;
let subtaskArray = [];
let lastClickedButton = '';
let contactsVisible = false;
let contactsVisibleEditCard = false;
let chosenContacts = [];

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseAsJson = await response.json();
}

async function postData(path) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(tasks)
    });
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

async function loadGuestLogin() {
    try {
        guest = await loadData(GUEST_LOGIN_PATH);
    } catch (error) {
        console.error("Loading guest login error:", error);
    }
}

async function loadContacts() {
    try {
        contacts = await loadData(CONTACTS_PATH);
    } catch (error) {
        console.error("Loading users error:", error);
    }
}

async function loadCurrentUserIndex() {
    try {
        currentUserIndex = await loadData('/currentUserId');
        if (currentUserIndex == 'guestLogin') {
            CONTACTS_PATH = `/guest/contacts`;
            TASKS_PATH = `/guest/tasks`;
        } else {
            CONTACTS_PATH = `/users/${currentUserIndex}/contacts`;
            TASKS_PATH = `/users/${currentUserIndex}/tasks`;
        }
    } catch (error) {
        console.error("Loading currentUserId error:", error);
    }
}

async function showCurrentUserInButton() {
    let button = document.getElementById('userInitials');
    let currentUserInitials;

    if (currentUserIndex == 'guestLogin') {
         currentUserInitials = guest['initials']
    }else{
         currentUserInitials = users[currentUserIndex]['initials'];
    }
    button.innerHTML= currentUserInitials;
}

function openSmallMenu(){
    let smallMenu = document.getElementById('smallMenu');

    if (!smallMenuOpen) {
            smallMenu.style.display = 'flex';
            smallMenuOpen = true;
    } else {
        smallMenu.style.display = 'none';
        smallMenuOpen = false;
    }
}

// Eventlistener für Klicks auf den gesamten Bildschirm
document.addEventListener('click', function(event) {
    let smallMenu = document.getElementById('smallMenu');
    let smallMenuBtn = document.getElementById('userInitials')
    let targetElement = event.target; // Das geklickte Element

    // Überprüfen, ob das geklickte Element nicht innerhalb des smallMenu liegt und ob das smallMenu geöffnet ist
    if (targetElement !== smallMenuOpen && targetElement !== smallMenuBtn) {
        // Schließe das smallMenu und setze smallMenuOpen auf false
        smallMenu.style.display = 'none';
        smallMenuOpen = false;
    }
});


function saveTaskIdCounter() {
    localStorage.setItem('taskIdCounter', taskIdCounter.toString());
}


