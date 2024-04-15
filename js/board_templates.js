let isMoveModalOpen = false;

/**
 * Renders a task card with provided details.
 * 
 * @param {object} task - The task object containing details like id, category, title, description, priority, etc.
 * @param {string} backgroundColor - The background color of the task card.
 * @param {string} progressBarHTML - HTML string representing a progress bar for the task.
 * @param {string} assignedContactsHTML - HTML string representing assigned contacts for the task.
 * @returns {string} - HTML string representing the task card.
 */
function renderCard(task, backgroundColor, progressBarHTML, assignedContactsHTML) {
    return /*html*/`
        <div id="task-card" onclick="openDetailedCard(${task.id}, event)" draggable="true" ondragstart="startDragging(${task.id})" class="task-card">
            <div style="background-color: ${backgroundColor}" class="task-category">${task.category}</div>
            <span class="task-title">${task.title}</span>
            <div class="task-description">${task.description}</div>
                ${progressBarHTML}
            <div class="task-assigned-container">
                <div class="assigned-container-card">${assignedContactsHTML}</div>
                <img class="priority-img-card" style="width: 17px" src="./assets/img/prio_${task.priority}.svg" alt="">
            </div>
            <div class="move-to-button-mobile">
                <a id="move-to-button-mobile" onclick="openMoveModal(${task.id})">
                    <img src="./assets/img/+.svg" alt="">
            </a>
            </div>
            <div id="move-modal${task.id}" class="move-modal d-none">
                <div class="move-modal-top">
                    <span>Move to:</span>
                </div> 
                <div>
                    <span class="move-modal-link" onclick="moveToMobile(${task.id}, 'toDo')">To Do</span>
                    <span class="move-modal-link" onclick="moveToMobile(${task.id}, 'inProgress')">In Progress</span>
                    <span class="move-modal-link" onclick="moveToMobile(${task.id}, 'awaitFeedback')">Await Feedback</span>
                    <span class="move-modal-link" onclick="moveToMobile(${task.id}, 'done')">Done</span>
                </div>     
            </div>
        </div>      
    `;
}


/**
 * Renders a detailed view of a task card with provided details.
 * 
 * @param {object} task - The task object containing details like id, category, title, description, priority, etc.
 * @param {string} backgroundColor - The background color of the detailed card.
 * @param {string} assignedContactsHTML - HTML string representing assigned contacts for the task.
 * @param {string} subtasksHTML - HTML string representing subtasks for the task.
 * @returns {string} - HTML string representing the detailed card.
 */
function renderDetailedCard(task, backgroundColor, assignedContactsHTML, subtasksHTML) { 
    return /*html*/`
        <div id="card" class="detailed-card-container">
            <div class="detailed-card-top-container">
                <div style="background-color: ${backgroundColor}" class="detailed-card-category">${task.category}</div>
                <a onclick="closePopup('card')" class="detailed-card-close-button"><img src="./assets/img/close.svg" alt=""></a>
            </div>
            <span class="detailed-card-title">${task.title}</span>
            <span class="detailed-card-description">${task.description}</span>
            <div class="detailed-card-date">
                <span style="color: #42526E">Due date:</span>
                <span>${task.date}</span>
            </div>
            <div class="detailed-card-priority">
                <span style="color: #42526E">Priority:</span>
                <div class="detailed-card-priority-text"><span>${task.priority}</span><img src="./assets/img/prio_${task.priority}.svg" alt=""></div>
            </div>
            <div class="detailed-card-assigned">
                <div style="color: #42526E">Assigned To:</div>
                <div class="detailed-card-contact-container">
                    ${assignedContactsHTML}
                </div>
            </div>
            <div class="detailed-card-subtasks-container">
                <span style="color: #42526E">Subtasks</span>
                <div id="subtasks-container-detailed-card">${subtasksHTML}</div>
            </div>
            <div class="detailed-card-bottom">
                <div class="flex-center" style="width: 159px; gap: 8px;">
                    <div onmouseover="changeColorOfDeleteButton()" onmouseout="changeColorOfDeleteButton2()" onclick="deleteTask(${task.id})" class="detailed-card-delete-container"><img id="delete-img" src="./assets/img/delete-dark-blue.svg" alt=""><span>Delete</span></div>
                    <div style="height: 24px; width: 1px; background: #D1D1D1"></div>
                    <div onmouseover="changeColorOfEditButton()" onmouseout="changeColorOfEditButton2()" onclick="openEditCard(${task.id})" class="detailed-card-edit-container"><img id="edit-img" src="./assets/img/edit-dark-blue.svg" alt=""><span>Edit</span></div>
                </div>
            </div>
        </div>
        <div id="task-deleted-container" class="d-none">
            <span>Task succesfully deleted</span>
            <img src="./assets/img/task_added.svg" alt="">
        </div>
    `;
}


