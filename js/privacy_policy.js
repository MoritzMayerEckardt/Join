async function initPrivacyPolicy() {
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

function goBack() {
    window.history.back();
  }
  