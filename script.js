const BASE_URL = "https://remotestorage-346a1-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];

async function init() {
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
        users = await loadData("/users");
    } catch (error) {
        console.error("Loading users error:", error);
    }
}

async function postData(path="", data={}) {
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
    let userId = users.length;
    let data = {"name": userName.value, "email": userEmail.value, "password": userPassword.value, "id": userId};
    return data;
}

async function register() {
    let data = getDataFromInput();
    users.push(data);
    await postData("/users/", users);
}




