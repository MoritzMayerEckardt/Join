/**
 * Renders HTML for subtasks list in edit card.
 * 
 * @param {object} task - The task object containing details like id, category, title, description, priority, etc.
 * @param {array} subtasks - Array of subtask objects.
 * @param {string} subtask - Subtask text.
 * @param {number} index - Index of the subtask.
 * @returns {string} - HTML string representing the subtasks list in edit card.
 */
function renderSubtasksListInEditCard(task, subtasks, subtask, index) {
    return /*html*/`
    <div>
        <div id="subtask${index}" onmouseover="showEditImages(${index})" onmouseout="removeEditImages(${index})" class="subtask-container-edit-card">
            <li class="subtask-list-edit-card">${subtask}</li>
            <div class="edit-card-edit-container d-none" id="edit-container${index}">
                <div class="subtasks-img"><img class="subtask-img" onclick="editSubtask(${index})" style="height: 20px" src="./assets/img/edit-dark-blue.svg" alt=""></div>
                <div style="height: 18px; width: 2px; background: lightgrey"></div>
                <div class="subtasks-img"><img class="subtask-img" onclick="deleteSubtask(${task.id}, ${index})" style="height: 20px" src="./assets/img/delete-dark-blue.svg" alt=""></div>
            </div>
        </div>
        <div id="edit-subtask-container${index}" class="edit-subtask-container d-none">
            <input id="subtask-input${index}" class="subtask-input" value="${subtasks[index].title}">
            <div class="edit-card-edit-container">
                <div class="subtasks-img"><img onclick="emptyInputSubtask(${index})" style="height: 14px" src="./assets/img/delete.svg" alt=""></div>
                <div style="width: 2px; height: 18px; background: lightgrey"></div>
                <div class="subtasks-img"><img onclick="saveSubtask(${task.id}, ${index})" style="height: 14px" src="./assets/img/check_blue.svg" alt=""></div>
            </div>
        </div>
    </div>
    `;
}


/**
 * Renders a progress bar for a task.
 * 
 * @param {string} progressBarClass - CSS class for the progress bar.
 * @param {string} subtasksText - Text indicating the number of subtasks.
 * @returns {string} - HTML string representing the progress bar.
 */
function renderProgressBar(progressBarWidth, subtasksText) {
    return /*html*/`
            <div class="task-subtasks-container">
                <div id="progress-bar" class="task-progress-bar">
                    <div class="task-progress-bar-progress" style="width: ${progressBarWidth}px"></div>
                </div>
                <span class="task-subtasks-text">${subtasksText}</span>
            </div>
        `;
}


/**
 * Renders HTML for a subtask.
 * 
 * @param {object} task - The task object containing details like id, category, title, description, priority, etc.
 * @param {string} subtask - Subtask text.
 * @param {string} checkBoxImage - Image source for the checkbox.
 * @param {number} index - Index of the subtask.
 * @returns {string} - HTML string representing the subtask.
 */
function renderSubtaskHTML(task, subtask, checkBoxImage, index) {
    return /*html*/`
        <div onclick="handleCheckBox(${task.id}, ${index})" class="flex check-box-container-subtasks">
            <img class="check-box-img" id="check-box${index}" style="width: 16px; height: 16px;" src="${checkBoxImage}" alt="">
            <span class="checkbox-text">${subtask}</span>
        </div>
    `;
}
