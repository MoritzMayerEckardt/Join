/**
 * Retrieves the text displaying subtask completion status.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The text indicating subtask completion status.
 */
function getSubtasksText(task) {
    let allsubtasks = task.subtasks ? task.subtasks.length : 0;
    let subtasksCompleted = task.subtasks ? task.subtasks.filter(subtask => subtask.isChecked).length : 0;
    return allsubtasks > 0 ? `${subtasksCompleted}/${allsubtasks} Subtasks` : '';
}


/**
 * Determines the CSS class for the progress bar based on subtask completion.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The CSS class for the progress bar.
 */
function getProgressBarWidth(task) {
    let allSubtasks = task.subtasks ? task.subtasks.length : 0;
    let subtasksCompleted = task.subtasks ? task.subtasks.filter(subtask => subtask.isChecked).length : 0;
    if (allSubtasks === 0) {
        return "d-none";
    } else {
        let progressPercentage = (subtasksCompleted / allSubtasks) * 100;
        let progressBarWidth = Math.min(progressPercentage, 100);
        let progressBarWidthPx = (progressBarWidth / 100) * 128;
        return progressBarWidthPx;
    }
}



/**
 * Generates HTML for the progress bar based on task's subtask completion.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML code for the progress bar.
 */
function generateProgressBarHTML(task) {
    let subtasksText = getSubtasksText(task);
    let progressBarWidthPx = getProgressBarWidth(task);
    let progressBarHTML = '';
    if (task.subtasks && task.subtasks.length > 0) {
        progressBarHTML = renderProgressBar(progressBarWidthPx, subtasksText)
    }
    return progressBarHTML;
}


/**
 * Generates HTML for subtasks in a detailed card view.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML code for subtasks.
 */
function generateSubtasksHTML(task) {
    let subtasks = task.subtasks;
    let subtasksHTML = "";
    if (subtasks && subtasks.length > 0) {
        for (let index = 0; index < subtasks.length; index++) {
            const subtask = subtasks[index].title;
            const isChecked = subtasks[index].isChecked; 
            const checkBoxImage = isChecked ? './assets/img/check_button_check.svg' : './assets/img/check_button_empty.svg';
            subtasksHTML += renderSubtaskHTML(task, subtask, checkBoxImage, index);
        }
    } else {
        subtasksHTML = /*html*/` <div class="no-subtasks-container">No subtasks</div>`;
    }
    return subtasksHTML;
}


/**
 * Handles checkbox functionality for subtasks.
 * @param {string} taskId - The ID of the task.
 * @param {number} index - The index of the subtask.
 */
function handleCheckBox(taskId, index) {
    let task = tasks.find(task => task.id === taskId);
    let subtask = task.subtasks[index];
    let checkBox = document.getElementById(`check-box${index}`);
    if (subtask.isChecked) {
        checkBox.setAttribute('src', './assets/img/check_button_empty.svg');
    } else {
        checkBox.setAttribute('src', './assets/img/check_button_check.svg');
    }
    subtask.isChecked = !subtask.isChecked;
    postTasks(TASKS_PATH);
    renderColumns();
}


/**
 * Deletes a subtask.
 * @param {string} taskId - The ID of the task.
 * @param {number} index - The index of the subtask to be deleted.
 */
async function deleteSubtask(taskId, index) {
    let task = tasks.find(task => task.id === taskId); 
    task.subtasks.splice(index, 1);
    await postTasks(TASKS_PATH);
    await loadTasks();
    openEditCard(taskId);
    document.getElementById('new-subtask-edit-card').scrollIntoView({ behavior: 'instant' });
    renderColumns(); 
}

function deleteSubtaskTemplate(index) {
    subtaskArray.splice(index, 1)
    getNewSubtaskInTemplate();
}


/**
 * Adds a new subtask in a task template.
 */
function addNewSubtaskInTemplate() {
    let addNewSubtask = document.getElementById('subtasks-template').value;
    if (subtaskArray.length < 10) {
        subtaskArray.push({
            title: addNewSubtask,
            isChecked: false
        });
        getNewSubtaskInTemplate();
    } else {
        alert("You can only add a maximum of ten subtasks.");
    }
}


/**
 * Displays newly added subtasks in the task template.
 */
function getNewSubtaskInTemplate() {
    let newSubtask = document.getElementById('new-subtask-template');
    newSubtask.innerHTML = ``;
    for (index = 0; index < subtaskArray.length; index++) {
        let subtask = subtaskArray[index].title;
        newSubtask.innerHTML += /*html*/`
             <div>
        <div id="subtask${index}" onmouseover="showEditImages(${index})" onmouseout="removeEditImages(${index})" class="subtask-container-edit-card">
            <li class="subtask-list-edit-card">${subtask}</li>
            <div class="edit-card-edit-container d-none" id="edit-container${index}">
                <div class="subtasks-img"><img class="subtask-img" onclick="editSubtask(${index})" style="height: 20px" src="./assets/img/edit-dark-blue.svg" alt=""></div>
                <div style="height: 18px; width: 2px; background: lightgrey"></div>
                <div class="subtasks-img"><img class="subtask-img" onclick="deleteSubtaskTemplate(${index})" style="height: 20px" src="./assets/img/delete-dark-blue.svg" alt=""></div>
            </div>
        </div>
        <div id="edit-subtask-container${index}" class="edit-subtask-container d-none">
            <input id="subtask-input${index}" class="subtask-input" value="${subtask}">
            <div class="edit-card-edit-container">
                <div class="subtasks-img"><img onclick="emptyInputSubtask(${index})" style="height: 14px" src="./assets/img/delete.svg" alt=""></div>
                <div style="width: 2px; height: 18px; background: lightgrey"></div>
                <div class="subtasks-img"><img onclick="saveSubtaskTemplate(${index})" style="height: 14px" src="./assets/img/check_blue.svg" alt=""></div>
            </div>
        </div>
    </div>
         `
    }
    document.getElementById('subtasks-template').value = ``;
}


