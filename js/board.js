async function initBoard() {
    await includeHTML();
    await loadTasks();
    await loadContacts();
    addBackgroundColor(2);
    renderBoard(); 
}

function renderBoard() {
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}

function renderToDo() {
    let toDoContainer = document.getElementById('to-do-column');
    toDoContainer.innerHTML = '';
    if (tasks && tasks.length >= 1) {
        let toDo = tasks.filter(task => task.boardCategory === "toDo");
        if (toDo && toDo.length >= 1) {
            for (let index = 0; index < toDo.length; index++) {
                const task = toDo[index];
                toDoContainer.innerHTML += renderCard(task, index);
            }
        } else {
            toDoContainer.innerHTML = renderEmptyToDoColumn();
        }
    } else {
        toDoContainer.innerHTML = renderEmptyToDoColumn();
    }
}

function renderInProgress() {
    let inProgressContainer = document.getElementById('in-progress-column');
    inProgressContainer.innerHTML = '';
    if (tasks && tasks.length >= 1) {
        let inProgress = tasks.filter(task => task.boardCategory === "inProgress");
        if (inProgress && inProgress.length >= 1) {
            for (let index = 0; index < inProgress.length; index++) {
                const task = inProgress[index];
                inProgressContainer.innerHTML += renderCard(task, index);
            }
        } else {
            inProgressContainer.innerHTML = renderEmptyInProgressColumn();
        }
    } else {
        inProgressContainer.innerHTML = renderEmptyInProgressColumn();
    }
}

function renderAwaitFeedback() {
    let awaitFeedbackContainer = document.getElementById('await-feedback-column');
    awaitFeedbackContainer.innerHTML = '';
    if (tasks && tasks.length >= 1) {
        let awaitFeedback = tasks.filter(task => task.boardCategory === "awaitFeedback");
        if (awaitFeedback && awaitFeedback.length >= 1) {
            for (let index = 0; index < awaitFeedback.length; index++) {
                const task = awaitFeedback[index];
                awaitFeedbackContainer.innerHTML += renderCard(task, index);
            }
        } else {
            awaitFeedbackContainer.innerHTML = renderEmptyAwaitFeedbackColumn();
        }
    } else {
        awaitFeedbackContainer.innerHTML = renderEmptyAwaitFeedbackColumn();
    }
}

function renderDone() {
    let doneContainer = document.getElementById('done-column');
    doneContainer.innerHTML = '';
    if (tasks && tasks.length >= 1) {
        let done = tasks.filter(task => task.boardCategory === "done"); 
        if (done && done.length >= 1) {
            for (let index = 0; index < done.length; index++) {
                const task = done[index];
                doneContainer.innerHTML += renderCard(task, index);
            }
        } else {
            doneContainer.innerHTML = renderEmptyDoneColumn();
        }
    } else {
        doneContainer.innerHTML = renderEmptyDoneColumn();
    }
}

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

function prepareBackgroundColorTaskCategory(category) {
    let backgroundColor = getBackgroundColorFromTaskCategory(category);
    return backgroundColor;
}

