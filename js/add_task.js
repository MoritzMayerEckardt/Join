/**
 * Initializes the addition of a new task.
 * Loads necessary data and sets up the interface.
 * @returns {Promise<void>}
 */
 async function initAddTask() {
    await includeHTML();
    await loadCurrentUserIndex(); 
    await loadTasks();
    await loadContacts();
    await loadUsers();
    await loadGuestLogin();
    addBackgroundColor(1);
    showCurrentUserInButton();
    showCurrentUserInButtonMobile();
}

/**
 * Adds a new task by creating it, pushing values, and posting it to the server.
 * @returns {Promise<void>}
 */
async function addTask() {
    createTasksIfNotCreated();
    pushValuesToTasks();
    await postTasks(TASKS_PATH);
    saveTaskIdCounter();
    jumpToBoard()
}

/**
 * Creates tasks array if it doesn't exist.
 */
function createTasksIfNotCreated() {
    if (!tasks) {
        tasks = [];
    }
}

/**
 * Gets input values for creating a new task.
 * @returns {Object} - Object containing task details.
 */
function getValuesFromInput() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let assigned = document.getElementById('assigned');
    let date = document.getElementById('date');
    let category = document.getElementById('category');
    let priority;
    if (lastClickedButton === 'urgent') {
        priority = 'urgent';
    } else if (lastClickedButton === 'medium') {
        priority = 'medium';
    } else if (lastClickedButton === 'low') {
        priority = 'low';
    } else {
        priority = 'medium';
    }
    return { title, description, assigned, date, category, priority, };
}

/**
 * Pushes input values to tasks array.
 */
function pushValuesToTasks() {
    let boardCategory = "toDo";
    let { title, description, date, category, priority } = getValuesFromInput();
    tasks.push({
        id: taskIdCounter++,
        title: title.value,
        description: description.value,
        assigned: chosenContacts,
        date: date.value,
        category: category.value,
        subtasks: subtaskArray,
        boardCategory: boardCategory,
        priority: priority
    });
}

/**
 * Adds a new subtask to the subtask array if the input field is not empty.
 */
 function addNewSubtask() {
    let addNewSubtask = document.getElementById('subtasks').value;
    if (addNewSubtask.trim() !== "") { // Überprüfen, ob das Eingabefeld nicht leer ist
        if (subtaskArray.length < 5) {
            subtaskArray.push({
                title: addNewSubtask,
                isChecked: false
            });
            getNewSubtask();
        } else {
            alert("You can only add a maximum of six subtasks.");
        }
    } else {
        alert("Please enter a subtask.");
    }
}


/**
 * Updates the interface with new subtask information.
 */
 function getNewSubtask() {
    let newSubtask = document.getElementById('newSubtasks');
    newSubtask.innerHTML = ``;
    for (i = 0; i < subtaskArray.length; i++) {
        newSubtask.innerHTML += `
        <div id="newSubtask${i}" class="newSubtask">
         <div class= "titleDIV"> 
             <p>•</p>
             <div class="subtaskTitle">${subtaskArray[i].title}</div>
             <input type="text" class="subtaskInput" value="${subtaskArray[i].title}" style="display: none;">
         </div>    
             <div class= "deleteAndEdit">
             <img src="assets/img/edit.svg" class="editsvg" onclick="enableTitleEditing(${i})"> 
             <img src="assets/img/delete.svg" class="deletesvg" onclick="deleteNewSubtask(${i})">
             </div>
        </div>`
    }
    document.getElementById('subtasks').value = ``;
}


/**
 * Enables editing of the subtask title.
 * @param {number} index - The index of the subtask to edit.
 */
 function enableTitleEditing(index) {
    let subtaskTitle = document.getElementById(`newSubtask${index}`).querySelector(".subtaskTitle");
    let subtaskInput = document.getElementById(`newSubtask${index}`).querySelector(".subtaskInput");
    subtaskTitle.style.display = "none";
    subtaskInput.style.display = "block";
    subtaskInput.focus();

    subtaskInput.addEventListener("blur", function() {
        updateSubtaskTitle(index, subtaskInput.value);
    });
}


