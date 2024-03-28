const BASE_URL = "https://remotestorage-346a1-default-rtdb.europe-west1.firebasedatabase.app/";
let currentUserIndex;
const USERS_PATH = "/users";
let TASKS_PATH;
let CONTACTS_PATH;
let users = [];
let tasks = [];
let contacts = [];

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

async function loadCurrentUserIndex() {
    try {
        currentUserIndex = await loadData('/currentUserId');
        if (currentUserIndex == 'guestLogin') {
            CONTACTS_PATH = `/guest/contacts`;
        } else {
            CONTACTS_PATH = `/users/${currentUserIndex}/contacts`;
            TASKS_PATH = `/users/${currentUserIndex}/tasks`;
        }
    } catch (error) {
        console.error("Loading currentUserId error:", error);
    }
}



