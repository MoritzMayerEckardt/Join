/**
 * Toggles the visibility of the assigned contacts container in the task edit card.
 * If contacts are visible, hides the contacts container and displays the initials.
 * If contacts are hidden, shows the contacts container and hides the initials.
 */
function toggleAssignedContainerEditCard(event) {
    if (contactsVisibleEditCard) {
        hideContactsEditCard(event);
    } else {
        showAssignedContactsEditCard();
    }
    event.stopPropagation();
}


/**
 * Generates and displays the chosen contacts in the edit card.
 * Updates the UI to reflect the selected contacts.
 * @param {HTMLElement} assignedContacts - The container element for assigned contacts.
 */
function generateChosenContactsEditCard(assignedContacts) {
    assignedContacts.innerHTML = '';
    if (chosenContacts.length === 0) {
        assignedContacts.innerHTML = renderNoContactsAssignedHTML();
    } else {
        for (let index = 0; index < chosenContacts.length; index++) {
            const contact = chosenContacts[index];
            assignedContacts.innerHTML += renderAssignedContactsInEditCardHTML(contact);
        }
    }
}


/**
 * Hides the assigned contacts container and displays the initials.
 * Updates the UI to reflect the selected contacts.
 * @param {HTMLElement} showContacts - The container element for chosen initials.
 * @param {HTMLElement} arrowImage - The dropdown arrow icon element.
 * @param {HTMLElement} assignedContacts - The container element for assigned contacts.
 */
function hideContactsEditCard(event) {
    if (event.target.closest('#show-chosen-initials-edit-card')) {
        return;
    }
    let showContacts = document.getElementById('show-chosen-initials-edit-card');
    let arrowImage = document.getElementById('dropdown-arrow-edit-card');
    let assignedContacts = document.getElementById('show-assigned-contacts-edit-card');
    showContacts.style.display = 'none';
    showContacts.innerHTML = '';
    assignedContacts.style.display = 'block';
    generateChosenContactsEditCard(assignedContacts);
    contactsVisibleEditCard = false;
    arrowImage.style.transform = 'rotate(0deg)';
    document.getElementById('assigned-edit-card').style.borderColor = '#D1D1D1';
}


/**
 * Shows the assigned contacts container and hides the initials.
 * Updates the UI to reflect the selected contacts.
 * @param {HTMLElement} showContacts - The container element for chosen initials.
 * @param {HTMLElement} arrowImage - The dropdown arrow icon element.
 * @param {HTMLElement} assignedContacts - The container element for assigned contacts.
 */
function showAssignedContactsEditCard() {
    let showContacts = document.getElementById('show-chosen-initials-edit-card');
    let arrowImage = document.getElementById('dropdown-arrow-edit-card');
    let assignedContacts = document.getElementById('show-assigned-contacts-edit-card');
    showContacts.style.border = '1px solid lightgrey';
    showContacts.style.display = 'block'
    assignedContacts.style.display = 'none'
    showContactsForAssignEditCard();
    contactsVisibleEditCard = true;
    arrowImage.style.transform = 'rotate(180deg)';
    document.getElementById('assigned-edit-card').style.borderColor = '#29abe2';
}


/**
 * Populates the assigned contacts container with contacts for selection in the task edit card.
 * Generates HTML elements for each contact and appends them to the container.
 */
function showContactsForAssignEditCard() {
    let showContacts = document.getElementById('show-chosen-initials-edit-card');
    showContacts.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        showContacts.innerHTML += /*html*/`
        <div id="newcontact-edit-card${i}" class="new-contact" onclick="handleContactClickEdit(contactElement, ${i})">
            <div class="circle" style="background-color: ${contact.color};">
                <p>${contact.initials}</p>
            </div>
            <div class="nameAndCheckbox">    
                <p class="contactName">${contact.name}</p>
                <input type="checkbox" id="checkbox-edit-card${i}" class="checkBox">
            </div> 
        </div>`;
    }
    chosenContactEditCard();
}


/**
 * Handles click events on contact elements in the assigned contacts container of the edit card.
 * Toggles the selection state of the clicked contact.
 * Updates the UI to reflect the selected contacts.
 * @param {HTMLElement} contactElement - The clicked contact element.
 * @param {number} i - The index of the clicked contact.
 */
function handleContactClickEditCard(contactElement, i) {
    let currentBackgroundColor = getCurrentBackgroundColorEditCard(contactElement);
    if (currentBackgroundColor === 'rgb(42, 54, 71)') {
        resetContactEditCard(contactElement, i);
    } else {
        selectContactEditCard(contactElement, i);
    }
}


/**
 * Retrieves the current background color of a contact element in the edit card.
 * @param {HTMLElement} contactElement - The contact element to retrieve the background color from.
 * @returns {string} - The current background color of the contact element.
 */
function getCurrentBackgroundColorEditCard(contactElement) {
    return window.getComputedStyle(contactElement).getPropertyValue('background-color');
}


/**
 * Resets the selection state of a contact element in the edit card.
 * Removes the background color and selection indicator.
 * @param {HTMLElement} contactElement - The contact element to reset.
 * @param {number} i - The index of the contact.
 */
function resetContactEditCard(contactElement, i) {
    contactElement.style.backgroundColor = '';
    contactElement.style.color = 'black';
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = false;
    removeChosenContactEditCard(contacts[i]);
}


/**
 * Selects a contact element in the edit card and updates its selection state.
 * Sets the background color and selection indicator.
 * @param {HTMLElement} contactElement - The contact element to select.
 * @param {number} i - The index of the contact.
 */
function selectContactEditCard(contactElement, i) {
    contactElement.style.backgroundColor = 'rgb(42, 54, 71)';
    contactElement.style.color = 'white';
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = true;
    addChosenContactEditCard(contacts[i]);
}


/**
 * Adds a selected contact to the chosenContacts array in the edit card if it doesn't already exist.
 * @param {object} contact - The selected contact object to add.
 */
function addChosenContactEditCard(contact) {
    let index = chosenContacts.findIndex(c => c.name === contact.name);
    if (index === -1) {
        chosenContacts.push(contact);
    }
}


/**
 * Removes a deselected contact from the chosenContacts array in the edit card.
 * @param {object} contact - The deselected contact object to remove.
 */
function removeChosenContactEditCard(contact) {
    let index = chosenContacts.findIndex(c => c.name === contact.name);
    if (index !== -1) {
        chosenContacts.splice(index, 1);
    }
}


/**
 * Initializes the UI for chosen contacts in the edit card based on the current selection state.
 * Updates the UI to display previously selected contacts.
 */
function chosenContactEditCard() {
    for (let i = 0; i < contacts.length; i++) {
        let contactElement = document.getElementById(`newcontact-edit-card${i}`);
        contactElement.style.backgroundColor = '';
        contactElement.onclick = function() {
            handleContactClickEditCard(contactElement, i);
        };
        checkedContactStaysCheckedEditCard(contactElement, i);
    }
}


/**
 * Ensures that previously selected contacts remain visually selected in the edit card.
 * Updates the UI to display previously selected contacts.
 * @param {HTMLElement} contactElement - The contact element to check and update.
 * @param {number} i - The index of the contact.
 */
function checkedContactStaysCheckedEditCard(contactElement, i) {
    if (chosenContacts.findIndex(c => c.name === contacts[i].name) !== -1) {
        contactElement.style.backgroundColor = '#2A3647';
        contactElement.style.color = 'white';
        let checkbox = contactElement.querySelector('.checkBox');
        checkbox.checked = true;
    }
}
