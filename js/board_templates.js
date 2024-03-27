function renderCard(task, backgroundColor, progressBarHTML, assignedContactsHTML) {
    return /*html*/`
        <div onclick="openDetailedCard(${task.id}, event)" draggable="true" ondragstart="startDragging(${task.id})" class="task-card">
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
        <div style="animation: 0.25s ease-in-out 0s 1 normal none running slideInFromRight; right: 0px;" id="card" class="detailed-card-container">
            <div class="detailed-card-top-container">
                <div style="background-color: ${backgroundColor}" class="detailed-card-category">${task.category}</div>
                <a onclick="closePopup()" class="detailed-card-close-button"><img src="../assets/img/close.svg" alt=""></a>
            </div>
            <span class="detailed-card-title">${task.title}</span>
            <span class="detailed-card-description">${task.description}</span>
            <div class="detailed-card-date">
                <span style="font-size: 20px; color: #42526E">Due date:</span>
                <span style="font-size: 19px">${task.date}</span>
            </div>
            <div class="detailed-card-priority">
                <span style="font-size: 20px; color: #42526E">Priority:</span>
                <div class="detailed-card-priority-text"><span style="font-size: 19px">${task.priority}</span><img src="../assets/img/prio_${task.priority}.svg" alt=""></div>
            </div>
            <div class="detailed-card-assigned">
                <div style="font-size: 20px; color: #42526E">Assigned To:</div>
                <div class="detailed-card-contact-container">
                    ${assignedContactsHTML}
                </div>
            </div>
            <div class="detailed-card-subtasks-container">
                <span style="font-size: 20px; color: #42526E">Subtasks</span>
                <div id="subtasks-container-detailed-card">${subtasksHTML}</div>
            </div>
            <div class="detailed-card-bottom">
                <div class="flex-center" style="width: 159px; gap: 8px;">
                    <div onmouseover="changeColorOfDeleteButton()" onmouseout="changeColorOfDeleteButton2()" onclick="deleteTask(${task.id})" class="detailed-card-delete-container"><img id="delete-img" src="../assets/img/delete-dark-blue.svg" alt=""><span>Delete</span></div>
                    <div style="height: 24px; width: 1px; background: #D1D1D1"></div>
                    <div onmouseover="changeColorOfEditButton()" onmouseout="changeColorOfEditButton2()" onclick="openEditCard(${task.id}, event)" class="detailed-card-edit-container"><img id="edit-img" src="../assets/img/edit-dark-blue.svg" alt=""><span>Edit</span></div>
                </div>
            </div>
        </div>
    `;
}

function renderEditCard(task, contactOptions, subtasksHTMLEditCard, assignedContactsHTML) {
    return /*html*/`
        <div style="animation: 0.25s ease-in-out 0s 1 normal none running slideInFromRight; right: 0px;" id="card" class="edit-card-container">
            <form class="form-edit-card" onsubmit="editTask(${task.id}); return false">    
                <div class="edit-card-top-container">
                    <div class="detailed-card-category"></div>
                    <a onclick="closePopup()" class="detailed-card-close-button"><img src="../assets/img/close.svg" alt=""></a>
                </div>
                <div class="edit-card-top">
                    <span style="font-size: 20px; color: #2A3647">Title</span>
                    <input required placeholder="Enter a title" id="title-edit-card" class="edit-card-input-field" type="text" value="${task.title}">
                </div>
                <div class="edit-card-top">
                    <span style="font-size: 20px; color: #2A3647">Description</span>
                    <textarea placeholder="Enter a description" id="description-edit-card" class="edit-card-input-field" style="height: 168px" type="text">${task.description}</textarea>
                </div>
                <div class="edit-card-top">
                    <span style="font-size: 20px; color: #2A3647">Due date</span>
                    <input id="date-edit-card" class="edit-card-input-field" type="date" value="${task.date}" required> 
                </div>
                <div class="priority-container-edit-card">
                    <span class="title">Priority</span>
                    <div class="smallButtonsFrame">
                        <button id="urgentButton" class="urgent" onclick="changeBackgroundColor('urgent'); return false">
                            <div class="urgentText">
                                Urgent
                            </div>
                            <div class="arrows">
                                <img id="redArrow" class="redArrow" src="assets/img/redArrow.svg" alt="svg">
                                <img id="whiteArrow" class="arrow-white" src="assets/img/prioUrgent.svg" alt="svg">
                            </div>
                        </button>
                        <button id="mediumButton" class="medium" onclick="changeBackgroundColor('medium'); return false">
                            <div id="mediumText" class="mediumText">
                                Medium
                            </div>
                            <div class="arrows" style="position: relative">
                                <img id="mediumButtonPic" src="assets/img/hypen.svg" alt="svg">
                                <img id="prioMedium" class="arrow-white-medium" src="assets/img/prio_medium.svg" alt="svg">
                            </div>
                        </button>
                        <button id="lowButton" class="low" onclick="changeBackgroundColor('low'); return false">
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
                <div class="assigned-container-edit-card">
                    <span style="font-size: 20px; color: #2A3647">Assigned to</span>
                    <select id="assigned-edit-card" class="select">
                        <option value="${task.assigned}">Select contacts to assign</option>
                        ${contactOptions}
                    </select>
                    <div class="detailed-card-contact-container">${assignedContactsHTML}</div>
                </div>
                <div class="subtasks-container-edit-card">
                    <span style="font-size: 20px; color: #2A3647">Subtask</span>
                    <div class="subtasks-input-edit-card">
                        <input id="subtasks-edit-card" type="text" class="inputfieldTitle" placeholder="Add new subtask">
                        <img class="plus-button-edit-card" src="assets/img/+.svg" onclick="addNewSubtaskInEditCard(${task.id})">
                    </div>
                </div>
                <div id="new-subtask-edit-card">
                    ${subtasksHTMLEditCard}
                </div>
                <div class="button-edit-card-container"><button type="submit" class="button-edit-card"><span class="button-edit-card-text">Ok</span><img src="../assets/img/check.svg" alt=""></button></div>
            </form>
        </div>
        

    `;
}



