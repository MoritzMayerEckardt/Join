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
