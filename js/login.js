async function initLogin() {
    await loadUsers();
    // setTimeout(() => {
    //     includeHTML();
    // }, 1500);
}

function loginUser() {
    let inputEmail = document.getElementById('inputEmail');
    let inputPassword = document.getElementById('inputPassword');
    let userFound = false;

    users.forEach(function (user) {
        if (user.email == inputEmail.value && user.password == inputPassword.value) {
            userFound = true;
        }
    });

    if (userFound) {
        window.location.href = "../summary.html";
        console.log("Erfolgreich eingeloggt!");
    } else {
        alert("Ungültige E-Mail oder Passwort.");
    }
}


// // Eingegebene Login-Daten
// var inputEmail = "max@example.com";
// var inputPassword = "pass123";

// // Überprüfen, ob die eingegebenen Daten übereinstimmen
// var userFound = false;
// users.forEach(function(user) {
//   if (user.email === inputEmail && user.password === inputPassword) {
//     userFound = true;
//   }
// });

// // if-Abfrage, um zu prüfen, ob ein passender Benutzer gefunden wurde
// if (userFound) {
//     console.log("Erfolgreich eingeloggt!");
// } else {
//     console.log("Ungültige E-Mail oder Passwort.");
// }
