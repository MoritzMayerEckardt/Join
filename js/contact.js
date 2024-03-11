async function loadContacts() {
    try {
        contacts = await loadData(CONTACTS_PATH);
    } catch (error) {
        console.error("Loading users error:", error);
    }
}