function saveSubtaskTemplate(index) {
    let inputSubtask = document.getElementById(`subtask-input${index}`).value;
    if (index >= 0 && index < subtaskArray.length) {
        subtaskArray[index] = {
            title: inputSubtask,
            isChecked: subtaskArray[index].isChecked
        };   
    } 
    getNewSubtaskInTemplate();
}


/**
 * Displays edit images for a subtask.
 * @param {number} index - The index of the subtask.
 */
function showEditImagesTemlate(index) {
    let editContainer = document.getElementById(`edit-container${index}`)
    editContainer.classList.remove('d-none');
}


/**
 * Hides edit images for a subtask.
 * @param {number} index - The index of the subtask.
 */
function removeEditImagesTemplate(index) {
    let editContainer = document.getElementById(`edit-container${index}`)
    editContainer.classList.add('d-none');
}


/**
 * Handles the addition of a new subtask in an edit card.
 * 
 * @param {string} taskId - The ID of the task.
 */
async function addNewSubtaskInEditCard(taskId) {
    let task = tasks.find(task => task.id === taskId);
    let subtasks = task.subtasks || [];
    let addNewSubtask = document.getElementById('subtasks-edit-card').value;
    if (subtasks.length < 10) {
        addSubtaskToTask(task, addNewSubtask);
        getNewSubtaskInEditCard(task);
    } else {
        alert("You can only add a maximum of ten subtasks.");
    }
    await postTasks(TASKS_PATH);
    renderColumns();
}


/**
 * Adds a new subtask to the task object.
 * 
 * @param {object} task - The task object to which the subtask will be added.
 * @param {string} subtaskTitle - The title of the new subtask.
 */
function addSubtaskToTask(task, subtaskTitle) {
    if (!task.subtasks) {
        task.subtasks = [];
    }
    task.subtasks.push({
        title: subtaskTitle,
        isChecked: false
    });
}


/**
 * Displays newly added subtasks in an edit card.
 * @param {Object} task - The task object containing subtasks.
 */
function getNewSubtaskInEditCard(task) {
    let newSubtask = document.getElementById('new-subtask-edit-card');
    newSubtask.innerHTML = '';
    newSubtask.innerHTML += generateSubtasksHTMLEditCard(task);
    document.getElementById('subtasks-edit-card').value = '';
}


/**
 * Generates HTML for subtasks in an edit card.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML code for subtasks in an edit card.
 */
function generateSubtasksHTMLEditCard(task) {
    let subtasksHTMLEditCard = '';
    let subtasks = task.subtasks;
    if (subtasks && subtasks.length > 0) {
        for (let index = 0; index < subtasks.length; index++) {
            const subtask = subtasks[index].title;
            subtasksHTMLEditCard += renderSubtasksListInEditCard(task, subtasks, subtask, index);
        }
    } else {
        subtasksHTMLEditCard = /*html*/`
            <div class="no-subtasks-container">No subtasks</div>
        `;
    }
    return subtasksHTMLEditCard;
}


/**
 * Clears input field for a subtask.
 * @param {number} index - The index of the subtask input field.
 */
function emptyInputSubtask(index) {
    inputSubtask = document.getElementById(`subtask-input${index}`).value = '';
}


/**
 * Saves edited subtask in an edit card.
 * @param {string} taskId - The ID of the task.
 * @param {number} index - The index of the subtask.
 */
async function saveSubtask(taskId, index) {
    let task = tasks.find(task => task.id === taskId);
    let subtasks = task.subtasks;
    let inputSubtask = document.getElementById(`subtask-input${index}`).value;
    if (index >= 0 && index < subtasks.length) {
        subtasks[index] = {
            title: inputSubtask,
            isChecked: subtasks[index].isChecked
        };   
    } 
    await postTasks(TASKS_PATH);
    await loadTasks();
    showSubtasksInList(task.id, index);
}


/**
 * Displays subtasks in a list after saving edits.
 * @param {string} taskId - The ID of the task.
 * @param {number} index - The index of the subtask.
 */
function showSubtasksInList(taskId, index) {
    openEditCard(taskId)
    document.getElementById('new-subtask-edit-card').scrollIntoView({ behavior: 'instant' });
    document.getElementById(`subtask${index}`).classList.remove('d-none');
    document.getElementById(`edit-subtask-container${index}`).classList.add('d-none');
    document.getElementById(`edit-container${index}`).classList.remove('d-none');
}


/**
 * Initiates editing of a subtask.
 * @param {number} index - The index of the subtask.
 */
function editSubtask(index) {
    document.getElementById(`subtask${index}`).classList.add('d-none');
    document.getElementById(`edit-subtask-container${index}`).classList.remove('d-none');
    document.getElementById(`edit-container${index}`).classList.add('d-none'); 
}


/**
 * Displays edit images for a subtask.
 * @param {number} index - The index of the subtask.
 */
function showEditImages(index) {
    let editContainer = document.getElementById(`edit-container${index}`)
    editContainer.classList.remove('d-none');
}


/**
 * Hides edit images for a subtask.
 * @param {number} index - The index of the subtask.
 */
function removeEditImages(index) {
    let editContainer = document.getElementById(`edit-container${index}`)
    editContainer.classList.add('d-none');
}


/**
 * Handles key press event in the task template.
 * @param {Event} event - The key press event.
 */
function handleKeyPressInTemplate(event) {
    if (event.keyCode === 13) { 
        event.preventDefault(); 
        addNewSubtaskInTemplate();
    }
}