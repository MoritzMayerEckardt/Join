/**
 * Initializes the login process by loading users, guest login data, and current user index.
 * Hides the mobile background after a delay.
 * Includes HTML files after a delay.
 */
 async function initLogin() {
    await loadUsers();
    await loadGuestLogin();
    await loadCurrentUserIndex();
    setTimeout(() => {
        hideBackgroundMobile();
    }, 1500);
    setTimeout(() => {
         includeHTML();
     }, 1500);
}
/**
 * Hides the mobile background.
 */
function hideBackgroundMobile() {
    document.getElementById('blue-background').classList.add('d-none');
}
/**
 * Logs in the user with provided email and password.
 * Redirects to the summary page if login is successful.
 * Displays an alert if login fails.
 */
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
/**
 * Logs in as a guest user.
 * Redirects to the summary page with a success message.
 */
async function loginGuest(){
    await postData('/currentUserId', 'guestLogin')
    console.log('guest login successful')
    window.location.href = `summary.html?msg=successfully_logged_in_as_guest`;
}
/**
 * Sends data to the specified path via HTTP PUT request.
 * @param {string} path - The path to send the data
 * @param {string} currentUser - The current user data to be sent
 */
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
        console.log("Data sent successfully:", data);
    } catch (error) {
        console.error("Error sending data:", error);
    }
}
/**
 * Redirects to the sign-up page.
 */
function forwardingToSignup(){
    window.location.href = `sign_up.html`;
}

