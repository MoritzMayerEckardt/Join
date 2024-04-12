let currentIndex;
const colors = ["#1a1a1a", "#333333", "#4d4d4d", "#666666", "#808080", "#999999", "#b3b3b3", "#cccccc", "#e6e6e6", "#1a1a8d", "#3333a1", "#4d4db5", "#6666c8", "#8080dc", "#9999f0", "#b3b3f4", "#ccccf8", "#e6e6fc", "#ffffff"];

/**
 * Initializes the contacts page by loading necessary data and rendering the UI.
 * Also sets up event listeners for user interactions.
 */
async function initContacts() {
    await includeHTML();
    await loadUsers();
    await loadCurrentUserIndex()
    await loadGuestLogin();
    addBackgroundColor(3);
    renderContactList();
    loadMobileMenu();
    showCurrentUserInButton();
    showCurrentUserInButtonMobile();
}

// **********************OPEN AND CLOSE ADD CONTACT OVERLAY**********************

/**
 * Opens the dialog to add contacts on both desktop and mobile.
 */
function openDialogAddContacts() {
    let dialog = document.getElementById('dialog-add-contacts');
    let dialogMobile = document.getElementById('dialog-add-contacts-mobile');
    dialog.classList.remove('d-none');
    dialogMobile.classList.remove('d-none')
    dialog.style.animation = 'slideInFromRight 0.250s ease-in-out';
    dialog.style.right = '0';
}


/**
 * Closes the dialog for adding contacts.
 */
function closeAddContactDialog() {
    dialog = document.getElementById('dialog-add-contacts');
    dialogMobile = document.getElementById('dialog-add-contacts-mobile');
    dialog.style.animation = 'slideOutToRight 0.250s ease-in-out';
    dialog.style.right = '-200%';
    setTimeout(() => {
        dialog.classList.add('d-none');
    }, 250);

    dialogMobile.classList.add('d-none')
}


/**
 * Prevents the default behavior of an event to stop it from closing.
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
    event.stopPropagation();
}

// **********************ADD CONTACT**********************


/**
 * Adds a new contact by pushing values to the contacts array, saving it, and rendering the updated list.
 */
async function addContact() {
    createContactsIfNotCreated();
    pushValuesToContacts();
    await postData(`${CONTACTS_PATH}`);
    clearAddContactForm();
    renderContactList();
    document.getElementById('dialog-add-contacts').classList.add('d-none');
    document.getElementById('dialog-add-contacts-mobile').classList.add('d-none');
    showConfirmation();
}

/**
 * Creates an empty contacts array if it doesn't exist.
 */
function createContactsIfNotCreated() {
    if (!contacts) {
        contacts = [];
    }
}


/**
 * Gathers input values, generates initials, and pushes the new contact object to the contacts array.
 */
function pushValuesToContacts() {
    let { name, email, phone, initials } = getValuesFromInputAddContact();
    let randomIndex = getRandomIndexFromColors();
    let color = colors[randomIndex];
    contacts.push({
        name: name,
        email: email,
        phone: phone,
        initials: initials,
        color: color,
    });
}


/**
 * Generates a random index to select a color from the predefined colors array.
 * @returns {number} A random index.
 */
function getRandomIndexFromColors() {
    return Math.floor(Math.random() * colors.length);
}


/**
 * Gets input values for adding a contact, depending on the screen width.
 * @returns {Object} An object with name, email, phone, and initials.
 */
function getValuesFromInputAddContact() {
    let { name, email, phone } = getInputElementsForContact();
    let initials = getInitialsFromName(name);
    return { name, email, phone, initials };
}


/**
 * Gets input elements for adding a contact, based on the screen width.
 * @returns {Object} An object with name, email, and phone.
 */
function getInputElementsForContact() {
    if (window.innerWidth > 1130) {
        return {
            name: document.getElementById('name-input-field-add-contact').value,
            email: document.getElementById('email-input-field-add-contact').value,
            phone: document.getElementById('phone-input-field-add-contact').value
        };
    } else {
        return {
            name: document.getElementById('name-input-field-add-contact-mobile').value,
            email: document.getElementById('email-input-field-add-contact-mobile').value,
            phone: document.getElementById('phone-input-field-add-contact-mobile').value
        };
    }
}


/**
 * Generates initials from a given name.
 * @param {string} name - The name from which to generate initials.
 * @returns {string} The generated initials.
 */
function getInitialsFromName(name) {
    let nameParts = name.split(" ");
    let firstLetters = nameParts.map(namePart => namePart.charAt(0));
    return firstLetters.join("");
}


/**
 * Sends a POST request to the specified path with the contacts data.
 * @param {string} path - The path to which to send the POST request.
 */
async function postData(path) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contacts) // Daten im JSON-Format
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log("Daten erfolgreich gesendet:", data);
    } catch (error) {
        console.error("Fehler beim Senden der Daten:", error);
    }
}


/**
 * Clears the input fields in the add contact form.
 */
function clearAddContactForm() {
    document.getElementById('name-input-field-add-contact').value = '';
    document.getElementById('email-input-field-add-contact').value = '';
    document.getElementById('phone-input-field-add-contact').value = '';
    document.getElementById('name-input-field-add-contact-mobile').value = '';
    document.getElementById('email-input-field-add-contact-mobile').value = '';
    document.getElementById('phone-input-field-add-contact-mobile').value = '';
}


/**
 * Renders the contact list by loading contacts, sorting them, and updating the UI.
 */
