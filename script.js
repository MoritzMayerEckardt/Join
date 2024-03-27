const BASE_URL = "https://remotestorage-346a1-default-rtdb.europe-west1.firebasedatabase.app/";
const USERS_PATH = "/users";
const TASKS_PATH = "/tasks";
const CONTACTS_PATH = "/contacts";
let currentUserId;
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











