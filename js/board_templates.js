function renderCard(task, backgroundColor, progressBarHTML, assignedContactsHTML) {
    return /*html*/`
        <div onclick="openDetailedCard(${task.id})" draggable="true" ondragstart="startDragging(${task.id})" class="task-card">
            <div style="background-color: ${backgroundColor}" class="task-category">${task.category}</div>
            <span class="task-title">${task.title}</span>
            <div class="task-description">${task.description}</div>
                ${progressBarHTML}
            <div class="task-assigned-container">
                ${assignedContactsHTML}
                <img class="priority-img-card" style="width: 17px" src="../assets/img/prio_${task.priority}.svg" alt="">
            </div>
        </div>      
    `;
}

function renderDetailedCard(task, backgroundColor, assignedContactsHTML, subtasksHTML) { 
    return /*html*/`
        <div id="card" class="detailed-card-container">
            <div class="detailed-card-top-container">
                <div style="background-color: ${backgroundColor}" class="detailed-card-category">${task.category}</div>
                <a onclick="closePopup('card')" class="detailed-card-close-button"><img src="../assets/img/close.svg" alt=""></a>
            </div>
            <span class="detailed-card-title">${task.title}</span>
            <span class="detailed-card-description">${task.description}</span>
            <div class="detailed-card-date">
                <span style="color: #42526E">Due date:</span>
                <span>${task.date}</span>
            </div>
            <div class="detailed-card-priority">
                <span style="color: #42526E">Priority:</span>
                <div class="detailed-card-priority-text"><span>${task.priority}</span><img src="../assets/img/prio_${task.priority}.svg" alt=""></div>
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
                    <div onmouseover="changeColorOfDeleteButton()" onmouseout="changeColorOfDeleteButton2()" onclick="deleteTask(${task.id})" class="detailed-card-delete-container"><img id="delete-img" src="../assets/img/delete-dark-blue.svg" alt=""><span>Delete</span></div>
                    <div style="height: 24px; width: 1px; background: #D1D1D1"></div>
                    <div onmouseover="changeColorOfEditButton()" onmouseout="changeColorOfEditButton2()" onclick="openEditCard(${task.id})" class="detailed-card-edit-container"><img id="edit-img" src="../assets/img/edit-dark-blue.svg" alt=""><span>Edit</span></div>
                </div>
            </div>
        </div>
        <div id="task-deleted-container" class="d-none">
            <span>Task succesfully deleted</span>
            <img src="../assets/img/task_added.svg" alt="">
        </div>
    `;
}

function renderEditCard(task, subtasksHTMLEditCard, assignedContactsHTML) {
    return /*html*/`
        <div id="card" class="edit-card-container">
            <form class="form-edit-card" onsubmit="editTask(${task.id}); return false">    
                <div class="edit-card-top-container">
                    <div class="detailed-card-category"></div>
                    <a onclick="closePopup('card')" class="detailed-card-close-button"><img src="../assets/img/close.svg" alt=""></a>
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
                <div class="priority-container-edit-card">
                    <span class="title-priority-edit-card">Priority</span>
                    <div class="smallButtonsFrame priority-buttons-container">
                        <button id="urgentButton" class="urgent priority-button" onclick="changeBackgroundColor('urgent'); return false">
                            <div class="urgentText">
                                Urgent
                            </div>
                            <div class="arrows">
                                <img id="redArrow" class="redArrow" src="assets/img/redArrow.svg" alt="svg">
                                <img id="whiteArrow" class="arrow-white" src="assets/img/prioUrgent.svg" alt="svg">
                            </div>
                        </button>
                        <button id="mediumButton" class="medium priority-button" onclick="changeBackgroundColor('medium'); return false">
                            <div id="mediumText" style="font-size: 20px">
                                Medium
                            </div>
                            <div class="arrows" style="position: relative">
                                <img id="mediumButtonPic" src="assets/img/hypen.svg" alt="svg">
                                <img id="prioMedium" class="arrow-white-medium" src="assets/img/prio_medium.svg" alt="svg">
                            </div>
                        </button>
                        <button id="lowButton" class="low priority-button" onclick="changeBackgroundColor('low'); return false">
                            <div class="lowText">
                                Low
                            </div>
                            <div class="arrows">
                                <img id="greenArrow" class="greenArrow" src="assets/img/greenArrow.svg" alt="svg">
                                <img id="whiteArrowLow" class="arrow-white" src="assets/img/prioLow.svg">
                            </div>
                        </button>
                    </div>
                </div>
                <div>
                    <span style="color: #2A3647">Assigned to</span>
                    <div style="margin-top: 14px; margin-bottom: 14px" id="assigned-edit-card" class="selection" onclick="toggleAssignedContainerEditCard(event)">
                        <p id="standardOption" class="standardOption standard-option-edit-card">Select contacts to assign</p>
                        <img id="dropdown-arrow-edit-card" class="dropdownArrow" src="assets/img/dropdownArrow.svg">
                    </div>
                    <div id="show-assigned-contacts-edit-card" class="assigned-contacts-container-edit-card">
                        ${assignedContactsHTML}
                    </div>
                    <div style="margin-top: 8px" id="show-chosen-initials-edit-card" class="showChosenInitials"></div>
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
                <div class="button-edit-card-container"><button type="submit" class="button-edit-card"><span class="button-edit-card-text">Ok</span><img src="../assets/img/check.svg" alt=""></button></div>
            </form>
        </div>
        <div id="task-edited-container" class="d-none">
            <span>Task succesfully edited</span>
            <img src="../assets/img/task_added.svg" alt="">
        </div>
    `;
}

