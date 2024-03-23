async function initLogin() {
    await loadUsers();
    setTimeout(() => {
        includeHTML();
    }, 1500);
}

function login() {
    window.location.href = "../summary.html";
}
