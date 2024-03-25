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
    let firstLetterName = getInitialsFromName(task.assigned);
    let firstLetterLastName = getInitialsFromLastName(task.assigned);
    let assignedContactsHTML = '';
    if (task.assigned && task.assigned.length > 0) {
        assignedContactsHTML = renderAssignedContactsHTML(firstLetterName, firstLetterLastName)
    } 
    return assignedContactsHTML;
}

function generateAssignedContactsInDetailedCard(task) {
    let firstLetterName = getInitialsFromName(task.assigned);
    let firstLetterLastName = getInitialsFromLastName(task.assigned);
    let assignedContactsHTML = '';
    if (task.assigned && task.assigned.length > 0) {
        assignedContactsHTML = renderAssignedContactsInDetailedCard(task, firstLetterName, firstLetterLastName)
    } else {
        assignedContactsHTML = /*html*/`<span>No contacts assigned</span>`
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
    postData("/tasks");
    renderColumns();
}


// **********************GET HTML-TEMPLATE FOR EDIT CARD**********************

function generateContactOptionsHTML() {
    let contactOptions = '';
    for (let index = 0; index < contacts.length; index++) {
        const contact = contacts[index];
        contactOptions += `<option value="${contact.name}">${contact.name}</option>`;
    }
    return contactOptions;
}

function generateSubtasksHTMLEditCard(task) {
    let subtasksHTMLEditCard = '';
    if (task.subtasks && task.subtasks.length > 0) {
        for (let index = 0; index < task.subtasks.length; index++) {
            const subtask = task.subtasks[index].title;
            subtasksHTMLEditCard += /*html*/`
                <div onmouseover="showEditImages(${index + subtaskArray.length})" onmouseout="removeEditImages(${index + subtaskArray.length})" class="subtask-container-edit-card">
                    <li class="subtask-list-edit-card" id="subtask${index + subtaskArray.length}">${subtask}</li>
                    <div class="edit-card-edit-container d-none" id="edit-container${index + subtaskArray.length}">
                        <img style="height: 18px" src="../assets/img/edit-dark-blue.svg" alt="">
                        <div style="height: 18px; width: 1px; background: lightgrey"></div>
                        <img onclick="deleteSubtask(${task.id}, ${index}, event)" style="height: 18px" src="../assets/img/delete-dark-blue.svg" alt="">
                    </div>
                </div>
            `;
        }
    } else {
        subtasksHTMLEditCard = /*html*/`
            <div class="no-subtasks-container">No subtasks</div>
        `
    }
    return subtasksHTMLEditCard;
}



async function deleteSubtask(taskId, index, event) {
    let task = tasks.find(task => task.id === taskId); 
    task.subtasks.splice(index, 1);
    subtaskArray.splice(index, 1);
    await postData();
    await loadTasks();
    openEditCard(taskId, event); 
}

function showEditImages(index) {
    let editContainer = document.getElementById(`edit-container${index}`)
    editContainer.classList.remove('d-none');
}

function removeEditImages(index) {
    let editContainer = document.getElementById(`edit-container${index}`)
    editContainer.classList.add('d-none');
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


// **********************ADD SUBTASKS IN ADD-TASK-FORM AND CLEAR FORM**********************

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
        priority = 'notSet'; 
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

async function addNewSubtaskInEditCard() {
    let addNewSubtask = document.getElementById('subtasks-edit-card').value;
    if (subtaskArray.length < 2) {
        subtaskArray.push({
            title: addNewSubtask,
            isChecked: false
        });
        getNewSubtaskInEditCard();
    } else {
        alert("You can only add a maximum of two subtasks.");
    }
}

function getNewSubtaskInEditCard() {
    let newSubtask = document.getElementById('new-subtask-edit-card');
    newSubtask.innerHTML = '';
    for (index = 0; index < subtaskArray.length; index++) {
        newSubtask.innerHTML += /*html*/`
        <div onmouseover="showEditImages(${index + subtaskArray.length})" onmouseout="removeEditImages(${index + subtaskArray.length})" class="subtask-container-edit-card">
            <li class="subtask-list-edit-card" id="subtask${index + subtaskArray.length}">${subtaskArray[index].title}</li>
            <div class="edit-card-edit-container d-none" id="edit-container${index + subtaskArray.length}">
                <img style="height: 18px" src="../assets/img/edit-dark-blue.svg" alt="">
                <div style="height: 18px; width: 1px; background: lightgrey"></div>
                <img style="height: 18px" src="../assets/img/delete-dark-blue.svg" alt="">
            </div>
        </div>
        `
    }
}

function handleKeyPressInTemplate(event) {
    if (event.keyCode === 13) { 
        event.preventDefault(); 
        addNewSubtaskInTemplate();
    }
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