function renderCard(task, index) {
    let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
    let taskJson = JSON.stringify(task);
    taskJson = taskJson.replace(/"/g, '&quot;');
    let name = task.assigned;
    let allsubtasks = task.subtasks ? task.subtasks.length : 0;
    let firstLetterName = getInitialsFromName(name);
    let firstLetterLastName = getInitialsFromLastName(name);
    let subtasksText = allsubtasks > 0 ? `${allsubtasks}/${allsubtasks} Subtasks` : 'No Subtasks';
    let progressBarClass = allsubtasks === 0 ? "empty" : allsubtasks === 1 ? "half-filled" : "full";
    return /*html*/`
        <div onclick="openDetailedCard('${taskJson}', ${index}, event)" draggable="true" ondragstart="startDragging(${task.id})" class="task-card">
            <div style="background-color: ${backgroundColor}" class="task-category">${task.category}</div>
            <span class="task-title">${task.title}</span>
            <div class="task-description">${task.description}</div>  
            <div class="task-subtasks-container">
                <div class="task-progress-bar">
                    <div class="task-progress-bar-progress ${progressBarClass}"></div>
                </div>
                <span class="task-subtasks-text">${subtasksText}</span>
            </div>
            <div class="task-card-bottom">
                <div class="task-assigned-container">
                    <div class="task-contacts-ellipse flex-center" style="background-color: #FF7A00">
                        <span class="task-contacts-letters">${firstLetterName}</span><span class="task-contacts-letters">${firstLetterLastName}</span>
                    </div>
                    <div class="task-contacts-ellipse flex-center" style="background-color: #1FD7C1; margin-left: -10px; border: 1px solid white">
                        <span class="task-contacts-letters">M</span><span class="task-contacts-letters">B</span>
                    </div>
                    <div class="task-contacts-ellipse flex-center" style="background-color: #462F8A; margin-left: -10px; border: 1px solid white">
                        <span class="task-contacts-letters">F</span><span class="task-contacts-letters">K</span>
                    </div>
                </div>
                <div><img style="width: 17px" src="../assets/img/prio_urgent.svg" alt=""></div>
            </div>
        </div>      
    `;
}



function getInitialsFromName(name) {
    let firstLetterName = name.charAt(0);
    return firstLetterName;
}

function getInitialsFromLastName(name) {
    let spaceIndex = name.indexOf(' ');
    let lastName = name.substring(spaceIndex + 1);
    let firstLetterLastName = lastName.charAt(0);
    return firstLetterLastName;
}

function getProgressOfSubtasks(subtask) {
   
}

function openDetailedCard(task, index, event) {
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderDetailedCard(task, index);
    event.stopPropagation();
}

function renderDetailedCard(taskJson, index) {
    let task = JSON.parse(taskJson);
    let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
    let name = task.assigned;
    let firstLetter = getInitialsFromName(name);
    let secondLetter = getInitialsFromLastName(name);
    let subtasksHTML = /*html*/`
    <div class="detailed-card-subtasks-container">
        <span style="font-size: 20px; color: #42526E">Subtasks</span>
        <div>
    `;
    if (task.subtasks && task.subtasks.length > 0) {
        for (let i = 0; i < task.subtasks.length; i++) {
            subtasksHTML += `<li style="font-size: 19px">${task.subtasks[i]}</li>`;
        }
    } else {
        subtasksHTML += `<div style="font-size: 19px">No subtasks</div>`;
    }
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
                <span style="font-size: 19px">${task.priority}</span>
            </div>
            <div class="detailed-card-assigned">
                <div style="font-size: 20px; color: #42526E">Assigned To:</div>
                <div class="detailed-card-contact-container">
                    <div class="task-contacts-ellipse flex-center" style="background-color: #1FD7C1; margin-left: -10px; border: 1px solid white">
                        <span class="task-contacts-letters">${firstLetter}</span><span class="task-contacts-letters">${secondLetter}</span>
                    </div>
                    <span style="font-size: 19px">${name}</span>
                </div>
            </div>
            ${subtasksHTML}
            <div class="detailed-card-bottom">
                <div class="flex-center" style="width: 159px; gap: 8px;">
                    <div onclick="deleteTask(${task.id})" class="detailed-card-delete-container"><img src="../assets/img/delete.svg" alt=""><span>Delete</span></div>
                    <div onclick="editTask('${taskJson}')" class="detailed-card-edit-container"><img src="../assets/img/edit-dark-blue.svg" alt=""><span>Edit</span></div>
                </div>
            </div>
        </div>
    `;
}

async function deleteTask(taskId) {
    let selectedTask = tasks.findIndex(task => task.id === taskId);
    if (selectedTask !== -1) {
        tasks.splice(selectedTask, 1);
        await postData();
        renderBoard();
        closePopup();
    }
}

function closePopup() {
    let popupOverlay = document.getElementById('popup-board-overlay');
    popupOverlay.classList.add('d-none');
}

function closeAddTaskForm() {
    let popupOverlay = document.getElementById('popup-board-overlay');
    let taskForm = document.getElementById('task-form');
    taskForm.style.animation = 'slideOutToRight 0.3s ease-in-out';
    taskForm.style.right = '-200%';
    setTimeout(() => {
        popupOverlay.classList.add('d-none');
    }, 200);
}

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        let card = document.getElementById('card');
        let taskForm = document.getElementById('task-form');
        if (card && card.contains(event.target)) {
        } else if (taskForm && taskForm.contains(event.target)) {
        } else {
            closePopup();
        }
    });
});

function showAddTaskForm(event) {
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderAddTaskForm();
    event.stopPropagation();
}

function renderAddTaskForm() {
    let contactOptions = '';
    for (let index = 0; index < contacts.length; index++) {
        const contact = contacts[index];
        contactOptions += `<option value="${contact.name}">${contact.name}</option>`;
    }
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

async function addTaskFromTemplate() {
    createTasksIfNotCreated();
    pushValuesToTasksFromTemplate();
    await postData();
    saveTaskIdCounter();
    closeAddTaskForm();
    renderBoard();
}

function getValuesFromInputFromTemplate() {
    let title = document.getElementById('title-template').value;
    let description = document.getElementById('description-template');
    let assigned = document.getElementById('assigned-template');
    let date = document.getElementById('date-template');
    let category = document.getElementById('category-template');
    return { title, description, assigned, date, category };
}

function pushValuesToTasksFromTemplate() {
    let boardCategory = "toDo";
    let { title, description, assigned, date, category } = getValuesFromInputFromTemplate();
    tasks.push({
        id: taskIdCounter++,
        title: title,
        description: description.value,
        assigned: assigned.value,
        date: date.value,
        subtasks: subtaskArray,
        category: category.value,
        boardCategory: boardCategory,
    });
}

function addNewSubtaskInTemplate() {
    let addNewSubtask = document.getElementById('subtasks-template').value;

    if (subtaskArray.length < 2) {
        subtaskArray.push(addNewSubtask);
        getNewSubtaskInTemplate();
    } else {
        alert("You can only add a maximum of two subtasks.");
    }
}

function getNewSubtaskInTemplate() {
    let newSubtask = document.getElementById('new-subtask-template');
    newSubtask.innerHTML = ``;
    for (i = 0; i < subtaskArray.length; i++) {
        newSubtask.innerHTML += `
        <div> 
             <b> •${subtaskArray[i]} </b> 
         </div>`
    }
    document.getElementById('subtasks-template').value = ``;
}

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



