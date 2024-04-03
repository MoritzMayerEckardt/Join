async function initPrivacyPolicy() {
    await includeHTML();
    await loadCurrentUserIndex(); 
    await loadTasks();
    await loadContacts();
    await loadUsers();
    await loadGuestLogin();
    addBackgroundColor();
    showCurrentUserInButton();
}

function goBack() {
    window.history.back();
  }
  