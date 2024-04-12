// **********************SHCOW EDIT CONTACT FORM**********************

/**
 * Shows the edit form for contacts on both desktop and mobile and fills the form fields with the current contact's details.
 */
function showEditForm() {
    showEditFormDesktop();
    showEditFormMobile();
    let initials = document.getElementById('name-initials-view-contact').innerHTML;
    let name = document.getElementById('name-view-contact').innerHTML;
    let email = document.getElementById('email-view-contact').innerHTML;
    let phone = document.getElementById('phone-noumber-view-contact').innerHTML;
    fillEditFormFields(initials, name, email, phone);
    document.getElementById('dialog-edit-contacts').style.animation = 'slideInFromRight 0.250s ease-in-out';
}


/**
 * Shows the edit form for contacts on desktop.
 */
function showEditFormDesktop() {
    let dialog = document.getElementById('dialog-edit-contacts');
    dialog.classList.remove('d-none');
    dialog.style.animation = 'slideInFromRight 0.250s ease-in-out';
    dialog.style.right = '0';
}


/**
 * Shows the edit form for contacts on mobile.
 */
function showEditFormMobile() {
    let dialogMobile = document.getElementById('dialog-edit-contacts-mobile');
    dialogMobile.classList.remove('d-none');
}


/**
 * Fills the edit form fields with the provided contact details.
 * @param {string} initials - The contact's initials.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 */
function fillEditFormFields(initials, name, email, phone) {
    document.getElementById('initals-field-edit-contact').innerHTML = initials;
    document.getElementById('name-input-field-edit-contact').value = name;
    document.getElementById('email-input-field-edit-contact').value = email;
    document.getElementById('phone-input-field-edit-contact').value = phone;
    // Mobile Ansicht
    document.getElementById('name-input-field-edit-contact-mobile').value = name;
    document.getElementById('email-input-field-edit-contact-mobile').value = email;
    document.getElementById('phone-input-field-edit-contact-mobile').value = phone;

    let color = document.getElementById('name-initials-container-view-contact').style.backgroundColor;
    document.getElementById('initals-field-edit-contact').style.backgroundColor = color;
}

// **********************OPEN EDIT MENU MOBILE**********************

/**
 * Shows the edit menu for contacts on mobile.
 */
function showEditMenuMobile() {
    document.getElementById('edit-menu-mobile-contacts').classList.remove('d-none');
}


/**
 * Closes the edit menu for contacts on mobile.
 */
function closeEditMenuMobile() {
    document.getElementById('edit-menu-mobile-contacts').classList.add('d-none');
}

// **********************OPEN AND CLOSE EDIT CONTACT WINDOW**********************


/**
 * Closes the dialog for editing contacts on both desktop and mobile.
 */
function closeEditContactDialog() {
    let dialog = document.getElementById('dialog-edit-contacts');
    let dialogMobile = document.getElementById('dialog-edit-contacts-mobile');
    dialog.style.animation = 'slideOutToRight 0.250s ease-in-out';
    dialog.style.right = '-200%';
    setTimeout(() => {
        dialog.classList.add('d-none');
    }, 250);
    dialogMobile.classList.add('d-none');
}

// **********************DELETE CONTACT**********************


/**
 * Deletes the current contact, updates the contact list, and closes the edit dialog.
 */
async function deleteContact() {
    contacts.splice(currentIndex, 1);
    await postData(`${CONTACTS_PATH}`);
    renderContactList();
    closeEditContactDialog();
    clearEditContact();
}


/**
 * Deletes the current contact on mobile, updates the contact list, and closes the edit menu.
 */
async function deleteContactMobile() {
    await deleteContact();
    closeContactMobile();
    closeEditMenuMobile();
}


/**
 * Closes the full contact card view in mobile view.
 */
function closeContactMobile() {
    document.getElementById('contacts-container').classList.remove('d-none1080');
    document.getElementById('show-complete-contact-template').classList.add('d-none1080');
}


/**
 * Clears the full contact card.
 */
function clearEditContact() {
    let showFullContact = document.getElementById('view-contact-container');
    showFullContact.classList.add('d-none');
}

// **********************EDIT CONTACT**********************

/**
 * Saves the edited contact details, updates the contact list, and opens the updated contact card.
 */
async function saveEditContact() {
    let contactToEdit = contacts[currentIndex];
    let { name, email, phone } = getContactInfoForEdit();
    await editAndSaveContact(contactToEdit, name, email, phone);
    renderContactList();
    closeEditContactDialog();
    openFullCard(name, email, phone, contactToEdit['initials'], currentIndex);
}


/**
 * Retrieves the edited contact details from the form fields.
 * @returns {Object} An object containing the edited contact information.
 */
function getContactInfoForEdit() {
    let name, email, phone;
    if (window.innerWidth < 1080) {
        name = document.getElementById('name-input-field-edit-contact-mobile').value;
        email = document.getElementById('email-input-field-edit-contact-mobile').value;
        phone = document.getElementById('phone-input-field-edit-contact-mobile').value;
    } else {
        name = document.getElementById('name-input-field-edit-contact').value;
        email = document.getElementById('email-input-field-edit-contact').value;
        phone = document.getElementById('phone-input-field-edit-contact').value;
    }
    return { name, email, phone };
}


/**
 * Generates initials from the given full name.
 * @param {string} name - The full name to generate initials from.
 * @returns {string} The initials of the name.
 */
function getInitialsFromName(name) {
    let nameParts = name.split(" ");
    let firstLetters = nameParts.map(namePart => namePart.charAt(0));
    return firstLetters.join("");
}


/**
 * Updates and saves the edited contact's details.
 * @param {Object} contactToEdit - The contact object to edit.
 * @param {string} name - The edited name.
 * @param {string} email - The edited email.
 * @param {string} phone - The edited phone number.
 */
async function editAndSaveContact(contactToEdit, name, email, phone) {
    let initials = getInitialsFromName(name);
    contactToEdit['name'] = name;
    contactToEdit['email'] = email;
    contactToEdit['phone'] = phone;
    contactToEdit['initials'] = initials;
    await postData(`${CONTACTS_PATH}`);
}