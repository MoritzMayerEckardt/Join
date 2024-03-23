function renderCard(task, backgroundColor, firstLetterName ,firstLetterLastName, progressBarHTML) {
    return /*html*/`
        <div onclick="openDetailedCard(${task.id}, event)" draggable="true" ondragstart="startDragging(${task.id})" class="task-card">
            <div style="background-color: ${backgroundColor}" class="task-category">${task.category}</div>
            <span class="task-title">${task.title}</span>
            <div class="task-description">${task.description}</div>
            ${progressBarHTML}
            <div class="task-card-bottom">
                <div class="task-assigned-container">
                    <div class="task-contacts-ellipse flex-center" style="background-color: #FF7A00">
                        <span class="task-contacts-letters">${firstLetterName}</span><span class="task-contacts-letters">${firstLetterLastName}</span>
                    </div>
                </div>
                <div><img style="width: 17px" src="../assets/img/prio_${task.priority}.svg" alt=""></div>
            </div>
        </div>      
    `;
}


function renderDetailedCard(task, backgroundColor, firstLetter, secondLetter, subtasksHTML) { 
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
                    <div class="task-contacts-ellipse flex-center" style="background-color: #1FD7C1; margin-left: -10px; border: 1px solid white">
                        <span class="task-contacts-letters">${firstLetter}</span><span class="task-contacts-letters">${secondLetter}</span>
                    </div>
                    <span style="font-size: 19px">${task.assigned}</span>
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

function renderEditCard(task, contactOptions) {
    return /*html*/`
        <div style="animation: 0.25s ease-in-out 0s 1 normal none running slideInFromRight; right: 0px;" id="card" class="edit-card-container">
            <div class="detailed-card-top-container">
                <div class="detailed-card-category"></div>
                <a onclick="closePopup()" class="detailed-card-close-button"><img src="../assets/img/close.svg" alt=""></a>
            </div>
            <div class="edit-card-top">
                <span>Title</span>
                <input class="edit-card-input-field" type="text" value="${task.title}">
            </div>
            <div class="edit-card-top">
                <span>Description</span>
                <input class="edit-card-input-field" style="height: 168px" type="text" value="${task.description}">
            </div>
            <div class="edit-card-top">
                <span>Due date</span>
                <input class="edit-card-input-field" type="date" value="${task.date}"> 
            </div>
            <div class="buttonsFrame">
                <p class="title">Priority</p>
                <div class="smallButtonsFrame">
                    <button id="urgentButton" class="urgent" onclick="changeBackgroundColor('urgent')">
                        <div class="urgentText">
                            Urgent
                        </div>
                        <div class="arrows">
                            <img id="redArrow" class="redArrow" src="assets/img/redArrow.svg" alt="svg">
                            <img id="whiteArrow" class="whiteArrow" src="assets/img/prioUrgent.svg" alt="svg">
                        </div>
                    </button>
                    <button id="mediumButton" class="medium" onclick="changeBackgroundColor('medium')">
                        <div id="mediumText" class="mediumText">
                            Medium
                        </div>
                        <div class="arrows">
                            <img id="mediumButtonPic" src="assets/img/hypen.svg" alt="svg">
                            <img id="prioMedium" class="priomedium" src="assets/img/prio_medium.svg" alt="svg">
                        </div>
                    </button>
                    <button id="lowButton" class="low" onclick="changeBackgroundColor('low')">
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
            <div class="assignedToFrame d-none">
                <p class="assignedTo">Assigned to</p>
                <select id="assigned-template" class="select">
                    <option value="">Select contacts to assign</option>
                    ${contactOptions}
                </select>
            </div>
            <div>
                <p class="subtask">Subtask</p>
                <div class="subtasks-input-edit-card">
                    <input id="subtasks-template" type="text" class="inputfieldTitle" placeholder="Add new subtask">
                    <img class="plus-button-edit-card" src="assets/img/+.svg" onclick="addNewSubtaskInTemplate()">
                </div>
            </div>
            <div id="new-subtask-template">
            </div>
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
                        <button id="urgentButton" class="urgent" onclick="changeBackgroundColor('urgent')">
                            <div class="urgentText">
                                Urgent
                            </div>
                            <div class="arrows">
                                <img id="redArrow" class="redArrow" src="assets/img/redArrow.svg" alt="svg">
                                <img id="whiteArrow" class="whiteArrow" src="assets/img/prioUrgent.svg" alt="svg">
                            </div>
                        </button>
                        <button id="mediumButton" class="medium" onclick="changeBackgroundColor('medium')">
                            <div id="mediumText" class="mediumText">
                                Medium
                            </div>
                            <div class="arrows">
                                <img id="mediumButtonPic" src="assets/img/hypen.svg" alt="svg">
                                <img id="prioMedium" class="priomedium" src="assets/img/prio_medium.svg" alt="svg">
                            </div>
                        </button>
                        <button id="lowButton" class="low" onclick="changeBackgroundColor('low')">
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
                    <input id="subtasks-template" type="text" class="inputfieldTitle" placeholder="Add new subtask">
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
