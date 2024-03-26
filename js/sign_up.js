async function init() {
    await loadUsers();
}


async function register() {
    await pushDataToUsers();
    await postData(USERS_PATH, users);
}



async function pushDataToUsers() {
    if (!users) {
        users = [];
    }
    let data = getDataFromInput();
    users.push(data);
    return users;
}

function getDataFromInput() {
    let userName = document.getElementById('name');
    let userEmail = document.getElementById('email');
    let userPassword = document.getElementById('password');
    let confirmationPassword = document.getElementById('confirmationPassword');
    let emailExists = false;

    users.forEach(function (user) {
        if (user.email === userEmail.value) {
            emailExists = true;
        }
    });

    if(!emailExists){
    if (userPassword.value === confirmationPassword.value) {
        if (users && users.length > 0) {
            userId = users.length;
        } else {
            userId = 0;
        }
        let data = { "name": userName.value, "email": userEmail.value, "password": userPassword.value, "id": userId, "contacts": "", "tasks": "" };
        return data;
    } else {
        alert("The passwords you provided do not match. Please try again.")
    }}else {
        alert("Your email is already registered.")
    }
}


async function postData(path = "/users") {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(users) // Daten im JSON-Format
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        console.log("Daten erfolgreich gesendet:", data);
    } catch (error) {
        console.error("Fehler beim Senden der Daten:", error);
    }
}



async function deleteAllUsers() {
    users = [];
    await postData(USERS_PATH, users);
}

async function deleteUser() {
    users.splice(1, 1);
    await postData(USERS_PATH, users);
}
