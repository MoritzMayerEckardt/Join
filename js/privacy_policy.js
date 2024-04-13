async function initPrivacyPolicy() {
    await includeHTML();
    await loadCurrentUserIndex(); 
    await loadTasks();
    await loadContacts();
    await loadUsers();
    await loadGuestLogin();
}

function goBack() {
    window.history.back();
  }
  