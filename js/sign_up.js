/**
 * Indicates whether the email already exists.
 * @type {boolean}
 */
 let emailExists;
 /**
  * Stores data of the current user during sign-up.
  */
 let currentUserdata;
 /**
  * Compares passwords during sign-up.
  */
 let comparePasswords;
 /**
  * Indicates whether the privacy policy is accepted during sign-up.
  * @type {boolean}
  */
 let privacyAccepted;
 /**
  * Initializes the sign-up process by loading user data.
  */
 async function initSignUp() {
     await loadUsers();
 }
 /**
  * Registers a new user.
  */
 async function register() {
     await loadUsers();
     createUsersIfNotCreated();
     pushDataToUsers();
     await postData(USERS_PATH);
     forwardingToLogin();
     resetVariables();
 }


 /**
  * Creates users array if not already created.
  */
 function createUsersIfNotCreated() {
     if (!users) {
         users = [];
     }
 }


 /**
  * Pushes data of the current user to the users array.
  */
 function pushDataToUsers() {
     getDataFromInput();
     users.push(currentUserdata);
 }


 /**
  * Retrieves data from sign-up form inputs.
  */
 function getDataFromInput() {
    let userName = document.getElementById('inputSingUpName').value;
    let userEmail = document.getElementById('inputSingUpEmail').value;
    let userPassword = document.getElementById('password').value;
    let confirmationPassword = document.getElementById('confirmationPassword').value;
    let initials = getInitials(userName);
    checkIfEmailExists(userEmail);

    if (!emailExists) {
        createJsonForUsers(userName, userEmail, userPassword, confirmationPassword, initials);
    } else {
        alert("Your email is already registered.");
    }
}


 /**
  * Retrieves initials from a given name.
  * @param {string} userName - The user's name
  * @returns {string} - The initials of the user's name
  */
 function getInitials(userName) {
     // Split the name into words
     const words = userName.split(' ');
     // Store initials
     let initials = '';
     // Iterate through each word
     words.forEach(word => {
         // Add the first letter of the word to initials
         initials += word.charAt(0);
     });
     console.log(initials);  // Output: "MM"
     // Return initials (in uppercase)
     return initials.toUpperCase();
 }


 /**
  * Checks if the provided email already exists in the users' database.
  * @param {string} userEmail - The email to be checked
  */
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

 function checkAllFieldsFilled() {
    let form = document.getElementById('login-form');
    let signUpButton = document.getElementById('sign-up-button');
    if (form.checkValidity()) {
        signUpButton.disabled = false;
    } else {
        signUpButton.disabled = true;
    }
}

/**
 * Creates JSON data for a new user based on provided information.
 * @param {string} userName - The name of the new user
 * @param {string} userEmail - The email of the new user
 * @param {string} userPassword - The password of the new user
 * @param {string} confirmationPassword - The confirmation password of the new user
 * @param {string} initials - The initials of the new user
 */
function createJsonForUsers(userName, userEmail, userPassword, confirmationPassword, initials) {
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
            "initials": initials,
            "email": userEmail,
            "password": userPassword,
            "id": userId,
            "contacts": "",
            "tasks": "",
        };
    } else {
        alert("The passwords you provided do not match. Please try again.");
    }
}


/**
 * Checks if the provided password and confirmation password match.
 * Sets the comparePasswords variable accordingly.
 * @param {string} userPassword - The password provided by the user
 * @param {string} confirmationPassword - The confirmation password provided by the user
 */
function checkPassword(userPassword, confirmationPassword) {
    if (userPassword === confirmationPassword) {
        comparePasswords = true;
    }
}


/**
 * Sends user data to the specified path via HTTP PUT request.
 * @param {string} path - The path to send the data
 */
async function postData(path) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(users) // Data in JSON format
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log("Data sent successfully:", data);
    } catch (error) {
        console.error("Error sending data:", error);
    }
}


/**
 * Redirects to the login page if conditions are met, and displays a success message.
 */
 function forwardingToLogin() {
    if (!emailExists && comparePasswords) {
        showSuccessfullySignedUpMessage();
        setTimeout(() => {
            resetSignUpForm();
            window.location.href = `index.html?msg=successfully_registered`;
        }, 2000);
    }
}


/**
 * Displays a success message after successful sign-up.
 */
function showSuccessfullySignedUpMessage() {
    document.getElementById("signUpBody").style.overflow = 'hidden';
    const successMessage = document.getElementById('successfully-signed-up-message');
    successMessage.style.display = 'flex';
    setTimeout(() => {
        successMessage.style.display = 'none';
        document.getElementById("signUpBody").style.overflow = 'visible';
    }, 2000);
}


/**
 * Resets the sign-up related variables.
 */
function resetVariables() {
    emailExists = false;
    currentUserdata = '';
    comparePasswords = false;
    privacyAccepted = false;
}


/**
 * Resets the sign-up form by clearing input fields.
 */
function resetSignUpForm() {
    document.getElementById('inputSingUpName').value = '';
    document.getElementById('inputSingUpEmail').value = '';
    document.getElementById('password').value = '';
    confirmationPassword = document.getElementById('confirmationPassword').value = '';
}
