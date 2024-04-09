async function initLegalNotice() {
    await includeHTML();
    await loadCurrentUserIndex(); 
    await loadTasks();
    await loadContacts();
    await loadUsers();
    await loadGuestLogin();
    addBackgroundColor();
    showCurrentUserInButton();
    showCurrentUserInButtonMobile();
}