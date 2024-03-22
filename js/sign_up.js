async function init() {
    await loadUsers();
}

async function register() {
    await pushDataToUsers();
    await postData(USERS_PATH, users);
}

function getDataFromInput() {
    let userName = document.getElementById('name');
    let userEmail = document.getElementById('email');
    let userPassword = document.getElementById('password');
    if (users && users.length > 0) {
        userId = users.length;
    } else {
        userId = 0;
    }
    let data = { "name": userName.value, "email": userEmail.value, "password": userPassword.value, "id": userId, "contacts": "", "tasks": "" };
    return data;
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