/**
 * Renders an edit form for a task with pre-filled details.
 * 
 * @param {object} task - The task object containing details like id, category, title, description, priority, etc.
 * @param {string} subtasksHTMLEditCard - HTML string representing subtasks for the task in edit mode.
 * @param {string} assignedContactsHTML - HTML string representing assigned contacts for the task.
 * @returns {string} - HTML string representing the edit form.
 */
function renderEditCard(task, subtasksHTMLEditCard, assignedContactsHTML) {
    return /*html*/`
        <div id="card" class="edit-card-container" onclick="hideContactsEditCard(event)">
            <form class="form-edit-card" onsubmit="editTask(${task.id}); return false">    
                <div class="edit-card-top-container">
                    <div class="detailed-card-category"></div>
                    <a onclick="closePopup('card')" class="detailed-card-close-button"><img src="./assets/img/close.svg" alt=""></a>
                </div>
                <div class="edit-card-top">
                    <span style=" color: #2A3647">Title</span>
                    <input required placeholder="Enter a title" id="title-edit-card" class="edit-card-input-field" type="text" value="${task.title}">
                </div>
                <div class="edit-card-top">
                    <span style="color: #2A3647">Description</span>
                    <textarea placeholder="Enter a description" id="description-edit-card" class="edit-card-input-field" style="height: 168px" type="text">${task.description}</textarea>
                </div>
                <div class="edit-card-top">
                    <span style="color: #2A3647">Due date</span>
                    <input id="date-edit-card" class="edit-card-input-field" type="date" value="${task.date}" required> 
                </div>
                <div class="priority-buttons-container-template">
                    <span class="edit-card-text-field">Prio</span>
                    <div class="priority-buttons-container">
                        <button id="btn-urgent" class="btn-urgent-low priority-button" onclick="changeBackgroundColor('urgent'); return false">
                            <span>Urgent</span>
                            <img id="img-urgent-btn" src="assets/img/redArrow.svg" alt="svg">
                        </button>
                        <button id="btn-medium" class="btn-medium priority-button" onclick="changeBackgroundColor('medium'); return false">
                            <span>Medium</span>
                            <img id="img-medium-btn" src="assets/img/hypen.svg" alt="svg">
                        </button>
                        <button id="btn-low" class="btn-urgent-low priority-button" onclick="changeBackgroundColor('low'); return false">
                            <span>Low</span>
                            <img id="img-low-btn" src="assets/img/greenArrow.svg" alt="svg">
                        </button>
                    </div>
                </div>
                <div class="assigned-container-edit-card">
                    <span style="color: #2A3647" class="edit-card-text-field">Assigned to</span>
                    <div id="assigned-edit-card" class="selection-edit-card" onclick="toggleAssignedContainerEditCard(event)">
                        <span id="standardOption" class="standard-option-edit-card">Select contacts to assign</span>
                        <img id="dropdown-arrow-edit-card" class="dropdownArrow" src="assets/img/dropdownArrow.svg">
                    </div>
                    <div id="show-assigned-contacts-edit-card" class="assigned-contacts-container-edit-card">
                        ${assignedContactsHTML}
                    </div>
                    <div id="show-chosen-initials-edit-card" class="showChosenInitials"></div>
                </div>
                <div class="subtasks-container-edit-card">
                    <span style="color: #2A3647">Subtask</span>
                    <div class="subtasks-input-edit-card">
                        <input id="subtasks-edit-card" type="text" placeholder="Add new subtask">
                        <img class="plus-button-edit-card" src="assets/img/+.svg" onclick="addNewSubtaskInEditCard(${task.id})">
                    </div>
                </div>
                <div id="new-subtask-edit-card">
                    ${subtasksHTMLEditCard}
                </div>
                <div class="button-edit-card-container"><button type="submit" class="button-edit-card"><span class="button-edit-card-text">Ok</span><img src="./assets/img/check.svg" alt=""></button></div>
            </form>
        </div>
        <div id="task-edited-container" class="d-none">
            <span>Task succesfully edited</span>
            <img src="./assets/img/task_added.svg" alt="">
        </div>
    `;
}


