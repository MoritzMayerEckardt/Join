// **********************ASSIGNED CONTAINER ADD-TASK-TEMPLATE**********************

/**
 * Toggles the visibility of the assigned contacts container in the task creation form in the template view.
 * If contacts are visible, hides the contacts container and displays the initials.
 * If contacts are hidden, shows the contacts container and hides the initials.
 */
function toggleAssignedContainer(event) {
    if (contactsVisible) {
        hideContacts(event);
    } else {
        showAssignedContacts();
    }
    event.stopPropagation();
}


/**
 * Hides the assigned contacts container and displays the initials.
 * Resets the style and content of the contacts container.
 * Sets the contactsVisible flag to false.
 * Rotates the dropdown arrow icon to its default position.
 * @param {HTMLElement} showContacts - The container element for assigned contacts.
 * @param {HTMLElement} arrowImage - The dropdown arrow icon element.
 * @param {HTMLElement} initialDIV - The container element for initials.
 */
function hideContacts(event) {
    if (event.target.closest('#show-assigned-contacts')) {
        return;
    }
    document.getElementById('assigned-template').style.borderColor = '#D1D1D1';
    let showContacts = document.getElementById('show-assigned-contacts');
    let arrowImage = document.getElementById('dropdown-arrow');
    let initialDIV = document.getElementById('show-chosen-initials'); 
    showContacts.style.border = 'none';
    showContacts.innerHTML = '';
    contactsVisible = false;
    arrowImage.style.transform = 'rotate(0deg)';
    initialDIV.style.display = 'flex';
}


/**
 * Shows the assigned contacts container and hides the initials.
 * Sets the style for the contacts container and populates it with contacts.
 * Sets the contactsVisible flag to true.
 * Rotates the dropdown arrow icon to indicate visibility.
 * @param {HTMLElement} showContacts - The container element for assigned contacts.
 * @param {HTMLElement} arrowImage - The dropdown arrow icon element.
 * @param {HTMLElement} initialDIV - The container element for initials.
 */
function showAssignedContacts() {
    let showContacts = document.getElementById('show-assigned-contacts');
    let arrowImage = document.getElementById('dropdown-arrow');
    let initialDIV = document.getElementById('show-chosen-initials');
    document.getElementById('assigned-template').style.borderColor = '#29abe2';
    showContacts.style.border = '1px solid lightgrey';
    showContactsForAssign(event);
    contactsVisible = true;
    arrowImage.style.transform = 'rotate(180deg)';
    initialDIV.style.display = 'none';
}


/**
 * Populates the assigned contacts container with contacts for selection in the task creation form.
 * Generates HTML elements for each contact and appends them to the container.
 */
function showContactsForAssign() {
    let showContacts = document.getElementById('show-assigned-contacts');
    showContacts.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        showContacts.innerHTML += /*html*/`
        <div id="newcontact${i}" class="new-contact" onclick="handleContactClick(contactElement, ${i})">
            <div class="circle" style="background-color: ${contact.color};">
                <p>${contact.initials}</p>
            </div>
            <div class="nameAndCheckbox">    
                <p class="contactName">${contact.name}</p>
                <input type="checkbox" id="checkbox${i}" class="checkBox">
            </div> 
        </div>`;
    }
    chosenContact();
}


/**
 * Handles click events on contact elements in the assigned contacts container.
 * Toggles the selection state of the clicked contact.
 * Updates the UI to reflect the selected contacts.
 * @param {HTMLElement} contactElement - The clicked contact element.
 * @param {number} i - The index of the clicked contact.
 */
function handleContactClick(contactElement, i) {
    let currentBackgroundColor = getCurrentBackgroundColor(contactElement);
    if (currentBackgroundColor === 'rgb(42, 54, 71)') {
        resetContact(contactElement, i);
    } else {
        selectContact(contactElement, i);
    }
    showChosenInitials();
}


/**
 * Retrieves the current background color of a contact element.
 * @param {HTMLElement} contactElement - The contact element to retrieve the background color from.
 * @returns {string} - The current background color of the contact element.
 */
function getCurrentBackgroundColor(contactElement) {
    return window.getComputedStyle(contactElement).getPropertyValue('background-color');
}


/**
 * Resets the selection state of a contact element.
 * Removes the background color and selection indicator.
 * @param {HTMLElement} contactElement - The contact element to reset.
 * @param {number} i - The index of the contact.
 */
function resetContact(contactElement, i) {
    contactElement.style.backgroundColor = '';
    contactElement.style.color = 'black';
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = false;
    removeChosenContact(contacts[i]);
}


/**
 * Selects a contact element and updates its selection state.
 * Sets the background color and selection indicator.
 * @param {HTMLElement} contactElement - The contact element to select.
 * @param {number} i - The index of the contact.
 */
function selectContact(contactElement, i) {
    contactElement.style.backgroundColor = 'rgb(42, 54, 71)';
    contactElement.style.color = 'white';
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = true;
    addChosenContact(contacts[i]);
}


/**
 * Adds a selected contact to the chosenContacts array if it doesn't already exist.
 * @param {object} contact - The selected contact object to add.
 */
function addChosenContact(contact) {
    let index = chosenContacts.findIndex(c => c.name === contact.name);
    if (index === -1) {
        chosenContacts.push(contact);
    }
}


/**
 * Removes a deselected contact from the chosenContacts array.
 * @param {object} contact - The deselected contact object to remove.
 */
function removeChosenContact(contact) {
    let index = chosenContacts.findIndex(c => c.name === contact.name);
    if (index !== -1) {
        chosenContacts.splice(index, 1);
    }
}


/**
 * Initializes the UI for chosen contacts based on the current selection state.
 * Updates the UI to reflect previously selected contacts.
 */
function chosenContact() {
    for (let i = 0; i < contacts.length; i++) {
        let contactElement = document.getElementById(`newcontact${i}`);
        contactElement.style.backgroundColor = '';
        contactElement.onclick = function() {
            handleContactClick(contactElement, i);
        };
        checkedContactStaysChecked(contactElement, i);
    }
}


/**
 * Ensures that selected contacts remain selected when the UI is refreshed.
 * Updates the UI to reflect previously selected contacts.
 * @param {HTMLElement} contactElement - The contact element to check.
 * @param {number} i - The index of the contact.
 */
function checkedContactStaysChecked(contactElement, i) {
    if (chosenContacts.findIndex(c => c.name === contacts[i].name) !== -1) {
        contactElement.style.backgroundColor = '#2A3647';
        contactElement.style.color = 'white';
        let checkbox = contactElement.querySelector('.checkBox');
        checkbox.checked = true;
    }
}


/**
 * Renders the chosen initials of selected contacts below the assigned contacts container.
 * Updates the UI to display the initials of selected contacts.
 */
function showChosenInitials() {
    let showChosenInitials = document.getElementById('show-chosen-initials');
    showChosenInitials.innerHTML = '';
    chosenContacts.forEach(contact => {
        if (chosenContacts.includes(contact)) {
            showChosenInitials.innerHTML += `
            <div class="circleSmall" style="background-color: ${contact.color}; color: white">
                <p>${contact.initials}</p>
            </div>`;
        } else {
            showChosenInitials.innerHTML += ``;
        }
    });
}