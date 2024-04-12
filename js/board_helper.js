/**
 * Retrieves the background color based on the task category.
 * @param {string} category - The category of the task.
 * @returns {string} - The corresponding background color.
 */
function getBackgroundColorFromTaskCategory(category) {
    switch (category) {
        case 'User Story':
            return '#0038FF';
        case 'Technical Task':
            return '#1FD7C1';
        default:
            return '';
    }
}

/**
 * Prepares the background color for a task category.
 * @param {string} category - The category of the task.
 * @returns {string} - The background color for the task category.
 */
function prepareBackgroundColorTaskCategory(category) {
    let backgroundColor = getBackgroundColorFromTaskCategory(category);
    return backgroundColor;
}

/**
 * Generates HTML for assigned contacts in a task.
 * @param {Object} task - The task object containing assigned contacts.
 * @returns {string} - The HTML code for assigned contacts.
 */
function generateAssignedContactsHTML(task) {
    let assignedContactsHTML = '';
    if (task.assigned && task.assigned.length > 0) {
        for (let i = 0; i < task.assigned.length; i++) {
            let assignedContact = task.assigned[i].name;
            let contactColor = task.assigned[i].color;
            let firstLetterName = getInitialsFromName(assignedContact);
            let firstLetterLastName = getInitialsFromLastName(assignedContact);
            let marginClass = i === 0 ? 'margin-0' : 'margin-8';
            assignedContactsHTML += renderAssignedContactsHTML(firstLetterName, firstLetterLastName, contactColor, marginClass);
        }
    }
    return assignedContactsHTML;
}

/**
 * Generates detailed HTML for assigned contacts in a task.
 * @param {Object} task - The task object containing assigned contacts.
 * @returns {string} - The detailed HTML code for assigned contacts.
 */
function generateAssignedContactsInDetailedCard(task) {
    let assignedContactsHTML = '';
    if (task.assigned && task.assigned.length > 0) {
        for (let i = 0; i < task.assigned.length; i++) {
            let assignedContact = task.assigned[i].name;
            let contactColor = task.assigned[i].color;
            let firstLetterName = getInitialsFromName(assignedContact);
            let firstLetterLastName = getInitialsFromLastName(assignedContact);
            assignedContactsHTML += renderAssignedContactsInDetailedCard(firstLetterName, firstLetterLastName, assignedContact, contactColor);
        }
    } else {
        assignedContactsHTML = /*html*/`<span class="no-contacts-assigned-text">No contacts assigned</span>`;
    }
    return assignedContactsHTML;
}

/**
 * Retrieves the first letter of a name.
 * @param {string} name - The full name.
 * @returns {string} - The first letter of the name.
 */
function getInitialsFromName(name) {
    let firstLetterName = name.charAt(0);
    return firstLetterName;
}

/**
 * Retrieves the first letter of the last name from a full name.
 * @param {string} name - The full name.
 * @returns {string} - The first letter of the last name.
 */
function getInitialsFromLastName(name) {
    let spaceIndex = name.indexOf(' ');
    let lastName = name.substring(spaceIndex + 1);
    let firstLetterLastName = lastName.charAt(0);
    return firstLetterLastName;
}

/**
 * Changes the color of the delete button.
 */
function changeColorOfDeleteButton() {
    let deleteButton = document.getElementById('delete-img');
    deleteButton.setAttribute('src', './assets/img/delete-light-blue.svg')
}

/**
 * Changes the color of the delete button.
 */
function changeColorOfDeleteButton2() {
    let deleteButton = document.getElementById('delete-img');
    deleteButton.setAttribute('src', './assets/img/delete-dark-blue.svg')
}

/**
 * Changes the color of the edit button.
 */
function changeColorOfEditButton() {
    let editButton = document.getElementById('edit-img');
    editButton.setAttribute('src', './assets/img/edit-light-blue.svg')
}

/**
 * Changes the color of the edit button.
 */
function changeColorOfEditButton2() {
    let editButton = document.getElementById('edit-img');
    editButton.setAttribute('src', './assets/img/edit-dark-blue.svg')
}

/**
 * Changes the color of the add task image.
 * @param {string} id - The ID of the add task image element.
 */
function changeColorOfAddTaskImg(id) {
    let addTaskImg = document.getElementById(`add-task-img${id}`);
    addTaskImg.setAttribute('src', './assets/img/add_task_button_blue.svg')
}

/**
 * Changes the color of the add task image.
 * @param {string} id - The ID of the add task image element.
 */
function changeColorOfAddTaskImg2(id) {
    let addTaskImg = document.getElementById(`add-task-img${id}`);
    addTaskImg.setAttribute('src', './assets/img/add_task_button.svg')
}

/**
 * Retrieves the priority value from the last clicked button.
 * @returns {string} - The priority value.
 */
function getVAlueOfPriority() {
    if (lastClickedButton === 'urgent') {
        priority = 'urgent';
    } else if (lastClickedButton === 'medium') {
        priority = 'medium';
    } else if (lastClickedButton === 'low') {
        priority = 'low';
    } else {
        priority = 'medium'; 
    }
    return priority;
}