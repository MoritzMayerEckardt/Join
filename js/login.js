async function initLogin() {
    await loadUsers();
    setTimeout(() => {
        includeHTML();
    }, 1500);
}