function renderAddTaskForm() {
    return /*html*/`
        <form id="task-form" class="add-task-template" onsubmit="addTaskFromTemplate(); return false">
            <div class="add-task-top-container">
                <div class="headline-template">
                    Add Task
                </div>
                <a class="close-button-template" onclick="closePopup('task-form')"><img src="../assets/img/close.svg" alt=""></a>
            </div>
            <div class="outer-container">
                <div class="left-side-template">
                    <div class="add-task-template-small-container">
                        <span class="add-task-text-field">Title<span class="star">*</span></span>
                        <div>
                            <input id="title-template" type="text" class="inputfieldTitle" placeholder="Enter a title" required>
                        </div>
                    </div>
                    <div class="add-task-template-small-container">
                        <span class="add-task-text-field">Description</span>
                        <div>
                            <textarea name="smallinputfieldDescription" id="description-template" placeholder="Enter a Description" class="smallinputfieldDescription" cols="30" rows="10"></textarea>
                        </div>
                    </div>
                    <div class="add-task-template-assigned-container">
                        <span class="add-task-text-field" style="margin-bottom: 8px;">Assigned to</span>
                        <div id="assigned-template" class="selection" onclick="toggleAssignedContainer()">
                            <span id="standardOption">Select contacts to assign</span>
                            <img id="dropdown-arrow" class="dropdownArrow" src="assets/img/dropdownArrow.svg">
                        </div>
                        <div id="show-assigned-contacts" class="showContactsToAssign"></div>
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
                        <div class="smallButtonsFrame priority-buttons-container">
                            <button id="urgentButton" class="urgent priority-button" onclick="changeBackgroundColor('urgent'); return false">
                                <div class="urgentText">
                                    Urgent
                                </div>
                                <div class="arrows">
                                    <img id="redArrow" class="redArrow" src="assets/img/redArrow.svg" alt="svg">
                                    <img id="whiteArrow" class="whiteArrow" src="assets/img/prioUrgent.svg" alt="svg">
                                </div>
                            </button>
                            <button id="mediumButton" class="medium priority-button" onclick="changeBackgroundColor('medium'); return false">
                                <div id="mediumText" style="font-size: 20px;">
                                    Medium
                                </div>
                                <div class="arrows">
                                    <img id="mediumButtonPic" style="width: 22px" src="assets/img/hypen.svg" alt="svg">
                                    <img id="prioMedium" style="width: 22px" class="priomedium" src="assets/img/prio_medium.svg" alt="svg">
                                </div>
                            </button>
                            <button id="lowButton" class="low priority-button" onclick="changeBackgroundColor('low'); return false">
                                <div class="lowText">
                                    Low
                                </div>
                                <div class="arrows">
                                    <img id="greenArrow" class="greenArrow" src="assets/img/greenArrow.svg" alt="svg">
                                    <img id="whiteArrowLow" class="whiteArrowLow" src="assets/img/prioLow.svg">
                                </div>
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
            <img src="../assets/img/task_added.svg" alt="">
        </div>
    `;
}


// **********************EMPTY-COLUMN-TEMPLATES**********************

function renderEmptyToDoColumn() {
    return /*html*/`
            <div class="no-tasks-container">
                <span class="no-tasks-text">No tasks to do</span>
            </div>     
    `;
}

function renderEmptyDoneColumn() {
    return /*html*/`
            <div class="no-tasks-container">
                <span class="no-tasks-text">No tasks done</span>
            </div>     
    `;
}

function renderEmptyInProgressColumn() {
    return /*html*/`
    <div class="no-tasks-container">
        <span class="no-tasks-text">No tasks in progress</span>
    </div>     
`;
}