/**
 * Updates the subtask title in the subtaskArray.
 * @param {number} index - The index of the subtask to update.
 * @param {string} value - The new title value.
 */
function updateSubtaskTitle(index, value) {
    let subtaskTitle = document.getElementById(`newSubtask${index}`).querySelector(".subtaskTitle");
    let subtaskInput = document.getElementById(`newSubtask${index}`).querySelector(".subtaskInput");
    subtaskArray[index].title = value.trim();
    subtaskTitle.textContent = value.trim();
    subtaskTitle.style.display = "block";
    subtaskInput.style.display = "none";
}



/**
 * Deletes a subtask from the subtaskArray based on the provided index.
 * @param {number} i - The index of the subtask to be deleted.
 * @returns {void}
 */
 function deleteNewSubtask(i) {
    // Remove the subtask from the subtaskArray
    subtaskArray.splice(i, 1);
    // Update the display of subtasks
    getNewSubtask();
}


/**
 * Handles key press events, particularly the Enter key for adding subtasks.
 * @param {Event} event - The key press event.
 */
function handleKeyPress(event) {
    if (event.keyCode === 13) { 
        event.preventDefault(); 
        addNewSubtask();
    }
}

/**
 * Clears all input fields and resets associated styles.
 */
 function clearForm() {
    // Clear input field values
    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
    document.getElementById('assigned').selectedIndex = 0;
    document.getElementById('date').value = "";
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('subtasks').value = "";
    document.getElementById('showChosenInitials').innerHTML= "";
    // Reset arrays and UI elements
    subtaskArray = [];
    chosenContacts = [];
    getNewSubtask();
    resetButtonStyles();
}

function resetButtonStyles() {
    resetUrgentButtonStyles();
    resetMediumButtonStyles();
    resetLowButtonStyles();
}

function resetUrgentButtonStyles() {
    let urgentButton = document.getElementById('urgentButton');
    let redArrow = document.getElementById('redArrow');
    let whiteArrow = document.getElementById('whiteArrow');
    urgentButton.style.backgroundColor = '';
    urgentButton.style.color = '';
    redArrow.style.display = '';
    whiteArrow.style.display = '';
}

function resetMediumButtonStyles() {
    let mediumButton = document.getElementById('mediumButton');
    let mediumButtonText = document.getElementById('mediumText');
    let prioMedium = document.getElementById('prioMedium');
    mediumButton.style.backgroundColor = '';
    mediumButton.style.color = '';
    mediumButtonText.style.fontWeight = '';
    prioMedium.style.display = '';
}

function resetLowButtonStyles() {
    let lowButton = document.getElementById('lowButton');
    let greenArrow = document.getElementById('greenArrow');
    let whiteArrowLow = document.getElementById('whiteArrowLow');
    lowButton.style.backgroundColor = '';
    lowButton.style.color = '';
    greenArrow.style.display = '';
    whiteArrowLow.style.display = '';
}


/**
 * Changes background color and styles based on the clicked button.
 * @param {string} clickedButton - The ID of the button that was clicked.
 */
 function changeBackgroundColor(clickedButton) {
    if (clickedButton === 'urgent') {
        updateUrgentButtonStyles();
        resetMediumButtonStyles();
        resetLowButtonStyles();
    } else if (clickedButton === 'medium') {
        updateMediumButtonStyles();
        resetUrgentButtonStyles();
        resetLowButtonStyles();
    } else if (clickedButton === 'low') {
        updateLowButtonStyles();
        resetMediumButtonStyles();
        resetUrgentButtonStyles();
    }
    lastClickedButton = clickedButton;
}

/**
 * Updates urgent button styles.
 */
function updateUrgentButtonStyles() {
    let urgentButton = document.getElementById('urgentButton');
    let redArrow = document.getElementById('redArrow');
    let whiteArrow = document.getElementById('whiteArrow');
    urgentButton.style.backgroundColor = 'rgba(255, 61, 0, 1)';
    urgentButton.style.color = 'white';
    redArrow.style.display = 'none';
    whiteArrow.style.display = 'flex';
}

/**
 * Updates medium button styles.
 */
