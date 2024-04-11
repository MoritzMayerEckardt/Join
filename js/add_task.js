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
 * Adds a new subtask to the subtask array.
 */
function addNewSubtask() {
    let addNewSubtask = document.getElementById('subtasks').value;
    if (subtaskArray.length < 2) {
        subtaskArray.push({
            title: addNewSubtask,
            isChecked: false
        });
        getNewSubtask();
    } else {
        alert("You can only add a maximum of two subtasks.");
    }
}

/**
 * Updates the interface with new subtask information.
 */
function getNewSubtask() {
    console.log("getNewSubtask() is called")
    let newSubtask = document.getElementById('newSubtask');
    newSubtask.innerHTML = ``;
    for (i = 0; i < subtaskArray.length; i++) {
        newSubtask.innerHTML += `
        <div> 
             <b> •${subtaskArray[i].title} </b> 
         </div>`
    }
    document.getElementById('subtasks').value = ``;
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

/**
 * Resets button styles to their default state.
 */
function resetButtonStyles() {
    // Reset urgent button styles
    let urgentButton = document.getElementById('urgentButton');
    let redArrow = document.getElementById('redArrow');
    let whiteArrow = document.getElementById('whiteArrow');
    urgentButton.style.backgroundColor = '';
    urgentButton.style.color = '';
    redArrow.style.display = '';
    whiteArrow.style.display = '';
    // Reset medium button styles
    let mediumButton = document.getElementById('mediumButton');
    let mediumButtonText = document.getElementById('mediumText');
    let prioMedium = document.getElementById('prioMedium');
    mediumButton.style.backgroundColor = '';
    mediumButton.style.color = '';
    mediumButtonText.style.fontWeight = '';
    prioMedium.style.display = '';
    // Reset low button styles
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
    // Retrieve button and arrow elements
    let urgentButton = document.getElementById('urgentButton');
    let mediumButton = document.getElementById('mediumButton');
    let lowButton = document.getElementById('lowButton');
    let redArrow = document.getElementById('redArrow');
    let greenArrow = document.getElementById('greenArrow');
    let whiteArrow = document.getElementById('whiteArrow');
    let whiteArrowLow = document.getElementById('whiteArrowLow');
    let mediumButtonText = document.getElementById('mediumText');
    let prioMedium = document.getElementById('prioMedium');
    
    // Update styles based on the clicked button
    if (clickedButton === 'urgent') {
        // Update urgent button styles
        urgentButton.style.backgroundColor = 'rgba(255, 61, 0, 1)';
        urgentButton.style.color = 'white';
        redArrow.style.display = 'none';
        whiteArrow.style.display = 'flex';
        // Reset medium button styles
        mediumButton.style.backgroundColor = 'white';
        mediumButton.style.color = 'black';
        mediumButtonText.style.fontWeight = 'normal';
        prioMedium.style.display = 'flex';
        // Reset low button styles
        lowButton.style.backgroundColor = 'white';
        lowButton.style.color = 'black';
        greenArrow.style.display = 'flex';
        whiteArrowLow.style.display = 'none';
    } else if (clickedButton === 'medium') {
        // Update medium button styles
        mediumButton.style.backgroundColor = 'rgba(255, 168, 0, 1)';
        mediumButton.style.color = 'white';
        mediumButtonText.style.fontWeight = '700';
        prioMedium.style.display = 'none';
        // Reset urgent button styles
        urgentButton.style.backgroundColor = 'white';
        urgentButton.style.color = 'black';
        redArrow.style.display = 'flex';
        whiteArrow.style.display = 'none';
        // Reset low button styles
        lowButton.style.backgroundColor = 'white';
        lowButton.style.color = 'black';
        greenArrow.style.display = 'flex';
        whiteArrowLow.style.display = 'none';
    } else if (clickedButton === 'low') {
        // Update low button styles
        lowButton.style.backgroundColor = 'rgba(122, 226, 41, 1)';
        lowButton.style.color = 'white';
        greenArrow.style.display = 'none';
        whiteArrowLow.style.display = 'flex';
        // Reset medium button styles
        mediumButton.style.backgroundColor = 'white';
        mediumButton.style.color = 'black';
        mediumButtonText.style.fontWeight = 'normal';
        prioMedium.style.display = 'flex';
        // Reset urgent button styles
        urgentButton.style.backgroundColor = 'white';
        urgentButton.style.color = 'black';
        redArrow.style.display = 'flex';
        whiteArrow.style.display = 'none';
    }
    // Update last clicked button
    lastClickedButton = clickedButton;
}

/**
 * Redirects the user to the board page.
 */
 function jumpToBoard() {
    window.location.href = "../join/board.html";
}

/**
 * Event listener to toggle visibility of contacts when the assigned dropdown is clicked.
 */
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('assigned').addEventListener('click', function(event) {
        let showContacts = document.getElementById('showContactsToAssign');
        let arrowImage = document.getElementById('dropdownArrow');
        let initialDIV = document.getElementById('showChosenInitials');
        initialDIV.style.display = 'flex';
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
 function chosenContact() {
    // Loop through contacts and add event listeners to contact elements
    for (let i = 0; i < contacts.length; i++) {
        let contactElement = document.getElementById(`newcontact${i}`);
        contactElement.style.backgroundColor = '';
        // Add click event listener to toggle selection of contact
        contactElement.addEventListener('click', function () {
            // Get the current background color of the contact element
            let currentBackgroundColor = window.getComputedStyle(contactElement).getPropertyValue('background-color');
            // Toggle background color and checkbox status based on current state
            if (currentBackgroundColor === 'rgb(42, 54, 71)') {
                contactElement.style.backgroundColor = '';
                contactElement.style.color = 'black';
                let checkbox = contactElement.querySelector('.checkBox');
                checkbox.checked = false;
                // Remove contact from chosen contacts array
                let index = chosenContacts.findIndex(c => c.name === contacts[i].name);
                if (index !== -1) {
                    chosenContacts.splice(index, 1);
                }
            } else {
                contactElement.style.backgroundColor = 'rgb(42, 54, 71)';
                contactElement.style.color = 'white';
                let checkbox = contactElement.querySelector('.checkBox');
                checkbox.checked = true;
                // Add contact to chosen contacts array
                let index = chosenContacts.findIndex(c => c.name === contacts[i].name);
                if (index === -1) {
                    chosenContacts.push(contacts[i]);
                }
            }
            // Update the display of chosen contact initials
            showChosenInitials();
        });
        // Ensure that checked contacts remain checked
        checkedContactStaysChecked(contactElement, i);
    }
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






