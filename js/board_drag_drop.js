/**
 * Global variable to store the currently dragged task element.
 * @type {HTMLElement}
 */
let currentDraggedElement;


/**
 * Sets the currentDraggedElement to the task being dragged.
 * @param {HTMLElement} task - The task element being dragged.
 */
function startDragging(task) {
    currentDraggedElement = task;
}


/**
 * Prevents default behavior to allow dropping elements.
 * @param {Event} ev - The event object.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Moves the currentDraggedElement to the specified category and updates the UI.
 * @param {string} category - The category to move the task to.
 * @returns {Promise<void>} - A promise that resolves once the task is moved.
 */
async function moveTo(category) {
    let task = tasks.find(task => task.id === currentDraggedElement);
    task.boardCategory = category;
    await postTasks(TASKS_PATH); 
    renderColumns();
}


/**
 * Adds a highlight effect to the specified element.
 * @param {string} id - The ID of the element to highlight.
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}


/**
 * Removes the highlight effect from the specified element.
 * @param {string} id - The ID of the element to remove highlight from.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}
