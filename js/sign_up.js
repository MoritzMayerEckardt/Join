let emailExists;
let currentUserdata;

async function initSignUp() {
    await loadUsers();
}


async function register() {
    await loadUsers();
    createUsersIfNotCreated();
    pushDataToUsers();
    await postData(USERS_PATH, users);
    emailExists = false;
    currentUserdata = '';
}

function createUsersIfNotCreated() {
    if (!users) {
        users = [];
    }
}


function pushDataToUsers() {
    getDataFromInput();
    users.push(currentUserdata);
}


function getDataFromInput() {
    let userName = document.getElementById('inputSingUpName').value;
    let userEmail = document.getElementById('inputSingUpEmail').value;
    let userPassword = document.getElementById('password').value;
    let confirmationPassword = document.getElementById('confirmationPassword').value;
    
    checkIfEmailExists(userEmail);

    if (!emailExists) {
        createJsonForUsers(userName, userEmail, userPassword, confirmationPassword)
    } else {
        alert("Your email is already registered.");
    }
}

function checkIfEmailExists(userEmail) {
    if (users && users.length > 0) {
        users.forEach(function (user) {

            if (user.email === userEmail) {
                emailExists = true;
            } 
            // else {
            //     emailExists = false;
            // }
        });
    } else {
        emailExists = false;
    }
}

function createJsonForUsers(userName, userEmail, userPassword, confirmationPassword){
    if (userPassword === confirmationPassword) {
        let userId;
        if (users && users.length > 0) {
            userId = users.length;
        } else {
            userId = 0;
        }
        currentUserdata = {
            "name": userName,
            "email": userEmail,
            "password": userPassword,
            "id": userId,
            "contacts": "",
            "tasks": ""
        };        
    } else {
        alert("The passwords you provided do not match. Please try again.");
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
        if (response.ok) {
            resetSignUpForm();
            // window.location.href = `login.html?msg=successfully_registered`;
        }

    } catch (error) {
        console.error("Fehler beim Senden der Daten:", error);
    }
}


function resetSignUpForm() {
    document.getElementById('inputSingUpName').value = '';
    document.getElementById('inputSingUpEmail').value = '';
    document.getElementById('password').value = '';
    confirmationPassword = document.getElementById('confirmationPassword').value = '';
}



async function deleteAllUsers() {
    users = [];
    await postData(USERS_PATH, users);
}

async function deleteUser() {
    users.splice(1, 1);
    await postData(USERS_PATH, users);
}
















// function getDataFromInput() {
//     let userName = document.getElementById('inputSingUpName');
//     let userEmail = document.getElementById('inputSingUpEmail');
//     let userPassword = document.getElementById('password');
//     let confirmationPassword = document.getElementById('confirmationPassword');
//     let emailExists = false;

//     users.forEach(function (user) {
//         if (user.email == userEmail.value) {
//             emailExists = true;
//         }
//     });

//     if(!emailExists){
//     if (userPassword.value === confirmationPassword.value) {
//         if (users && users.length > 0) {
//             userId = users.length;
//         } else {
//             userId = 0;
//         }
//         let data = { "name": userName.value, "email": userEmail.value, "password": userPassword.value, "id": userId, "contacts": "", "tasks": "" };
//         return data;
//     } else {
//         alert("The passwords you provided do not match. Please try again.")
//     }}else {
//         alert("Your email is already registered.")
//     }
// }