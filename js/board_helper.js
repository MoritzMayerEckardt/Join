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
 * Retrieves the text displaying subtask completion status.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The text indicating subtask completion status.
 */
function getSubtasksText(task) {
    let allsubtasks = task.subtasks ? task.subtasks.length : 0;
    let subtasksCompleted = task.subtasks ? task.subtasks.filter(subtask => subtask.isChecked).length : 0;
    return allsubtasks > 0 ? `${subtasksCompleted}/${allsubtasks} Subtasks` : '';
}

/**
 * Determines the CSS class for the progress bar based on subtask completion.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The CSS class for the progress bar.
 */
function getProgressBarClass(task) {
    let allsubtasks = task.subtasks ? task.subtasks.length : 0;
    let subtasksCompleted = task.subtasks ? task.subtasks.filter(subtask => subtask.isChecked).length : 0;
    if (allsubtasks === 0) {
        return "d-none";
    } else {
        return subtasksCompleted === 0 ? "empty" : subtasksCompleted === allsubtasks ? "full" : "half-filled";
    }
}

/**
 * Generates HTML for the progress bar based on task's subtask completion.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML code for the progress bar.
 */
function generateProgressBarHTML(task) {
    let subtasksText = getSubtasksText(task);
    let progressBarClass = getProgressBarClass(task);
    let progressBarHTML = '';
    if (task.subtasks && task.subtasks.length > 0) {
        progressBarHTML = renderProgressBar(progressBarClass, subtasksText)
    }
    return progressBarHTML;
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
 * Generates HTML for subtasks in a detailed card view.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML code for subtasks.
 */
function generateSubtasksHTML(task) {
    let subtasks = task.subtasks;
    let subtasksHTML = "";
    if (subtasks && subtasks.length > 0) {
        for (let index = 0; index < subtasks.length; index++) {
            const subtask = subtasks[index].title;
            const isChecked = subtasks[index].isChecked; 
            const checkBoxImage = isChecked ? './assets/img/check_button_check.svg' : './assets/img/check_button_empty.svg';
            subtasksHTML += renderSubtaskHTML(task, subtask, checkBoxImage, index);
        }
    } else {
        subtasksHTML = /*html*/` <div class="no-subtasks-container">No subtasks</div>`;
    }
    return subtasksHTML;
}

/**
 * Handles checkbox functionality for subtasks.
 * @param {string} taskId - The ID of the task.
 * @param {number} index - The index of the subtask.
 */
function handleCheckBox(taskId, index) {
    let task = tasks.find(task => task.id === taskId);
    let subtask = task.subtasks[index];
    let checkBox = document.getElementById(`check-box${index}`);
    if (subtask.isChecked) {
        checkBox.setAttribute('src', './assets/img/check_button_empty.svg');
    } else {
        checkBox.setAttribute('src', './assets/img/check_button_check.svg');
    }
    subtask.isChecked = !subtask.isChecked;
    postTasks(TASKS_PATH);
    renderColumns();
}

/**
 * Generates HTML for subtasks in an edit card.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML code for subtasks in an edit card.
 */
function generateSubtasksHTMLEditCard(task) {
    let subtasksHTMLEditCard = '';
    let subtasks = task.subtasks;
    if (subtasks && subtasks.length > 0) {
        for (let index = 0; index < subtasks.length; index++) {
            const subtask = subtasks[index].title;
            subtasksHTMLEditCard += renderSubtasksHTMLInEditCard(task, index, subtasks, subtask);
        }
    } else {
        subtasksHTMLEditCard = /*html*/`
            <div class="no-subtasks-container">No subtasks</div>
        `
    }
    return subtasksHTMLEditCard;
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
 * Deletes a subtask.
 * @param {string} taskId - The ID of the task.
 * @param {number} index - The index of the subtask to be deleted.
 */
async function deleteSubtask(taskId, index) {
    let task = tasks.find(task => task.id === taskId); 
    task.subtasks.splice(index, 1);
    await postTasks(TASKS_PATH);
    await loadTasks();
    openEditCard(taskId);
    document.getElementById('new-subtask-edit-card').scrollIntoView({ behavior: 'instant' });
    renderColumns(); 
}

/**
 * Retrieves values from input fields in a task template.
 * @returns {Object} - Object containing task details.
 */
function getValuesFromInputFromTemplate() {
    let title = document.getElementById('title-template').value;
    let description = document.getElementById('description-template');
    let assigned = document.getElementById('assigned-template');
    let date = document.getElementById('date-template');
    let category = document.getElementById('category-template');
    let priority = getVAlueOfPriority();
    return { title, description, assigned, date, category, priority };
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

/**
 * Adds a new subtask in a task template.
 */
function addNewSubtaskInTemplate() {
    let addNewSubtask = document.getElementById('subtasks-template').value;
    if (subtaskArray.length < 2) {
        subtaskArray.push({
            title: addNewSubtask,
            isChecked: false
        });
        getNewSubtaskInTemplate();
    } else {
        alert("You can only add a maximum of two subtasks.");
    }
}

/**
 * Displays newly added subtasks in the task template.
 */
function getNewSubtaskInTemplate() {
    let newSubtask = document.getElementById('new-subtask-template');
    newSubtask.innerHTML = ``;
    for (i = 0; i < subtaskArray.length; i++) {
        newSubtask.innerHTML += /*html*/`
             <li class="subtask-list-edit-card"><b>${subtaskArray[i].title}</b></li> 
         `
    }
    document.getElementById('subtasks-template').value = ``;
}

/**
 * Adds a new subtask in an edit card.
 * @param {string} taskId - The ID of the task.
 */
async function addNewSubtaskInEditCard(taskId) {
    let task = tasks.find(task => task.id === taskId);
    if (!task.subtasks) {
        task.subtasks = [];
    }
    let subtasks = task.subtasks;
    let addNewSubtask = document.getElementById('subtasks-edit-card').value;
    if (subtasks.length < 2) {
        subtasks.push({
            title: addNewSubtask,
            isChecked: false
        });
        getNewSubtaskInEditCard(task);
    } else {
        alert("You can only add a maximum of two subtasks.");
    }
    await postTasks(TASKS_PATH);
    renderColumns();
}

/**
 * Displays newly added subtasks in an edit card.
 * @param {Object} task - The task object containing subtasks.
 */
function getNewSubtaskInEditCard(task) {
    let newSubtask = document.getElementById('new-subtask-edit-card');
    newSubtask.innerHTML = '';
        newSubtask.innerHTML += generateSubtasksHTMLEditCard(task);
}

/**
 * Generates HTML for subtasks in an edit card.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML code for subtasks in an edit card.
 */
function generateSubtasksHTMLEditCard(task) {
    let subtasksHTMLEditCard = '';
    let subtasks = task.subtasks;
    if (subtasks && subtasks.length > 0) {
        for (let index = 0; index < subtasks.length; index++) {
            const subtask = subtasks[index].title;
            subtasksHTMLEditCard += renderSubtasksListInEditCard(task, subtasks, subtask, index);
        }
    } else {
        subtasksHTMLEditCard = /*html*/`
            <div class="no-subtasks-container">No subtasks</div>
        `;
    }
    return subtasksHTMLEditCard;
}

/**
 * Clears input field for a subtask.
 * @param {number} index - The index of the subtask input field.
 */
function emptyInputSubtask(index) {
    inputSubtask = document.getElementById(`subtask-input${index}`).value = '';
}

/**
 * Saves edited subtask in an edit card.
 * @param {string} taskId - The ID of the task.
 * @param {number} index - The index of the subtask.
 */
async function saveSubtask(taskId, index) {
    let task = tasks.find(task => task.id === taskId);
    let subtasks = task.subtasks;
    let inputSubtask = document.getElementById(`subtask-input${index}`).value;
    if (index >= 0 && index < subtasks.length) {
        subtasks[index] = {
            title: inputSubtask,
            isChecked: subtasks[index].isChecked
        };   
    } 
    await postTasks(TASKS_PATH);
    await loadTasks();
    showSubtasksInList(task.id, index);
}

/**
 * Displays subtasks in a list after saving edits.
 * @param {string} taskId - The ID of the task.
 * @param {number} index - The index of the subtask.
 */
function showSubtasksInList(taskId, index) {
    openEditCard(taskId)
    document.getElementById('new-subtask-edit-card').scrollIntoView({ behavior: 'instant' });
    document.getElementById(`subtask${index}`).classList.remove('d-none');
    document.getElementById(`edit-subtask-container${index}`).classList.add('d-none');
    document.getElementById(`edit-container${index}`).classList.remove('d-none');
}

/**
 * Initiates editing of a subtask.
 * @param {number} index - The index of the subtask.
 */
function editSubtask(index) {
    document.getElementById(`subtask${index}`).classList.add('d-none');
    document.getElementById(`edit-subtask-container${index}`).classList.remove('d-none');
    document.getElementById(`edit-container${index}`).classList.add('d-none'); 
}

/**
 * Displays edit images for a subtask.
 * @param {number} index - The index of the subtask.
 */
function showEditImages(index) {
    let editContainer = document.getElementById(`edit-container${index}`)
    editContainer.classList.remove('d-none');
}

/**
 * Hides edit images for a subtask.
 * @param {number} index - The index of the subtask.
 */
function removeEditImages(index) {
    let editContainer = document.getElementById(`edit-container${index}`)
    editContainer.classList.add('d-none');
}

/**
 * Handles key press event in the task template.
 * @param {Event} event - The key press event.
 */
function handleKeyPressInTemplate(event) {
    if (event.keyCode === 13) { 
        event.preventDefault(); 
        addNewSubtaskInTemplate();
    }
}