function renderAddTaskForm(contactOptions) {
    return /*html*/`
        <form style="animation: 0.25s ease-in-out 0s 1 normal none running slideInFromRight; right: 0px;" id="task-form" class="add-task-template" onsubmit="addTaskFromTemplate(); return false">
            <div class="headline-template">
                Add Task
            </div>
            <a class="close-button-template" onclick="closeAddTaskForm()"><img src="../assets/img/close.svg" alt=""></a>
            <div class="left-side-template">
                <div class="titleFrame">
                    <p class="title">Title <span class="star">*</span></p>
                    <div class="inputTitle">
                        <input id="title-template" type="text" class="inputfieldTitle" placeholder="Enter a title"
                            required>
                    </div>
                </div>
                <div class="descriptionFrame">
                    <p class="description">Description</p>
                    <div class="inputfieldDescription">
                        <textarea name="smallinputfieldDescription" id="description-template"
                            placeholder="Enter a Description" class="smallinputfieldDescription" cols="30"
                            rows="10"></textarea>
                    </div>
                </div>
                <div class="assignedToFrame">
                    <p class="assignedTo">Assigned to</p>
                    <select id="assigned-template" class="select">
                        <option value="">Select contacts to assign</option>
                        ${contactOptions}
                    </select>
                </div>
            </div>
            <div class="right-side-template">
                <div class="titleFrame">
                    <p class="title">Due Date <span class="star">*</span></p>
                    <div class="inputTitle">
                        <input id="date-template" type="date" name="date" class="inputfieldTitle" required>
                    </div>
                </div>
                <div class="buttonsFrame">
                    <p class="title">Prio</p>
                    <div class="smallButtonsFrame">
                        <button id="urgentButton" class="urgent" onclick="changeBackgroundColor('urgent'); return false">
                            <div class="urgentText">
                                Urgent
                            </div>
                            <div class="arrows">
                                <img id="redArrow" class="redArrow" src="assets/img/redArrow.svg" alt="svg">
                                <img id="whiteArrow" class="whiteArrow" src="assets/img/prioUrgent.svg" alt="svg">
                            </div>
                        </button>
                        <button id="mediumButton" class="medium" onclick="changeBackgroundColor('medium'); return false">
                            <div id="mediumText" class="mediumText">
                                Medium
                            </div>
                            <div class="arrows">
                                <img id="mediumButtonPic" src="assets/img/hypen.svg" alt="svg">
                                <img id="prioMedium" class="priomedium" src="assets/img/prio_medium.svg" alt="svg">
                            </div>
                        </button>
                        <button id="lowButton" class="low" onclick="changeBackgroundColor('low'); return false">
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
                <div class="categoryFrame">
                    <p class="category">Category <span class="star">*</span></p>
                    <select id="category-template" class="select" required>
                        <option value="">Select task category</option>
                        <option value="User Story">User Story</option>
                        <option value="Technical Task">Technical Task</option>
                    </select>
                </div>
                <div class="subtaskFrame">
                    <p class="subtask">Subtask</p>
                    <input onkeydown="handleKeyPressInTemplate(event)" id="subtasks-template" type="text" class="inputfieldTitle" placeholder="Add new subtask">
                    <img src="assets/img/+.svg" class="subtaskPlus" onclick="addNewSubtaskInTemplate()">
                </div>
            </div>
            <div id="new-subtask-template" class="new-subtask-container">
            </div>
            <div class="required-field-template">
                <p><span class="star">*</span>This field is required</p>
            </div>
            <div class="buttons-template">
                <a onclick="closeAddTaskForm()" class="clear-button-template">
                    <p>Cancel</p>
                    <img src="assets/img/cancel.png">
                </a>
                <button class="create-task-button-template">
                    <p>Create Task</p>
                    <img src="assets/img/check.png">
                </button>
            </div>
        </form>
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
        <div class="flex check-box-container-subtasks">
            <img class="check-box-img" id="check-box${index}" onclick="handleCheckBox(${task.id}, ${index})" style="width: 16px; height: 16px;" src="${checkBoxImage}" alt="">
            <span style="font-size: 16px">${subtask}</span>
        </div>
    `;
}

function renderAssignedContactsHTML(firstLetterName, firstLetterLastName) {
    return /*html*/`
        <div class="task-contacts-ellipse flex-center" style="background-color: #FF7A00">
            <span class="task-contacts-letters">${firstLetterName}</span><span class="task-contacts-letters">${firstLetterLastName}</span>
        </div>
`;
}

function renderAssignedContactsInDetailedCard(task, firstLetterName, firstLetterLastName) {
    return /*html*/`
        <div class="task-contacts-ellipse flex-center" style="background-color: #FF7A00">
            <span class="task-contacts-letters">${firstLetterName}</span><span class="task-contacts-letters">${firstLetterLastName}</span>
        </div>
        <span style="font-size: 19px">${task.assigned}</span>
`;
}