async function renderContactList() {
    await loadContacts();
    if (Array.isArray(contacts) && contacts.length > 0) {
        contacts.sort(sortList);
        addContactToList();
    }
    else {
        document.getElementById('list-container').innerHTML = '';
    }
}


/**
 * Sorts contacts alphabetically by name.
 * @param {Object} a - The first contact object.
 * @param {Object} b - The second contact object.
 * @returns {number} A sorting indicator (-1, 0, or 1).
 */
function sortList(a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}


/**
 * Adds each contact to the list container in the UI.
 */
function addContactToList() {
    let listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';
    let currentLetter = null;
    for (let i = 0; i < contacts.length; i++) {
        let { name, email, phone, initials, color, index, firstLetter } = getContactDetails(contacts[i], i);

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            addLetterHeaderToContainer(listContainer, currentLetter);
        }
        listContainer.innerHTML += createHtmlTemplateForList(name, email, phone, initials, index);
        setInitialsBackgroundColor(index, color);
    }
}


/**
 * Extracts details from a contact object for rendering.
 * @param {Object} contact - The contact object.
 * @param {number} index - The index of the contact.
 * @returns {Object} An object with contact details.
 */
function getContactDetails(contact, index) {
    let name = contact['name'];
    let email = contact['email'];
    let phone = contact['phone'];
    let initials = contact['initials'];
    let color = contact['color'];
    let firstLetter = name.charAt(0).toUpperCase();
    return { name, email, phone, initials, color, index, firstLetter };
}


/**
 * Sets the background color of the initials container for a contact.
 * @param {number} index - The index of the contact.
 * @param {string} color - The background color.
 */
function setInitialsBackgroundColor(index, color) {
    let initialsContainer = document.getElementById(`name-initials${index}`);
    if (initialsContainer) {
        initialsContainer.style.backgroundColor = color;
    }
}


/**
 * Adds a letter header to the list container for grouping contacts.
 * @param {HTMLElement} container - The container element.
 * @param {string} letter - The letter to display.
 */
function addLetterHeaderToContainer(container, letter) {
    container.innerHTML += `<div class="contact-letter">${letter}</div>`;
}


/**
 * Creates an HTML template for displaying a contact in the list.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initials - The contact's initials.
 * @param {number} index - The index of the contact.
 * @returns {string} The HTML template for the contact.
 */
function createHtmlTemplateForList(name, email, phone, initials, index) {
    return `
        <li class="contact-in-list" id="contact-in-list${index}" onclick="openFullCard('${name}', '${email}', '${phone}', '${initials}', ${index})">
            <div class="name-initials" id="name-initials${index}">${initials}</div>
            <div>
                <div>${name}</div>
                <div class="email-in-Contact-list">${email}</div>
            </div>
        </li>`
}


/**
 * Displays a confirmation message on successful action.
 */
function showConfirmation() {
    let slideContainer = document.getElementById('confirmation-field');
    slideContainer.classList.add('confirmation-field-active');
    setTimeout(function () {
        slideContainer.classList.remove('confirmation-field-active');
    }, 1500); // Die Gesamtdauer der Animation beträgt 1,5 Sekunden
}

// **********************SHCOW ALL DATA FROM CONTACT**********************

/**
 * Opens the full contact card view, highlights the selected contact, and shows its details.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initials - The contact's initials.
 * @param {number} index - The index of the contact.
 */
function openFullCard(name, email, phone, initials, index) {
    let showFullContact = document.getElementById('view-contact-container');
    let allContactElements = document.querySelectorAll('.contact-in-list');
    showFullContact.classList.remove('d-none');
    showFullContact.classList.add('view-contact-container-slide-in');
    currentIndex = index;
    allContactElements.forEach(function (contactElement) {
        contactElement.classList.remove('contactActive');
    });
    document.getElementById(`contact-in-list${index}`).classList.add('contactActive');
    showDataFromCurrentContact(name, email, phone, initials, index);
    showFullContactMobile();
}


/**
 * Displays the details of the current contact in the full contact card view.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initials - The contact's initials.
 * @param {number} index - The index of the contact.
 */
function showDataFromCurrentContact(name, email, phone, initials, index) {
    document.getElementById('name-initials-view-contact').innerHTML = initials;
    document.getElementById('name-view-contact').innerHTML = name;
    document.getElementById('email-view-contact').innerHTML = email;
    document.getElementById('phone-noumber-view-contact').innerHTML = phone;
    let color = contacts[index]['color'];
    let bgColorInitials = document.getElementById('name-initials-container-view-contact');
    bgColorInitials.style.backgroundColor = color;
}

/**
 * Displays the full contact card view in mobile view if screen width is  < 1080px
 */
function showFullContactMobile() {
    if (window.innerWidth < 1080) {
        document.getElementById('contacts-container').classList.add('d-none1080');
        document.getElementById('show-complete-contact-template').classList.remove('d-none1080');
    }
}

// **********************SHCOW ADD CONTACT FORM**********************

/**
 * Opens the dialog for adding contacts on both desktop and mobile.
 */
function openDialogAddContacts() {
    let dialog = document.getElementById('dialog-add-contacts');
    let dialogMobile = document.getElementById('dialog-add-contacts-mobile');
    dialog.classList.remove('d-none');
    dialogMobile.classList.remove('d-none')
    dialog.style.animation = 'slideInFromRight 0.250s ease-in-out';
    dialog.style.right = '0';
}

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