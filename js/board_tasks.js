// **********************CLEAR TEMPLATE**********************

function clearFormInTemplate() {
    document.getElementById('title-template').value = ""; 
    document.getElementById('description-template').value = ""; 
    document.getElementById('assigned-template').selectedIndex = 0; 
    document.getElementById('date-template').value = "";
    document.getElementById('category-template').selectedIndex = 0;
    document.getElementById('subtasks-template').value = "";
    subtaskArray = [];
    getNewSubtaskInTemplate();
}


// **********************TOGGLE STYLE OF PRIORITY BUTTONS**********************

function resetButtonStyles() {
    resetUrgentButton();
    resetMediumButton();
    resetArrows();
    resetLowButton();
}

function resetUrgentButton() {
    let urgentButton = document.getElementById('urgentButton');
    urgentButton.style.backgroundColor = '';
    urgentButton.style.color = '';
}

function resetMediumButton() {
    let mediumButton = document.getElementById('mediumButton');
    let mediumButtonText = document.getElementById('mediumText');
    let prioMedium = document.getElementById('prioMedium');
    mediumButton.style.backgroundColor = '';
    mediumButton.style.color = '';
    mediumButtonText.style.fontWeight = '';
    prioMedium.style.display = '';
}

function resetArrows() {
    let redArrow = document.getElementById('redArrow');
    let greenArrow = document.getElementById('greenArrow');
    let whiteArrow = document.getElementById('whiteArrow');
    let whiteArrowLow = document.getElementById('whiteArrowLow');
    redArrow.style.display = '';
    whiteArrow.style.display = '';
    greenArrow.style.display = '';
    whiteArrowLow.style.display = '';
}

function resetLowButton() {
    let lowButton = document.getElementById('lowButton');
    lowButton.style.backgroundColor = '';
    lowButton.style.color = '';
}

function changeBackgroundColor(clickedButton) {
    if (clickedButton === 'urgent') {
        changeBackgroundColorRedButton();
    } else if (clickedButton === 'medium') {
        changeBackgroundColorYellowButton();
    } else if (clickedButton === 'low') {
        changeBackgroundColorGreenButton();
    }
    lastClickedButton = clickedButton;
}

function changeBackgroundColorRedButton() {
    let {mediumButton, urgentButton, urgentArrow, mediumArrow, lowButton, lowArrow} = getVariablesForPriorityButtons();
    urgentButton.style.backgroundColor = 'rgba(255, 61, 0, 1)';
    urgentButton.style.color = 'white';
    urgentButton.style.fontWeight = '700';
    mediumButton.style.backgroundColor = 'white';
    mediumButton.style.color = 'black';
    mediumButton.style.fontWeight = '400';
    lowButton.style.fontWeight = '400';
    urgentArrow.setAttribute('src', '../assets/img/prioUrgent.svg');
    mediumArrow.setAttribute('src', '../assets/img/prio_medium.svg');
    lowButton.style.backgroundColor = 'white';
    lowButton.style.color = 'black';
    lowArrow.setAttribute('src', '../assets/img/greenArrow.svg');
}

function changeBackgroundColorYellowButton() {
    let {mediumButton, urgentButton, urgentArrow, mediumArrow, lowButton, lowArrow} = getVariablesForPriorityButtons();
    mediumButton.style.backgroundColor = 'rgba(255, 168, 0, 1)';
    mediumButton.style.color = 'white';
    urgentButton.style.backgroundColor = 'white';
    urgentButton.style.color = 'black';
    urgentButton.style.fontWeight = '400';
    lowButton.style.fontWeight = '400';
    urgentArrow.setAttribute('src', '../assets/img/redArrow.svg');
    mediumArrow.setAttribute('src', '../assets/img/hypen.svg');
    lowButton.style.backgroundColor = 'white';
    lowButton.style.color = 'black';
    lowArrow.setAttribute('src', '../assets/img/greenArrow.svg');
    mediumButton.style.fontWeight = '700';
}

