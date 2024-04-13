/**
 * Initializes the legal notice page by loading necessary content.
 * @returns {Promise<void>} A promise that resolves once all content is loaded.
 */
async function initLegalNotice() {
    await includeHTML();
    await loadCurrentUserIndex(); 
    await loadTasks();
    await loadContacts();
    await loadUsers();
    await loadGuestLogin();
}
