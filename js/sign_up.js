let emailExists;
let currentUserdata;
let comparePasswords;
let privacyAccepted;

async function initSignUp() {
    await loadUsers();
}

async function register() {
    await loadUsers();
    createUsersIfNotCreated();
    pushDataToUsers();
    await postData(USERS_PATH, users);
    forwardingToLogin();
    resetVariables();
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
    checkIfPrivacyAccepted()

    if (privacyAccepted) {
        if (!emailExists) {
            createJsonForUsers(userName, userEmail, userPassword, confirmationPassword)
        } else {
            alert("Your email is already registered.");
        }
    } else {
        alert("Please accept the Privacy Policy to proceed with the registration.");
    }
}

function checkIfEmailExists(userEmail) {
    if (users && users.length > 0) {
        users.forEach(function (user) {

            if (user.email === userEmail) {
                emailExists = true;
            }
        });
    } else {
        emailExists = false;
    }
}


function checkIfPrivacyAccepted() {
    let privacyCheckbox = document.getElementById('checkbox-for-privacy-policy');

    if (privacyCheckbox.checked) {
        privacyAccepted = true;
    }
}

function createJsonForUsers(userName, userEmail, userPassword, confirmationPassword) {
    checkPassword(userPassword, confirmationPassword);
    if (comparePasswords) {
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

function checkPassword(userPassword, confirmationPassword) {
    if (userPassword === confirmationPassword) {
        comparePasswords = true;
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

function forwardingToLogin() {
    if (!emailExists && comparePasswords && privacyAccepted) {
        resetSignUpForm();
        window.location.href = `login.html?msg=successfully_registered`;
    }
}

function resetVariables() {
    emailExists = false;
    currentUserdata = '';
    comparePasswords = false;
    privacyAccepted = false;
}

function resetSignUpForm() {
    document.getElementById('inputSingUpName').value = '';
    document.getElementById('inputSingUpEmail').value = '';
    document.getElementById('password').value = '';
    confirmationPassword = document.getElementById('confirmationPassword').value = '';
}
