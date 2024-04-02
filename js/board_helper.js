// **********************GET VARIABLES FOR CARD**********************

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

function getSubtasksText(task) {
    let allsubtasks = task.subtasks ? task.subtasks.length : 0;
    let subtasksCompleted = task.subtasks ? task.subtasks.filter(subtask => subtask.isChecked).length : 0;
    return allsubtasks > 0 ? `${subtasksCompleted}/${allsubtasks} Subtasks` : '';
}

function getProgressBarClass(task) {
    let allsubtasks = task.subtasks ? task.subtasks.length : 0;
    let subtasksCompleted = task.subtasks ? task.subtasks.filter(subtask => subtask.isChecked).length : 0;
    if (allsubtasks === 0) {
        return "d-none";
    } else {
        return subtasksCompleted === 0 ? "empty" : subtasksCompleted === allsubtasks ? "full" : "half-filled";
    }
}

function generateProgressBarHTML(task) {
    let subtasksText = getSubtasksText(task);
    let progressBarClass = getProgressBarClass(task);
    let progressBarHTML = '';
    if (task.subtasks && task.subtasks.length > 0) {
        progressBarHTML = renderProgressBar(progressBarClass, subtasksText)
    }
    return progressBarHTML;
}

function generateAssignedContactsHTML(task) {
    let assignedContactsHTML = '';
    if (task.assigned && task.assigned.length > 0) {
        for (let i = 0; i < task.assigned.length; i++) {
            let assignedContact = task.assigned[i].name;
            let contactColor = task.assigned[i].color;
            let firstLetterName = getInitialsFromName(assignedContact);
            let firstLetterLastName = getInitialsFromLastName(assignedContact);
            let marginClass = i === 0 ? 'margin-0' : 'margin-8';
            assignedContactsHTML += renderAssignedContactsHTML(firstLetterName, firstLetterLastName, contactColor, marginClass);
        }
    }
    return assignedContactsHTML;
}

function generateAssignedContactsInDetailedCard(task) {
    let assignedContactsHTML = '';
    if (task.assigned && task.assigned.length > 0) {
        for (let i = 0; i < task.assigned.length; i++) {
            let assignedContact = task.assigned[i].name;
            let contactColor = task.assigned[i].color;
            let firstLetterName = getInitialsFromName(assignedContact);
            let firstLetterLastName = getInitialsFromLastName(assignedContact);
            assignedContactsHTML += renderAssignedContactsInDetailedCard(firstLetterName, firstLetterLastName, assignedContact, contactColor);
        }
    } else {
        assignedContactsHTML = /*html*/`<span>No contacts assigned</span>`;
    }
    return assignedContactsHTML;
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


// **********************GET HTML-TEMPLATE FOR SUBTASKS IN DETAILED CARD**********************

function generateSubtasksHTML(task) {
    let subtasks = task.subtasks;
    let subtasksHTML = "";
    if (subtasks && subtasks.length > 0) {
        for (let index = 0; index < subtasks.length; index++) {
            const subtask = subtasks[index].title;
            const isChecked = subtasks[index].isChecked; 
            const checkBoxImage = isChecked ? '../assets/img/check_button_check.svg' : '../assets/img/check_button_empty.svg';
            subtasksHTML += renderSubtaskHTML(task, subtask, checkBoxImage, index);
        }
    } else {
        subtasksHTML = /*html*/` <div class="no-subtasks-container" style="font-size: 16px">No subtasks</div>`;
    }
    return subtasksHTML;
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
    postData(TASKS_PATH);
    renderColumns();
}


// **********************GET HTML-TEMPLATE FOR EDIT CARD**********************

function generateSubtasksHTMLEditCard(task) {
    let subtasksHTMLEditCard = '';
    let subtasks = task.subtasks;
    if (subtasks && subtasks.length > 0) {
        for (let index = 0; index < subtasks.length; index++) {
            const subtask = subtasks[index].title;
            subtasksHTMLEditCard += renderSubtasksHTMLInEditCard(task, index, subtasks, subtask);
        }
    } else {
        subtasksHTMLEditCard = /*html*/`
            <div class="no-subtasks-container">No subtasks</div>
        `
    }
    return subtasksHTMLEditCard;
}

// **********************CHANGE COLOR OF BUTTONS**********************

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

function changeColorOfAddTaskImg(id) {
    let addTaskImg = document.getElementById(`add-task-img${id}`);
    addTaskImg.setAttribute('src', '../assets/img/add_task_button_blue.svg')
}

function changeColorOfAddTaskImg2(id) {
    let addTaskImg = document.getElementById(`add-task-img${id}`);
    addTaskImg.setAttribute('src', '../assets/img/add_task_button.svg')
}


// **********************DELETE SUBTASK**********************

async function deleteSubtask(taskId, index) {
    let task = tasks.find(task => task.id === taskId); 
    task.subtasks.splice(index, 1);
    await postData(TASKS_PATH);
    await loadTasks();
    openEditCard(taskId);
    document.getElementById('new-subtask-edit-card').scrollIntoView({ behavior: 'instant' });
    renderColumns(); 
}

// **********************ADD SUBTASKS IN ADD-TASK-FORM**********************

function getValuesFromInputFromTemplate() {
    let title = document.getElementById('title-template').value;
    let description = document.getElementById('description-template');
    let assigned = document.getElementById('assigned-template');
    let date = document.getElementById('date-template');
    let category = document.getElementById('category-template');
    let priority = getVAlueOfPriority();
    return { title, description, assigned, date, category, priority };
}

function getVAlueOfPriority() {
    if (lastClickedButton === 'urgent') {
        priority = 'urgent';
    } else if (lastClickedButton === 'medium') {
        priority = 'medium';
    } else if (lastClickedButton === 'low') {
        priority = 'low';
    } else {
        priority = 'medium'; 
    }
    return priority;
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
        newSubtask.innerHTML += /*html*/`
             <li><b>${subtaskArray[i].title}</b></li> 
         `
    }
    document.getElementById('subtasks-template').value = ``;
}