function renderEmptyAwaitFeedbackColumn() {
    return /*html*/`
    <div class="no-tasks-container">
        <span class="no-tasks-text">No feedback awaited</span>
    </div>     
`;
}

// **********************SUBTASKS-TEMPLATES**********************

function renderSubtasksListInEditCard(task, subtasks, subtask, index) {
    return /*html*/`
    <div>
        <div id="subtask${index}" onmouseover="showEditImages(${index})" onmouseout="removeEditImages(${index})" class="subtask-container-edit-card">
            <li class="subtask-list-edit-card">${subtask}</li>
            <div class="edit-card-edit-container d-none" id="edit-container${index}">
                <div class="subtasks-img"><img class="subtask-img" onclick="editSubtask(${index})" style="height: 20px" src="../assets/img/edit-dark-blue.svg" alt=""></div>
                <div style="height: 18px; width: 2px; background: lightgrey"></div>
                <div class="subtasks-img"><img class="subtask-img" onclick="deleteSubtask(${task.id}, ${index})" style="height: 20px" src="../assets/img/delete-dark-blue.svg" alt=""></div>
            </div>
        </div>
        <div id="edit-subtask-container${index}" class="edit-subtask-container d-none">
            <input id="subtask-input${index}" class="subtask-input" value="${subtasks[index].title}">
            <div class="edit-card-edit-container">
                <div class="subtasks-img"><img onclick="emptyInputSubtask(${index})" style="height: 14px" src="../assets/img/delete.svg" alt=""></div>
                <div style="width: 2px; height: 18px; background: lightgrey"></div>
                <div class="subtasks-img"><img onclick="saveSubtask(${task.id}, ${index})" style="height: 14px" src="../assets/img/check_blue.svg" alt=""></div>
            </div>
        </div>
    </div>
    `;
}

function renderSubtasksHTMLInEditCard(task, index, subtasks, subtask) {
    return /*html*/`
    <div onmouseover="showEditImages(${index + subtasks.length})" onmouseout="removeEditImages(${index + subtasks.length})" class="subtask-container-edit-card">
        <li class="subtask-list-edit-card" id="subtask${index + subtasks.length}">${subtask}</li>
        <div class="edit-card-edit-container d-none" id="edit-container${index + subtasks.length}">
            <img style="height: 18px" src="../assets/img/edit-dark-blue.svg" alt="">
            <div style="height: 18px; width: 1px; background: lightgrey"></div>
            <img onclick="deleteSubtask(${task.id}, ${index})" style="height: 18px" src="../assets/img/delete-dark-blue.svg" alt="">
        </div>
    </div>
`;
}

function renderProgressBar(progressBarClass, subtasksText) {
    return /*html*/`
            <div class="task-subtasks-container">
                <div id="progress-bar" class="task-progress-bar">
                    <div class="task-progress-bar-progress ${progressBarClass}"></div>
                </div>
                <span class="task-subtasks-text">${subtasksText}</span>
            </div>
        `;
}

function renderSubtaskHTML(task, subtask, checkBoxImage, index) {
    return /*html*/`
        <div onclick="handleCheckBox(${task.id}, ${index})" class="flex check-box-container-subtasks">
            <img class="check-box-img" id="check-box${index}" style="width: 16px; height: 16px;" src="${checkBoxImage}" alt="">
            <span class="checkbox-text">${subtask}</span>
        </div>
    `;
}


// **********************ASSIGNED-CONTACTS-TEMPLATES**********************

function renderAssignedContactsHTML(firstLetterName, firstLetterLastName, contactColor, marginClass) {
    return /*html*/`
        <div class="task-contacts-ellipse flex-center ${marginClass}" style="background-color: ${contactColor}">
            <span class="task-contacts-letters">${firstLetterName}</span><span class="task-contacts-letters">${firstLetterLastName}</span>
        </div>
`;
}

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

function renderChosenInitialsEditCard(contact) {
    return /*html*/`
    <div class="assigned-contacts-edit-card">    
        <div class="task-contacts-ellipse flex-center" style="background-color: ${contact.color}; color: white">
            <span style="font-size: 12px;">${contact.initials}</span>
        </div>
        <span>${contact.name}</span>
    </div>
    `;
}

function renderContactsForAssignEditCard(contact, i) {
    /*html*/`
        <div id="newcontact-edit-card${i}" class="newcontact" onclick="handleContactClickEditCardWrapper(contactElement, ${i})">
            <div class="circle" style="background-color: ${contact.color};">
                <p>${contact.initials}</p>
            </div>
            <div class="nameAndCheckbox">    
                <p class="contactName">${contact.name}</p>
                <input type="checkbox" id="checkbox-edit-card${i}" class="checkBox">
            </div> 
        </div>`;
}
