async function initLogin() {
    await loadUsers();
    setTimeout(() => {
        hideBackgroundMobile();
    }, 1500);
    setTimeout(() => {
         includeHTML();
     }, 1500);
}

function hideBackgroundMobile() {
    document.getElementById('blue-background').classList.add('d-none');
}

async function loginUser() {
    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');
    let user = users.find(user => user.email == email.value && user.password == password.value);
    if (user) {
        console.log('user id', user.id)
        currentUserId = user.id;
        await postData('/currentUserId', `${user.id}`)
        window.location.href = `summary.html?msg=successfully_logged_in`;
    } else {
        alert('Login failed. Check your username and password.')
    }
}

async function loginGuest(){
    await postData('/currentUserId', `guestLogin`)
    console.log('guest login klappt')
    window.location.href = `summary.html?msg=successfully_logged_in_as_guest`;
}

async function postData(path, currentUser) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(currentUser)
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

function forwardingToSignup(){
    window.location.href = `sign_up.html`;
}