/**
 * Renders a form to add a new task.
 * 
 * @returns {string} - HTML string representing the add task form.
 */
function renderAddTaskForm() {
    return /*html*/`
        <form id="task-form" class="add-task-template" onsubmit="addTaskFromTemplate(); return false" onclick="hideContacts(event)">
            <div class="add-task-top-container">
                <div class="headline-template">
                    Add Task
                </div>
                <a class="close-button-template" onclick="closePopup('task-form')"><img src="./assets/img/close.svg" alt=""></a>
            </div>
            <div class="outer-container">
                <div class="left-side-template">
                    <div class="add-task-template-small-container">
                        <span class="add-task-text-field">Title<span class="star">*</span></span>
                        <div>
                            <input id="title-template" type="text" class="inputfield-title" placeholder="Enter a title" required>
                        </div>
                    </div>
                    <div class="add-task-template-small-container">
                        <span class="add-task-text-field">Description</span>
                        <div>
                            <textarea id="description-template" placeholder="Enter a Description" class="smallinputfieldDescription" cols="30" rows="10"></textarea>
                        </div>
                    </div>
                    <div class="add-task-template-assigned-container">
                        <span class="add-task-text-field" style="margin-bottom: 8px;">Assigned to</span>
                        <div id="assigned-template" class="selection" onclick="toggleAssignedContainer(event)">
                            <span id="standardOption">Select contacts to assign</span>
                            <img id="dropdown-arrow" class="dropdownArrow" src="assets/img/dropdownArrow.svg">
                        </div>
                        <div id="show-assigned-contacts" class="show-contacts-to-assign-container"></div>
                        <div id="show-chosen-initials" class="showChosenInitials"></div>
                    </div>
                </div>
                <div class="add-task-seperator"></div>
                <div class="right-side-template">
                    <div class="add-task-template-small-container">
                        <span class="add-task-text-field">Due Date <span class="star">*</span></span>
                        <div>
                            <input id="date-template" type="date" name="date" class="inputfieldTitle" required>
                        </div>
                    </div>
                    <div class="priority-buttons-container-template">
                        <span class="add-task-text-field">Prio</span>
                        <div class="priority-buttons-container">
                            <button id="btn-urgent" class="btn-urgent-low priority-button" onclick="changeBackgroundColor('urgent'); return false">
                                <span>Urgent</span>
                                <img id="img-urgent-btn" src="assets/img/redArrow.svg" alt="svg">
                            </button>
                            <button id="btn-medium" class="btn-medium priority-button" onclick="changeBackgroundColor('medium'); return false">
                                <span>Medium</span>
                                <img id="img-medium-btn" src="assets/img/hypen.svg" alt="svg">
                            </button>
                            <button id="btn-low" class="btn-urgent-low priority-button" onclick="changeBackgroundColor('low'); return false">
                                <span>Low</span>
                                <img id="img-low-btn" src="assets/img/greenArrow.svg" alt="svg">
                            </button>
                        </div>
                    </div>
                    <div class="add-task-template-small-container">
                        <span class="add-task-text-field">Category <span class="star">*</span></span>
                        <select id="category-template" class="select" required>
                            <option value="">Select task category</option>
                            <option value="User Story">User Story</option>
                            <option value="Technical Task">Technical Task</option>
                        </select>
                    </div>
                    <div class="add-task-template-small-container">
                        <span class="add-task-text-field">Subtask</span>
                        <div class="subtasks-input-edit-card">
                            <input onkeydown="handleKeyPressInTemplate(event)" class="subtasks-template" id="subtasks-template" type="text" placeholder="Add new subtask">
                            <img class="plus-img-subtask" src="assets/img/+.svg" onclick="addNewSubtaskInTemplate()">
                        </div>
                        <div id="new-subtask-template" class="new-subtask-container">
                    </div>
                </div>
            </div>
        </div>
        <div class="add-task-template-bottom">
            <div class="required-field-template">
                <p><span class="star">*</span>This field is required</p>
            </div>
            <div class="buttons-template">
                <a onclick="closePopup('task-form')" class="clear-button-template">
                    <p>Cancel</p>
                    <img src="assets/img/cancel.png">
                </a>
                <button class="create-task-button-template">
                    <p>Create Task</p>
                    <img src="assets/img/check.png">
                </button>
            </div>
        </div>
        </form>
        <div id="task-added-container" class="d-none">
            <span>Task added to board</span>
            <img src="./assets/img/task_added.svg" alt="">
        </div>
    `;
}