function updateMediumButtonStyles() {
    let mediumButton = document.getElementById('mediumButton');
    let mediumButtonText = document.getElementById('mediumText');
    let prioMedium = document.getElementById('prioMedium');
    mediumButton.style.backgroundColor = 'rgba(255, 168, 0, 1)';
    mediumButton.style.color = 'white';
    mediumButtonText.style.fontWeight = '700';
    prioMedium.style.display = 'none';
}

/**
 * Updates low button styles.
 */
function updateLowButtonStyles() {
    let lowButton = document.getElementById('lowButton');
    let greenArrow = document.getElementById('greenArrow');
    let whiteArrowLow = document.getElementById('whiteArrowLow');
    lowButton.style.backgroundColor = 'rgba(122, 226, 41, 1)';
    lowButton.style.color = 'white';
    greenArrow.style.display = 'none';
    whiteArrowLow.style.display = 'flex';
}

/**
 * Resets urgent button styles.
 */
function resetUrgentButtonStyles() {
    let urgentButton = document.getElementById('urgentButton');
    let redArrow = document.getElementById('redArrow');
    let whiteArrow = document.getElementById('whiteArrow');
    urgentButton.style.backgroundColor = 'white';
    urgentButton.style.color = 'black';
    redArrow.style.display = 'flex';
    whiteArrow.style.display = 'none';
}

/**
 * Resets medium button styles.
 */
function resetMediumButtonStyles() {
    let mediumButton = document.getElementById('mediumButton');
    let mediumButtonText = document.getElementById('mediumText');
    let prioMedium = document.getElementById('prioMedium');
    mediumButton.style.backgroundColor = 'white';
    mediumButton.style.color = 'black';
    mediumButtonText.style.fontWeight = 'normal';
    prioMedium.style.display = 'flex';
}

/**
 * Resets low button styles.
 */
function resetLowButtonStyles() {
    let lowButton = document.getElementById('lowButton');
    let greenArrow = document.getElementById('greenArrow');
    let whiteArrowLow = document.getElementById('whiteArrowLow');
    lowButton.style.backgroundColor = 'white';
    lowButton.style.color = 'black';
    greenArrow.style.display = 'flex';
    whiteArrowLow.style.display = 'none';
}

/**
 * Redirects the user to the board page.
 */
 function jumpToBoard() {
    window.location.href = "./board.html";
}

/**
 * Event listener to toggle visibility of contacts when the assigned dropdown is clicked.
 */
 document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('assigned').addEventListener('click', function(event) {
        document.getElementById('showChosenInitials').style.display = 'flex';
        toggleContactsVisibility();
    });


    
    document.addEventListener('click', function(event) {
        let showContacts = document.getElementById('showContactsToAssign');
        let arrowImage = document.getElementById('dropdownArrow');
        let initialDIV = document.getElementById('showChosenInitials');
        let assignedDIV = document.getElementById('assigned');

        // Close contacts dropdown when clicking outside of it
        if (showContacts.style.display !== 'none') {
            if (!showContacts.contains(event.target) && event.target !== assignedDIV && event.target.id !== 'assigned' && event.target.id !== 'standardOption' && event.target.id !== 'dropdownArrow') {
                showContacts.innerHTML = '';
                contactsVisible = false;
                arrowImage.style.transform = 'rotate(0deg)';
                initialDIV.style.display = 'flex';
            }
        }
    });
});

/**
 * Toggles visibility of contacts dropdown.
 */
function toggleContactsVisibility() {
    let showContacts = document.getElementById('showContactsToAssign');
    let arrowImage = document.getElementById('dropdownArrow');
    let initialDIV = document.getElementById('showChosenInitials');

    if (contactsVisible) {
        showContacts.innerHTML = '';
        contactsVisible = false;
        arrowImage.style.transform = 'rotate(0deg)';
        initialDIV.style.display = 'flex !important';
    } else {
        showContactsForAssign();
        contactsVisible = true;
        arrowImage.style.transform = 'rotate(180deg)';
        initialDIV.style.display = 'none';
    }
}

/**
 * Populates the contacts dropdown with available contacts.
 */
