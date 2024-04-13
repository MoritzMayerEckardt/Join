// **********************BOARD INITIALIZATION AND RENDERING**********************

/**
 * Array containing column configurations for the board.
 * Each column configuration includes the category, container ID, and empty renderer function.
 * Category defines the type of tasks displayed in the column.
 * Container ID is the ID of the HTML element representing the column on the board.
 * Empty renderer function generates the HTML for displaying an empty column message.
 */
let columns = [
    { category: "toDo", containerId: "to-do-column", emptyRenderer: renderEmptyToDoColumn },
    { category: "inProgress", containerId: "in-progress-column", emptyRenderer: renderEmptyInProgressColumn },
    { category: "awaitFeedback", containerId: "await-feedback-column", emptyRenderer: renderEmptyAwaitFeedbackColumn },
    { category: "done", containerId: "done-column", emptyRenderer: renderEmptyDoneColumn }
];


/**
 * ID of the currently active column.
 * Used to determine the column in which a new task should be added.
 */
let currentColumnId;


/**
 * Initializes the board by loading necessary data and rendering columns.
 * 
 * @returns {Promise<void>} - A promise that resolves after the board is initialized.
 */
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
    showCurrentUserInButtonMobile();
}


// **********************TASK RENDERING AND MANAGEMENT**********************

/**
 * Renders the columns on the board.
 * If there are no tasks, it renders empty columns using the emptyRenderer functions.
 * 
 * @returns {void}
 */
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


/**
 * Renders empty columns using the emptyRenderer functions.
 * 
 * @returns {void}
 */
function renderEmptyColumns() {
    for (const column of columns) {
        let container = document.getElementById(column.containerId);
        container.innerHTML = column.emptyRenderer();
    }
}


/**
 * Renders tasks in the specified column container.
 * 
 * @param {Array} tasksInColumn - Array of tasks to render in the column.
 * @param {HTMLElement} container - Container element to render tasks into.
 * @returns {void}
 */
function renderTasksInColumn(tasksInColumn, container) {
    for (let index = 0; index < tasksInColumn.length; index++) {
        const task = tasksInColumn[index];
        let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
        let progressBarHTML = generateProgressBarHTML(task);
        let assignedContactsHTML = generateAssignedContactsHTML(task);
        container.innerHTML += renderCard(task, backgroundColor, progressBarHTML, assignedContactsHTML);
    }
}


/**
 * Filters tasks based on their category.
 * 
 * @param {Array} tasks - Array of tasks to filter.
 * @param {string} category - Category by which tasks are filtered.
 * @returns {Array} - Filtered array of tasks.
 */
function filterTasksByCategory(tasks, category) {
    return tasks.filter(task => task.boardCategory === category);
}


// **********************POPUP CARD MANAGEMENT**********************

/**
 * Opens the detailed card for a specific task.
 * 
 * @param {string} taskId - The ID of the task to open the detailed card for.
 * @returns {void}
 */
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
    avoidScolling();
}


/**
 * Opens the edit card for a specific task.
 * 
 * @param {string} taskId - The ID of the task to open the edit card for.
 * @returns {void}
 */
function openEditCard(taskId) {
    let task = tasks.find(task => task.id === taskId);
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    let subtasksHTMLEditCard = generateSubtasksHTMLEditCard(task);
    let assignedContactsHTML = generateAssignedContactsInDetailedCard(task);
    if (!task.assigned) {
        chosenContacts = [];
    } else {
        chosenContacts = task.assigned;
    }
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderEditCard(task, subtasksHTMLEditCard, assignedContactsHTML);
}


/**
 * Shows the add task form in the specified column.
 * 
 * @param {string} columnId - The ID of the column to show the add task form in.
 * @returns {void}
 */
function showAddTaskForm(columnId) {
    currentColumnId = columnId
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderAddTaskForm();
    lastClickedButton = 'medium';
    avoidScolling();
}


// **********************TASK MODIFICATION**********************

/**
 * Adds a new task from the task form template.
 * 
 * @returns {void}
 */
async function addTaskFromTemplate() {
    createTasksIfNotCreated();
    pushValuesToTasksFromTemplate();
    await postTasks(TASKS_PATH);
    await loadTasks();
    saveTaskIdCounter();
    showTaskAddedTemplate();
    closeCardAfterInfo('task-form');
    renderColumns();
    chosenContacts = [];
    subtaskArray = [];
    showChosenInitials();
}