// **********************ADD AND EDIT SUBTASKS IN ADD-TASK-FORM**********************

async function addNewSubtaskInEditCard(taskId) {
    let task = tasks.find(task => task.id === taskId);
    if (!task.subtasks) {
        task.subtasks = [];
    }
    let subtasks = task.subtasks;
    let addNewSubtask = document.getElementById('subtasks-edit-card').value;
    if (subtasks.length < 2) {
        subtasks.push({
            title: addNewSubtask,
            isChecked: false
        });
        getNewSubtaskInEditCard(task);
    } else {
        alert("You can only add a maximum of two subtasks.");
    }
    await postData(TASKS_PATH);
    renderColumns();
}

function getNewSubtaskInEditCard(task) {
    let newSubtask = document.getElementById('new-subtask-edit-card');
    newSubtask.innerHTML = '';
        newSubtask.innerHTML += generateSubtasksHTMLEditCard(task);
}

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

function emptyInputSubtask(index) {
    inputSubtask = document.getElementById(`subtask-input${index}`).value = '';
}

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
    await postData(TASKS_PATH);
    await loadTasks();
    showSubtasksInList(task.id, index);
}

function showSubtasksInList(taskId, index) {
    openEditCard(taskId)
    document.getElementById('new-subtask-edit-card').scrollIntoView({ behavior: 'instant' });
    document.getElementById(`subtask${index}`).classList.remove('d-none');
    document.getElementById(`edit-subtask-container${index}`).classList.add('d-none');
    document.getElementById(`edit-container${index}`).classList.remove('d-none');
}

function editSubtask(index) {
    document.getElementById(`subtask${index}`).classList.add('d-none');
    document.getElementById(`edit-subtask-container${index}`).classList.remove('d-none');
    document.getElementById(`edit-container${index}`).classList.add('d-none'); 
}

function showEditImages(index) {
    let editContainer = document.getElementById(`edit-container${index}`)
    editContainer.classList.remove('d-none');
}

function removeEditImages(index) {
    let editContainer = document.getElementById(`edit-container${index}`)
    editContainer.classList.add('d-none');
}

function handleKeyPressInTemplate(event) {
    if (event.keyCode === 13) { 
        event.preventDefault(); 
        addNewSubtaskInTemplate();
    }
}




