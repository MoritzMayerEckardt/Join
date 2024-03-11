const BASE_URL = "https://remotestorage-346a1-default-rtdb.europe-west1.firebasedatabase.app/";
const USERS_PATH = "/users";
const TASKS_PATH = "/tasks";
let users = [];
let tasks = [
    {
      "to_do": {
        "assigned": '',
        "category": ['User Story', 'Technical Task'],
        "date": '',
        "description": '',
        "priority": ['urgent', 'medium', 'low'],
        "title": ''
      },
      "await_feedback": {
        "assigned": '',
        "category": ['User Story', 'Technical Task'],
        "date": '',
        "description": '',
        "priority": ['urgent', 'medium', 'low'],
        "title": ''
      },
      "almost_done": {
        "assigned": '',
        "category": ['User Story', 'Technical Task'],
        "date": '',
        "description": '',
        "priority": ['urgent', 'medium', 'low'],
        "title": ''
      },
      "done": {
        "assigned": '',
        "category": ['User Story', 'Technical Task'],
        "date": '',
        "description": '',
        "priority": ['urgent', 'medium', 'low'],
        "title": ''
      }
    }
  ];
  

async function initLogin() {
    await loadUsers();
    setTimeout(() => {
        includeHTML();
    }, 1500);
}

async function loadData(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseAsJson = await response.json();
}

async function loadUsers() {
    try {
        users = await loadData(USERS_PATH);
    } catch (error) {
        console.error("Loading users error:", error);
    }
}

async function postData(path="", users={}) {
    let response = await fetch(BASE_URL + path + ".json",{
        method: "PUT",
        header: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(users)
    });
    return responseAsJson = await response.json();
}

function getDataFromInput() {
    let userName= document.getElementById('name');
    let userEmail = document.getElementById('email');
    let userPassword = document.getElementById('password');
    let userId;
    if (users && users.length > 0) {
        userId = users.length;
    } else {
        userId = 0;
    }
    let data = {"name": userName.value, "email": userEmail.value, "password": userPassword.value, "id": userId};
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







