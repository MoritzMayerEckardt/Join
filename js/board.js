let columns = [
    { category: "toDo", containerId: "to-do-column", emptyRenderer: renderEmptyToDoColumn },
    { category: "inProgress", containerId: "in-progress-column", emptyRenderer: renderEmptyInProgressColumn },
    { category: "awaitFeedback", containerId: "await-feedback-column", emptyRenderer: renderEmptyAwaitFeedbackColumn },
    { category: "done", containerId: "done-column", emptyRenderer: renderEmptyDoneColumn }
];
let currentColumnId;

async function initBoard() {
    await includeHTML();
    await loadCurrentUserIndex();
    await loadTasks();
    await loadContacts();
    await loadUsers();
    await loadGuestLogin();
    addBackgroundColor(2);
    renderColumns(); 
    showCurrentUserInButton();
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

function openDetailedCard(taskId) {
    let task = tasks.find(task => task.id === taskId);
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
    let subtasksHTML = generateSubtasksHTML(task); 
    let assignedContactsHTML = generateAssignedContactsInDetailedCard(task)  
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderDetailedCard(task, backgroundColor, assignedContactsHTML, subtasksHTML);
}

function openEditCard(taskId) {
    let task = tasks.find(task => task.id === taskId);
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    let subtasksHTMLEditCard = generateSubtasksHTMLEditCard(task);
    let assignedContactsHTML = generateAssignedContactsInDetailedCard(task)
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderEditCard(task, subtasksHTMLEditCard, assignedContactsHTML);
}

function showAddTaskForm(columnId) {
    currentColumnId = columnId
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderAddTaskForm();
}


// **********************ADD-TASK, DELETE TASK, EDIT TASK AND CLOSE CARDS**********************

async function addTaskFromTemplate() {
    createTasksIfNotCreated();
    pushValuesToTasksFromTemplate();
    await postData(TASKS_PATH);
    await loadTasks();
    saveTaskIdCounter();
    showTaskAddedTemplate();
    closeTaskFormAfterInfo();
    renderColumns();
    chosenContacts = [];
    subtaskArray = [];
    showChosenInitials();
}

async function deleteTask(taskId) {
    let selectedTask = tasks.findIndex(task => task.id === taskId);
    if (selectedTask !== -1) {
        tasks.splice(selectedTask, 1);
        await postData(TASKS_PATH);
        renderColumns();
        showTaskDeleted();
        closeCardAfterInfo();
    }
}

function pushValuesToTasksFromTemplate() {
    let boardCategory = currentColumnId;
    let { title, description, date, category, priority } = getValuesFromInputFromTemplate();
    tasks.push({
        id: taskIdCounter++,
        title: title,
        description: description.value,
        assigned: chosenContacts,
        date: date.value,
        subtasks: subtaskArray,
        category: category.value,
        boardCategory: boardCategory,
        priority: priority,
    });
}

function createTasksIfNotCreated() {
    if (!tasks) {
        tasks = [];
    }
}

async function editTask(taskId) {
    let { title, description, date, priority, assigned } = getValuesFromInputFromEditCard(taskId);
    updateTask(taskId, { title, description, date, priority, assigned });
    await postData(TASKS_PATH);
    await loadTasks();
    showTaskEdited();
    closeCardAfterInfo();
    renderColumns();
    chosenContacts = [];
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
    let assigned = chosenContacts;
    return { title, description, date, priority, assigned};
}

function closeTaskFormAfterInfo() {
    let popupOverlay = document.getElementById('popup-board-overlay');
    let taskForm = document.getElementById('task-form');
    setTimeout(() => {
        taskForm.style.animation = 'slideOutToRight 0.3s ease-in-out'; 
        taskForm.style.right = '-200%';
        setTimeout(() => {
            popupOverlay.classList.add('d-none');
        }, 200);
    }, 1200);
}

function closePopup(cardId) {
    let popupContent = document.getElementById(cardId);
    let popupOverlay = document.getElementById('popup-board-overlay');
    popupContent.style.animation = 'slideOut 0.5s forwards';
    popupOverlay.style.animation = 'fadeOutOverlay 0.5s forwards';
    setTimeout(() => {
        popupContent.style.display = 'none';
        popupContent.style.removeProperty('animation');
        popupOverlay.classList.add('d-none');
        popupOverlay.style.removeProperty('animation');
    }, 500); 
    renderColumns();
}

function closeCardAfterInfo() {
    let popupContent = document.getElementById('card');
    let popupOverlay = document.getElementById('popup-board-overlay');
    setTimeout(() => {
        popupContent.style.animation = 'slideOut 0.5s forwards';
        popupOverlay.style.animation = 'fadeOutOverlay 0.5s forwards';
    }, 1000);
    setTimeout(() => {
        popupContent.style.display = 'none';
        popupContent.style.removeProperty('animation');
        popupOverlay.classList.add('d-none');
        popupOverlay.style.removeProperty('animation');
    }, 1500); 
    renderColumns();
}


function closeFromClickOutside() {
    let popupOverlay = document.getElementById('popup-board-overlay');
    popupOverlay.classList.add('d-none');
}

function showTaskAddedTemplate() {
    document.getElementById('task-added-container').classList.remove('d-none');
}

function showTaskEdited() {
    document.getElementById('task-edited-container').classList.remove('d-none');
}

function showTaskDeleted() {
    document.getElementById('task-deleted-container').classList.remove('d-none');
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


// **********************STOP-PROPAGATION**********************

function doNotClose(event) {
    event.stopPropagation();
}