function changeBackgroundColorGreenButton() {
    let {mediumButton, urgentButton, urgentArrow, mediumArrow, lowButton, lowArrow} = getVariablesForPriorityButtons();
    lowButton.style.backgroundColor = 'rgb(122, 226, 41)';
    lowButton.style.color = 'white';
    lowArrow.setAttribute('src', '../assets/img/prioLow.svg');
    urgentArrow.setAttribute('src', '../assets/img/redArrow.svg');
    mediumArrow.setAttribute('src', '../assets/img/prio_medium.svg');
    urgentButton.style.backgroundColor = 'white';
    urgentButton.style.color = 'black';
    mediumButton.style.backgroundColor = 'white';
    mediumButton.style.color = 'black';
    urgentButton.style.fontWeight = '400';
    mediumButton.style.fontWeight = '400';
    lowButton.style.fontWeight = '700';
}

function getVariablesForPriorityButtons() {
    let mediumButton = document.getElementById('btn-medium');
    let urgentButton = document.getElementById('btn-urgent');
    let urgentArrow = document.getElementById('img-urgent-btn');
    let mediumArrow = document.getElementById('img-medium-btn');
    let lowButton = document.getElementById('btn-low');
    let lowArrow = document.getElementById('img-low-btn');
    return {mediumButton, urgentButton, urgentArrow, mediumArrow, lowButton, lowArrow}
}


// **********************ASSIGNED CONTAINER ADD-TASK-TEMPLATE**********************

function toggleAssignedContainer() {
    let showContacts = document.getElementById('show-assigned-contacts');
    let arrowImage = document.getElementById('dropdown-arrow');
    let initialDIV = document.getElementById('show-chosen-initials');
    if (contactsVisible) {
        hideContacts(showContacts, arrowImage, initialDIV);
    } else {
        showAssignedContacts(showContacts, arrowImage, initialDIV);
    }
}

function hideContacts(showContacts, arrowImage, initialDIV) {
    showContacts.style.border = 'none';
    showContacts.innerHTML = '';
    contactsVisible = false;
    arrowImage.style.transform = 'rotate(0deg)';
    initialDIV.style.display = 'flex';
}

function showAssignedContacts(showContacts, arrowImage, initialDIV) {
    showContacts.style.border = '1px solid lightgrey';
    showContactsForAssign();
    contactsVisible = true;
    arrowImage.style.transform = 'rotate(180deg)';
    initialDIV.style.display = 'none';
}