// **********************EMPTY-COLUMN-TEMPLATES**********************

/**
 * Renders an empty column template for 'To Do' tasks.
 * 
 * @returns {string} - HTML string representing the empty 'To Do' column.
 */
function renderEmptyToDoColumn() {
    return /*html*/`
            <div class="no-tasks-container">
                <span class="no-tasks-text">No tasks to do</span>
            </div>     
    `;
}


/**
 * Renders an empty column template for 'Done' tasks.
 * 
 * @returns {string} - HTML string representing the empty 'Done' column.
 */
function renderEmptyDoneColumn() {
    return /*html*/`
            <div class="no-tasks-container">
                <span class="no-tasks-text">No tasks done</span>
            </div>     
    `;
}


/**
 * Renders an empty column template for 'In Progress' tasks.
 * 
 * @returns {string} - HTML string representing the empty 'In Progress' column.
 */
function renderEmptyInProgressColumn() {
    return /*html*/`
    <div class="no-tasks-container">
        <span class="no-tasks-text">No tasks in progress</span>
    </div>     
`;
}


/**
 * Renders an empty column template for 'Await Feedback' tasks.
 * 
 * @returns {string} - HTML string representing the empty 'Await Feedback' column.
 */
function renderEmptyAwaitFeedbackColumn() {
    return /*html*/`
    <div class="no-tasks-container">
        <span class="no-tasks-text">No feedback awaited</span>
    </div>     
`;
}


// **********************ASSIGNED-CONTACTS-TEMPLATES**********************

/**
 * Renders HTML for assigned contacts.
 * 
 * @param {string} firstLetterName - First letter of the contact's name.
 * @param {string} firstLetterLastName - First letter of the contact's last name.
 * @param {string} contactColor - Color associated with the contact.
 * @param {string} marginClass - CSS class for margin.
 * @returns {string} - HTML string representing the assigned contacts.
 */
function renderAssignedContactsHTML(firstLetterName, firstLetterLastName, contactColor, marginClass) {
    return /*html*/`
        <div class="task-contacts-ellipse flex-center ${marginClass}" style="background-color: ${contactColor}">
            <span class="task-contacts-letters">${firstLetterName}</span><span class="task-contacts-letters">${firstLetterLastName}</span>
        </div>
`;
}


/**
 * Renders HTML for assigned contacts in detailed card.
 * 
 * @param {string} firstLetterName - First letter of the contact's name.
 * @param {string} firstLetterLastName - First letter of the contact's last name.
 * @param {string} assignedContact - Assigned contact's name.
 * @param {string} contactColor - Color associated with the contact.
 * @returns {string} - HTML string representing the assigned contacts in detailed card.
 */
function renderAssignedContactsInDetailedCard(firstLetterName, firstLetterLastName, assignedContact, contactColor) {
    return /*html*/`
    <div class="detailed-card-contact-item">
        <div class="task-contacts-ellipse flex-center" style="background-color: ${contactColor}">
            <span class="task-contacts-letters">${firstLetterName}</span><span class="task-contacts-letters">${firstLetterLastName}</span>
        </div>
        <span>${assignedContact}</span>
    </div>
`;
}


/**
 * Renders HTML for assigned contact in edit card.
 * 
 * @param {object} contact - Contact object containing details like name, initials, color, etc.
 * @returns {string} - HTML string representing the assigned contact.
 */
function renderAssignedContactsInEditCardHTML(contact) {
    return /*html*/`
        <div class="assigned-contacts-edit-card">    
            <div class="task-contacts-ellipse flex-center" style="background-color: ${contact.color}; color: white">
                <span style="font-size: 12px;">${contact.initials}</span>
            </div>
            <span>${contact.name}</span>
        </div>
    `;
}


/**
 * Renders HTML for when no contacts are assigned.
 * 
 * @returns {string} - HTML string indicating no contacts are assigned.
 */
function renderNoContactsAssignedHTML() {
    return /*html*/`
        <div class="assigned-contacts-edit-card">
            <span style="font-size: 16px; margin-left: 16px;">No contacts assigned</span>
        </div>
    `;
}