/**
 * Deletes a task with the specified ID.
 * 
 * @param {string} taskId - The ID of the task to delete.
 * @returns {void}
 */
async function deleteTask(taskId) {
    let selectedTask = tasks.findIndex(task => task.id === taskId);
    if (selectedTask !== -1) {
        tasks.splice(selectedTask, 1);
        await postTasks(TASKS_PATH);
        renderColumns();
        showTaskDeleted();
        closeCardAfterInfo('card');
    }
}


/**
 * Pushes the values from the task form template to the tasks array.
 * 
 * @returns {void}
 */
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


/**
 * Edits a task with the specified ID.
 * 
 * @param {string} taskId - The ID of the task to edit.
 * @returns {void}
 */
async function editTask(taskId) {
    let { title, description, date, priority, assigned } = getValuesFromInputFromEditCard(taskId);
    updateTask(taskId, { title, description, date, priority, assigned });
    await postTasks(TASKS_PATH);
    await loadTasks();
    showTaskEdited();
    closeCardAfterInfo('card');
    renderColumns();
    chosenContacts = [];
}


/**
 * Updates a task with the provided taskId with the given properties in updatedTask.
 * 
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} updatedTask - An object containing the properties to update in the task.
 * @returns {void}
 */
function updateTask(taskId, updatedTask) {
    let index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updatedTask };
    }
}


/**
 * Closes the popup card with the given ID.
 * 
 * @param {string} cardId - The ID of the popup card to close.
 * @returns {void}
 */
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
    allowScrolling();
}


/**
 * Closes the specified card after providing information.
 * 
 * @param {string} id - The ID of the card to close.
 * @returns {void}
 */
function closeCardAfterInfo(id) {
    let popupContent = document.getElementById(id);
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
    allowScrolling();
}


/**
 * Closes the popup card when clicked outside the card or add-task-template.
 * 
 * @returns {void}
 */
function closeFromClickOutside() {
    let popupOverlay = document.getElementById('popup-board-overlay');
    popupOverlay.classList.add('d-none');
    allowScrolling();
}


// **********************SEARCH FUNCTIONALITY**********************

/**
 * Searches tasks based on the input value from the search bar.
 * If the search value is empty, renders tasks for each column using the emptyRenderer function.
 * If the search value is not empty, filters tasks containing the search value in their title
 * and renders them for each column.
 */
function searchTasks() {
    let search = document.getElementById('search').value.trim().toLowerCase();
    for (const column of columns) {
        const container = document.getElementById(column.containerId);
        container.innerHTML = '';
        const tasksInColumn = filterTasksByCategory(tasks, column.category);
        if (search === '') {
            renderTasksForColumn(tasksInColumn, '', container, column.emptyRenderer);
        } else {
            const foundTasksInColumn = renderTasksForColumn(tasksInColumn, search, container);
            if (!foundTasksInColumn) {
                container.innerHTML = column.emptyRenderer();
            }
        }
    }
}


/**
 * Renders a task card in the specified container.
 * Generates the necessary HTML elements for the task card, including background color, progress bar,
 * and assigned contacts, and appends them to the container.
 * @param {object} task - The task object containing information to be rendered.
 * @param {HTMLElement} container - The container element where the task card will be rendered.
 */
function renderTaskCard(task, container) {
    let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
    let progressBarHTML = generateProgressBarHTML(task);
    let assignedContactsHTML = generateAssignedContactsHTML(task);
    container.innerHTML += renderCard(task, backgroundColor, progressBarHTML, assignedContactsHTML);
}


/**
 * Renders tasks in a column based on a search query.
 * Filters tasks containing the search query in their title and renders them in the specified container.
 * If no tasks are found and an emptyRenderer function is provided, renders the empty state for the column.
 * @param {array} tasksInColumn - The array of tasks to be rendered in the column.
 * @param {string} search - The search query to filter tasks.
 * @param {HTMLElement} container - The container element where tasks will be rendered.
 * @param {function} emptyRenderer - The function to render the empty state for the column.
 * @returns {boolean} - True if tasks are found and rendered, false otherwise.
 */
function renderTasksForColumn(tasksInColumn, search, container, emptyRenderer) {
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
    if (!foundTasks && typeof emptyRenderer === 'function') {
        container.innerHTML = emptyRenderer();
    }
    return foundTasks;
}