function showContactsForAssign() {
    let showContacts = document.getElementById('show-assigned-contacts');
    showContacts.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        showContacts.innerHTML += /*html*/`
        <div id="newcontact${i}" class="new-contact" onclick="handleContactClick(contactElement, i)">
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

function handleContactClick(contactElement, i) {
    let currentBackgroundColor = getCurrentBackgroundColor(contactElement);
    if (currentBackgroundColor === 'rgb(42, 54, 71)') {
        resetContact(contactElement, i);
    } else {
        selectContact(contactElement, i);
    }
    showChosenInitials();
}

function getCurrentBackgroundColor(contactElement) {
    return window.getComputedStyle(contactElement).getPropertyValue('background-color');
}

function resetContact(contactElement, i) {
    contactElement.style.backgroundColor = '';
    contactElement.style.color = 'black';
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = false;
    removeChosenContact(contacts[i]);
}

function selectContact(contactElement, i) {
    contactElement.style.backgroundColor = 'rgb(42, 54, 71)';
    contactElement.style.color = 'white';
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = true;
    addChosenContact(contacts[i]);
}

function addChosenContact(contact) {
    let index = chosenContacts.findIndex(c => c.name === contact.name);
    if (index === -1) {
        chosenContacts.push(contact);
    }
}

function removeChosenContact(contact) {
    let index = chosenContacts.findIndex(c => c.name === contact.name);
    if (index !== -1) {
        chosenContacts.splice(index, 1);
    }
}

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

function checkedContactStaysChecked(contactElement, i) {
    if (chosenContacts.findIndex(c => c.name === contacts[i].name) !== -1) {
        contactElement.style.backgroundColor = '#2A3647';
        contactElement.style.color = 'white';
        let checkbox = contactElement.querySelector('.checkBox');
        checkbox.checked = true;
    }
}

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


// **********************ASSIGNED CONTAINER EDIT-CARD**********************

function toggleAssignedContainerEditCard() {
    let showContacts = document.getElementById('show-chosen-initials-edit-card');
    let arrowImage = document.getElementById('dropdown-arrow-edit-card');
    let assignedContacts = document.getElementById('show-assigned-contacts-edit-card');
    if (contactsVisibleEditCard) {
        hideContactsEditCard(showContacts, arrowImage, assignedContacts);
    } else {
        showAssignedContactsEditCard(showContacts, arrowImage, assignedContacts);
    }
}

function generateChosenContactsEditCard(assignedContacts) {
    assignedContacts.innerHTML = '';
    if (chosenContacts.length === 0) {
        assignedContacts.innerHTML = renderNoContactsAssignedHTML();
    } else {
        for (let index = 0; index < chosenContacts.length; index++) {
            const contact = chosenContacts[index];
            assignedContacts.innerHTML += renderAssignedContactHTML(contact);
        }
    }
}

function hideContactsEditCard(showContacts, arrowImage, assignedContacts) {
    showContacts.style.display = 'none';
    showContacts.innerHTML = '';
    assignedContacts.style.display = 'block';
    generateChosenContactsEditCard(assignedContacts);
    contactsVisibleEditCard = false;
    arrowImage.style.transform = 'rotate(0deg)';
}

function showAssignedContactsEditCard(showContacts, arrowImage, assignedContacts) {
    showContacts.style.border = '1px solid lightgrey';
    showContacts.style.display = 'block'
    assignedContacts.style.display = 'none'
    showContactsForAssignEditCard();
    contactsVisibleEditCard = true;
    arrowImage.style.transform = 'rotate(180deg)';
}

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

function handleContactClickEditCard(contactElement, i) {
    let currentBackgroundColor = getCurrentBackgroundColorEditCard(contactElement);
    if (currentBackgroundColor === 'rgb(42, 54, 71)') {
        resetContactEditCard(contactElement, i);
    } else {
        selectContactEditCard(contactElement, i);
    }
}

function getCurrentBackgroundColorEditCard(contactElement) {
    return window.getComputedStyle(contactElement).getPropertyValue('background-color');
}

function resetContactEditCard(contactElement, i) {
    contactElement.style.backgroundColor = '';
    contactElement.style.color = 'black';
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = false;
    removeChosenContactEditCard(contacts[i]);
}

function selectContactEditCard(contactElement, i) {
    contactElement.style.backgroundColor = 'rgb(42, 54, 71)';
    contactElement.style.color = 'white';
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = true;
    addChosenContactEditCard(contacts[i]);
}

function addChosenContactEditCard(contact) {
    let index = chosenContacts.findIndex(c => c.name === contact.name);
    if (index === -1) {
        chosenContacts.push(contact);
    }
}

function removeChosenContactEditCard(contact) {
    let index = chosenContacts.findIndex(c => c.name === contact.name);
    if (index !== -1) {
        chosenContacts.splice(index, 1);
    }
}

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

function checkedContactStaysCheckedEditCard(contactElement, i) {
    if (chosenContacts.findIndex(c => c.name === contacts[i].name) !== -1) {
        contactElement.style.backgroundColor = '#2A3647';
        contactElement.style.color = 'white';
        let checkbox = contactElement.querySelector('.checkBox');
        checkbox.checked = true;
    }
}


