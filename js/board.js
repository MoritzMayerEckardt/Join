let columns = [
    { category: "toDo", containerId: "to-do-column", emptyRenderer: renderEmptyToDoColumn },
    { category: "inProgress", containerId: "in-progress-column", emptyRenderer: renderEmptyInProgressColumn },
    { category: "awaitFeedback", containerId: "await-feedback-column", emptyRenderer: renderEmptyAwaitFeedbackColumn },
    { category: "done", containerId: "done-column", emptyRenderer: renderEmptyDoneColumn }
];

async function initBoard() {
    await includeHTML();
    await loadTasks();
    await loadContacts();
    addBackgroundColor(2);
    renderColumns(); 
}


// **********************SHOW TASKS IN ASSOCIATED COLUMN**********************

function renderColumns() {
    if (!tasks || tasks.length === 0) {
        renderEmptyColumns();
    } else {
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
}

function renderEmptyColumns() {
    for (const column of columns) {
        let container = document.getElementById(column.containerId);
        container.innerHTML = column.emptyRenderer();
    }
}

function renderTasksInColumn(tasksInColumn, container) {
    for (let index = 0; index < tasksInColumn.length; index++) {
        const task = tasksInColumn[index];
        let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
        let progressBarHTML = generateProgressBarHTML(task);
        let assignedContactsHTML = generateAssignedContactsHTML(task);
        container.innerHTML += renderCard(task, backgroundColor, progressBarHTML, assignedContactsHTML);
    }
}

function filterTasksByCategory(tasks, category) {
    return tasks.filter(task => task.boardCategory === category);
}


// **********************SHOW DETAILED-CARD, EDIT-CARD AND ADD-TASK-FORM**********************

function openDetailedCard(taskId, event) {
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    let task = tasks.find(task => task.id === taskId);
    let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
    let subtasksHTML = generateSubtasksHTML(task); 
    let assignedContactsHTML = generateAssignedContactsInDetailedCard(task)  
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderDetailedCard(task, backgroundColor, assignedContactsHTML, subtasksHTML);
    event.stopPropagation();
}

function openEditCard(taskId, event) {
    let task = tasks.find(task => task.id === taskId);
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    let contactOptions = generateContactOptionsHTML();
    let subtasksHTMLEditCard = generateSubtasksHTMLEditCard(task);
    let assignedContactsHTML = generateAssignedContactsInDetailedCard(task)
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderEditCard(task, contactOptions, subtasksHTMLEditCard, assignedContactsHTML);
    event.stopPropagation();
}

function showAddTaskForm(event) {
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    let contactOptions = generateContactOptionsHTML();
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderAddTaskForm(contactOptions);
    event.stopPropagation();
}


// **********************ADD-TASK, DELETE TASK, EDIT TASK AND CLOSE CARDS**********************

async function addTaskFromTemplate() {
    createTasksIfNotCreated();
    pushValuesToTasksFromTemplate();
    await postData();
    saveTaskIdCounter();
    closeAddTaskForm();
    renderColumns();
    subtaskArray = [];
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

function pushValuesToTasksFromTemplate() {
    let boardCategory = 'toDo'
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

async function editTask(taskId) {
    let { title, description, date, priority, subtasks, assigned } = getValuesFromInputFromEditCard();
    updateTask(taskId, { title, description, date, priority, subtasks, assigned });
    await postData();
    await loadTasks();
    closePopup();
    renderColumns();
}

function updateTask(taskId, updatedTask) {
    let index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updatedTask };
    }
}

function getValuesFromInputFromEditCard() {
    let title = document.getElementById('title-edit-card').value;
    let description = document.getElementById('description-edit-card').value;
    let date = document.getElementById('date-edit-card').value;
    let priority = getVAlueOfPriority();
    let assigned = document.getElementById('assigned-edit-card').value;
    let subtasks = subtaskArray;
    return { title, description, date, priority, subtasks, assigned};
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

function closePopup() {
    let popupOverlay = document.getElementById('popup-board-overlay');
    popupOverlay.classList.add('d-none');
    renderColumns();
}


// **********************SEARCH-TASK-FUNCTION**********************

function searchTasks() {
    let search = document.getElementById('search').value.toLowerCase();
    for (const column of columns) {
        const container = document.getElementById(column.containerId);
        container.innerHTML = '';
        const tasksInColumn = filterTasksByCategory(tasks, column.category);
        const foundTasksInColumn = renderTasksForColumn(tasksInColumn, search, container);
        if (!foundTasksInColumn) {
            container.innerHTML = column.emptyRenderer();
        }
    }
}

function renderTaskCard(task, container) {
    let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
    let progressBarHTML = generateProgressBarHTML(task);
    let assignedContactsHTML = generateAssignedContactsHTML(task);
    container.innerHTML += renderCard(task, backgroundColor, progressBarHTML, assignedContactsHTML);
}

function renderTasksForColumn(tasksInColumn, search, container) {
    let foundTasks = false;
    if (tasksInColumn && tasksInColumn.length >= 1) {
        tasksInColumn.forEach(task => {
            const title = task.title.toLowerCase();
            if (title.includes(search)) {
                renderTaskCard(task, container);
                foundTasks = true;
            }
        });
    }
    return foundTasks;
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



