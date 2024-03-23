async function initBoard() {
    await includeHTML();
    await loadTasks();
    await loadContacts();
    addBackgroundColor(2);
    renderColumns(); 
}

function filterTasksByCategory(tasks, category) {
    return tasks.filter(task => task.boardCategory === category);
}

function renderEmptyColumns(columns) {
    for (const column of columns) {
        let container = document.getElementById(column.containerId);
        container.innerHTML = column.emptyRenderer();
    }
}

function renderTasksInColumn(tasksInColumn, container) {
    for (let index = 0; index < tasksInColumn.length; index++) {
        const task = tasksInColumn[index];
        container.innerHTML += renderCard(task, index);
    }
}

function renderColumns() {
    let columns = [
        { category: "toDo", containerId: "to-do-column", emptyRenderer: renderEmptyToDoColumn },
        { category: "inProgress", containerId: "in-progress-column", emptyRenderer: renderEmptyInProgressColumn },
        { category: "awaitFeedback", containerId: "await-feedback-column", emptyRenderer: renderEmptyAwaitFeedbackColumn },
        { category: "done", containerId: "done-column", emptyRenderer: renderEmptyDoneColumn }
    ];
    if (!tasks || tasks.length === 0) {
        renderEmptyColumns(columns);
        return;
    }
    for (const column of columns) {
        let container = document.getElementById(column.containerId);
        container.innerHTML = '';
        let tasksInColumn = filterTasksByCategory(tasks, column.category);
        if (tasksInColumn && tasksInColumn.length >= 1) {
            renderTasksInColumn(tasksInColumn, container);
        } else {
            container.innerHTML = column.emptyRenderer();
        }
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
    let priority = task.priority;
    let subtasksCompleted = task.subtasks ? task.subtasks.filter(subtask => subtask.isChecked).length : 0;
    let allsubtasks = task.subtasks ? task.subtasks.length : 0;
    let firstLetterName = getInitialsFromName(name);
    let firstLetterLastName = getInitialsFromLastName(name);
    let subtasksText = allsubtasks > 0 ? `${subtasksCompleted}/${allsubtasks} Subtasks` : 'No Subtasks';
    let progressBarClass = allsubtasks === 0 ? "empty" : subtasksCompleted === 0 ? "empty" : subtasksCompleted === allsubtasks ? "full" : "half-filled";
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
                <div><img style="width: 17px" src="../assets/img/prio_${priority}.svg" alt=""></div>
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

function openDetailedCard(task, index, event) {
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderDetailedCard(task, index);
    event.stopPropagation();
}

function handleCheckBox(taskId, index) {
    let task = tasks.find(task => task.id === taskId);
    let subtask = task.subtasks[index];
    let checkBox = document.getElementById(`check-box${index}`);
    if (subtask.isChecked) {
        checkBox.setAttribute('src', '../assets/img/check_button_empty.svg');
    } else {
        checkBox.setAttribute('src', '../assets/img/check_button_check.svg');
    }
    subtask.isChecked = !subtask.isChecked;
    postData("/tasks", task);
    renderColumns();
}


function renderDetailedCard(taskJson) {
    let task = JSON.parse(taskJson);
    let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
    let name = task.assigned;
    let subtasks = task.subtasks;
    let firstLetter = getInitialsFromName(name);
    let secondLetter = getInitialsFromLastName(name);
    let subtasksHTML = "";
    if (task.subtasks && subtasks.length > 0) {
        for (let i = 0; i < subtasks.length; i++) {
            const subtask = subtasks[i].title;
            const isChecked = subtasks[i].isChecked; 
            const checkBoxImage = isChecked ? '../assets/img/check_button_check.svg' : '../assets/img/check_button_empty.svg'; // Determine image based on isChecked
            subtasksHTML += /*html*/`
                <div class="flex check-box-container-subtasks">
                    <img class="check-box-img" id="check-box${i}" onclick="handleCheckBox(${task.id}, ${i})" style="width: 16px; height: 16px;" src="${checkBoxImage}" alt="">
                    <span style="font-size: 16px">${subtask}</span>
                </div>
            `;
        }
    } else {
        subtasksHTML = `<div style="font-size: 16px">No subtasks</div>`;
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
                <div class="detailed-card-priority-text"><span style="font-size: 19px">${task.priority}</span><img src="../assets/img/prio_${task.priority}.svg" alt=""></div>
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
            <div class="detailed-card-subtasks-container">
                <span style="font-size: 20px; color: #42526E">Subtasks</span>
                <div id="subtasks-container-detailed-card">${subtasksHTML}</div>
            </div>
            <div class="detailed-card-bottom">
                <div class="flex-center" style="width: 159px; gap: 8px;">
                    <div onmouseover="changeColorOfDeleteButton()" onmouseout="changeColorOfDeleteButton2()" onclick="deleteTask(${task.id})" class="detailed-card-delete-container"><img id="delete-img" src="../assets/img/delete-dark-blue.svg" alt=""><span>Delete</span></div>
                    <div style="height: 24px; width: 1px; background: #D1D1D1"></div>
                    <div onmouseover="changeColorOfEditButton()" onmouseout="changeColorOfEditButton2()" onclick="editTask(${task.id})" class="detailed-card-edit-container"><img id="edit-img" src="../assets/img/edit-dark-blue.svg" alt=""><span>Edit</span></div>
                </div>
            </div>
        </div>
    `;
}

function searchTask() {

}


async function deleteTask(taskId) {
    let selectedTask = tasks.findIndex(task => task.id === taskId);
    if (selectedTask !== -1) {
        tasks.splice(selectedTask, 1);
        await postData();
        renderColumns();
        closePopup();
    }
}

function changeColorOfDeleteButton() {
    let deleteButton = document.getElementById('delete-img');
    deleteButton.setAttribute('src', '../assets/img/delete-light-blue.svg')
}

function changeColorOfDeleteButton2() {
    let deleteButton = document.getElementById('delete-img');
    deleteButton.setAttribute('src', '../assets/img/delete-dark-blue.svg')
}

function changeColorOfEditButton() {
    let editButton = document.getElementById('edit-img');
    editButton.setAttribute('src', '../assets/img/edit-light-blue.svg')
}

function changeColorOfEditButton2() {
    let editButton = document.getElementById('edit-img');
    editButton.setAttribute('src', '../assets/img/edit-dark-blue.svg')
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
    renderColumns();
}

function getValuesFromInputFromTemplate() {
    let title = document.getElementById('title-template').value;
    let description = document.getElementById('description-template');
    let assigned = document.getElementById('assigned-template');
    let date = document.getElementById('date-template');
    let category = document.getElementById('category-template');
    let priority;
    if (lastClickedButton === 'urgent') {
        priority = 'urgent';
    } else if (lastClickedButton === 'medium') {
        priority = 'medium';
    } else if (lastClickedButton === 'low') {
        priority = 'low';
    } else {
        priority = 'notSet'; 
    }
    return { title, description, assigned, date, category, priority };
}

function pushValuesToTasksFromTemplate() {
    let boardCategory = "toDo";
    let { title, description, assigned, date, category, priority } = getValuesFromInputFromTemplate();
    tasks.push({
        id: taskIdCounter++,
        title: title,
        description: description.value,
        assigned: assigned.value,
        date: date.value,
        subtasks: subtaskArray,
        category: category.value,
        boardCategory: boardCategory,
        priority: priority,
    });
}

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

function getNewSubtaskInTemplate() {
    let newSubtask = document.getElementById('new-subtask-template');
    newSubtask.innerHTML = ``;
    for (i = 0; i < subtaskArray.length; i++) {
        newSubtask.innerHTML += `
        <div> 
             <b> •${subtaskArray[i].title} </b> 
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