function showContactsForAssign() {
    let showContacts = document.getElementById('showContactsToAssign');
    showContacts.innerHTML = '';
    // Loop through contacts and populate the dropdown
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        showContacts.innerHTML += `
        <div id="newcontact${i}" class="newcontact">
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
 * Handles the selection of contacts in the contacts dropdown.
 */
 /**
 * Adds click event listeners to contact elements to toggle their selection.
 */
function chosenContact() {
    for (let i = 0; i < contacts.length; i++) {
        let contactElement = document.getElementById(`newcontact${i}`);
        contactElement.style.backgroundColor = '';
        contactElement.addEventListener('click', function () {
            toggleContactSelection(contactElement, i);
            showChosenInitials();
        });
        // Ensure that checked contacts remain checked
        checkedContactStaysChecked(contactElement, i);
    }
}

/**
 * Toggles the selection of a contact element.
 * @param {HTMLElement} contactElement - The contact element to toggle.
 * @param {number} index - The index of the contact.
 */
function toggleContactSelection(contactElement, index) {
    let currentBackgroundColor = window.getComputedStyle(contactElement).getPropertyValue('background-color');
    if (currentBackgroundColor === 'rgb(42, 54, 71)') {
        unselectContact(contactElement, index);
    } else {
        selectContact(contactElement, index);
    }
}

/**
 * Unselects a contact element.
 * @param {HTMLElement} contactElement - The contact element to unselect.
 * @param {number} index - The index of the contact.
 */
function unselectContact(contactElement, index) {
    contactElement.style.backgroundColor = '';
    contactElement.style.color = 'black';
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = false;
    removeContactFromChosen(index);
}

/**
 * Selects a contact element.
 * @param {HTMLElement} contactElement - The contact element to select.
 * @param {number} index - The index of the contact.
 */
function selectContact(contactElement, index) {
    contactElement.style.backgroundColor = 'rgb(42, 54, 71)';
    contactElement.style.color = 'white';
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = true;
    addContactToChosen(index);
}

/**
 * Removes a contact from the chosen contacts array.
 * @param {number} index - The index of the contact to remove.
 */
function removeContactFromChosen(index) {
    let existingIndex = chosenContacts.findIndex(c => c.name === contacts[index].name);
    if (existingIndex !== -1) {
        chosenContacts.splice(existingIndex, 1);
    }
}

/**
 * Adds a contact to the chosen contacts array.
 * @param {number} index - The index of the contact to add.
 */
function addContactToChosen(index) {
    let existingIndex = chosenContacts.findIndex(c => c.name === contacts[index].name);
    if (existingIndex === -1) {
        chosenContacts.push(contacts[index]);
    }
}

/**
 * Ensures that checked contacts remain checked.
 * @param {HTMLElement} contactElement - The contact element to ensure checked state.
 * @param {number} index - The index of the contact.
 */
function checkedContactStaysChecked(contactElement, index) {
    let checkbox = contactElement.querySelector('.checkBox');
    checkbox.checked = isContactSelected(index);
}

/**
 * Checks if a contact is selected.
 * @param {number} index - The index of the contact.
 * @returns {boolean} - Whether the contact is selected.
 */
function isContactSelected(index) {
    return chosenContacts.some(c => c.name === contacts[index].name);
}


/**
 * Ensures that previously selected contacts remain checked upon rendering.
 * @param {HTMLElement} contactElement - The contact element.
 * @param {number} i - Index of the contact.
 */
function checkedContactStaysChecked(contactElement, i) {
    // Check if contact is in chosen contacts array and update styling accordingly
    if (chosenContacts.findIndex(c => c.name === contacts[i].name) !== -1) {
        contactElement.style.backgroundColor = '#2A3647';
        contactElement.style.color = 'white';
        let checkbox = contactElement.querySelector('.checkBox');
        checkbox.checked = true;
    }
}

/**
 * Updates the display of chosen contact initials.
 */
function showChosenInitials() {
    let showChosenInitials = document.getElementById('showChosenInitials');
    showChosenInitials.innerHTML = '';
    // Loop through chosen contacts and display initials
    chosenContacts.forEach(contact => {
        showChosenInitials.innerHTML += `
        <div class="circleSmall" style="background-color: ${contact.color};">
            <p>${contact.initials}</p>
        </div>`;
    });
}






