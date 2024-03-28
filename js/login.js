async function initLogin() {
    await loadUsers();
    // setTimeout(() => {
    //     includeHTML();
    // }, 1500);
}

async function loginUser() {
    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');
    let user = users.find(user => user.email == email.value && user.password == password.value);

    if (user) {
        console.log('user id', user.id)
        currentUserId = user.id;
        await postData('/currentUserId', `${user.id}`)
        window.location.href = `contacts.html?msg=successfully_logged_in`;
    } else {
        alert('Login failed. Check your username and password.')
    }
}

async function loginGuest(){
    await postData('/currentUserId', `guestLogin`)
    console.log('guest login klappt')
    window.location.href = `contacts.html?msg=successfully_logged_in_as`;
}

async function postData(path, currentUser) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(currentUser) // Daten im JSON-Format
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
