/**
 * Base URL for the Firebase Realtime Database.
 * @type {string}
 */
const BASE_URL = "https://remotestorage-346a1-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * Index of the current user.
 * @type {number}
 */
let currentUserIndex;


/**
 * Path for storing user data.
 * @type {string}
 */
const USERS_PATH = "/users";


/**
 * Path for storing task data.
 * @type {string}
 */
let TASKS_PATH;


/**
 * Path for storing contact data.
 * @type {string}
 */
let CONTACTS_PATH;


/**
 * Path for guest login data.
 * @type {string}
 */
let GUEST_LOGIN_PATH = "/guest";


/**
 * Array to store user data.
 * @type {Array}
 */
let users = [];


/**
 * Array to store task data.
 * @type {Array}
 */
let tasks = [];


/**
 * Array to store contact data.
 * @type {Array}
 */
let contacts = [];


/**
 * Guest login data.
 * @type {Object}
 */
let guest;


/**
 * Flag indicating whether the small menu is open.
 * @type {boolean}
 */
let smallMenuOpen = false;


/**
 * Flag indicating whether the small menu is open on mobile.
 * @type {boolean}
 */
let smallMenuMobileOpen = false;


/**
 * Counter for task IDs.
 * @type {number}
 */
let taskIdCounter = localStorage.getItem('taskIdCounter') ? parseInt(localStorage.getItem('taskIdCounter')) : 0;


/**
 * Array to store subtask data.
 * @type {Array}
 */
let subtaskArray = [];


/**
 * Identifier for the last clicked button.
 * @type {string}
 */
let lastClickedButton = '';


/**
 * Flag indicating whether contacts are visible.
 * @type {boolean}
 */
let contactsVisible = false;


/**
 * Flag indicating whether contacts are visible in the edit card.
 * @type {boolean}
 */
let contactsVisibleEditCard = false;


/**
 * Array to store chosen contacts.
 * @type {Array}
 */
let chosenContacts = [];


/**
 * Loads data from the specified path in the Firebase Realtime Database.
 * @param {string} path - The path to load data from.
 * @returns {Promise<Object>} - The loaded data as an object.
 */
async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseAsJson = await response.json();
}


/**
 * Posts tasks data to the specified path in the Firebase Realtime Database.
 * @param {string} path - The path to post tasks data to.
 * @returns {Promise<Object>} - The response data as an object.
 */
async function postTasks(path) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(tasks)
    });
    return responseAsJson = await response.json();
}


/**
 * Loads tasks data from the Firebase Realtime Database.
 */
async function loadTasks() {
    try {
        tasks = await loadData(TASKS_PATH);
    } catch (error) {
        console.error("Loading tasks error:", error);
    }
}


/**
 * Loads user data from the Firebase Realtime Database.
 */
async function loadUsers() {
    try {
        users = await loadData(USERS_PATH);
    } catch (error) {
        console.error("Loading users error:", error);
    }
}


/**
 * Loads guest login data from the Firebase Realtime Database.
 */
async function loadGuestLogin() {
    try {
        guest = await loadData(GUEST_LOGIN_PATH);
    } catch (error) {
        console.error("Loading guest login error:", error);
    }
}


/**
 * Loads contacts data from the Firebase Realtime Database.
 */
async function loadContacts() {
    try {
        contacts = await loadData(CONTACTS_PATH);
    } catch (error) {
        console.error("Loading contacts error:", error);
    }
}


/**
 * Loads the index of the current user from the Firebase Realtime Database.
 */
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


/**
 * Displays the initials of the current user in a button.
 */
async function showCurrentUserInButton() {
    let button = document.getElementById('userInitials');
    let currentUserInitials;
    if (currentUserIndex == 'guestLogin') {
        currentUserInitials = guest['initials']
    } else {
        currentUserInitials = users[currentUserIndex]['initials'];
    }
    button.innerHTML = currentUserInitials;
}


/**
 * Saves the task ID counter to local storage.
 */
function saveTaskIdCounter() {
    localStorage.setItem('taskIdCounter', taskIdCounter.toString());
}
