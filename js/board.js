async function initBoard() {
    await includeHTML();
    await loadTasks();
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
                toDoContainer.innerHTML += renderCard(task);
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
                inProgressContainer.innerHTML += renderCard(task);
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
                awaitFeedbackContainer.innerHTML += renderCard(task);
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
                doneContainer.innerHTML += renderCard(task);
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
function renderCard(task) {
    let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
    let taskJson = JSON.stringify(task);
    taskJson = taskJson.replace(/"/g, '&quot;');
    return /*html*/`
            <div onclick="openDetailedCard('${taskJson}')" draggable="true" onclick="startDragging('${task.id}')" class="task-card">
                <div style="background-color: ${backgroundColor}" class="task-category">${task.category}</div>
                <span class="task-title">${task.title}</span>
                <div class="task-description">${task.description}</div>  
                <div class="task-subtasks-container">
                    <div class="task-progress-bar">
                        <div class="task-progress-bar-progress"></div>
                    </div>
                    <span class="task-subtasks-text">1/2 Subtasks</span>
                </div>
                <div class="task-card-bottom">
                    <div class="task-assigned-container">
                        <div class="task-contacts-ellipse flex-center" style="background-color: #FF7A00">
                            <span class="task-contacts-letters">M</span><span class="task-contacts-letters">M</span>
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

function getNameFromContacts() {
    let name = contacts[0].name;
    let firstLetter = name.charAt(0);
    return firstLetter;
}

function openDetailedCard(task) {
    let popupOverlay = document.getElementById('popup-board-overlay');
    let popupContent = document.getElementById('popup-board-content');
    popupOverlay.classList.remove('d-none');
    popupContent.innerHTML = '';
    popupContent.innerHTML = renderDetailedCard(task);
}

function renderDetailedCard(taskJson) {
    let task = JSON.parse(taskJson);
    let backgroundColor = prepareBackgroundColorTaskCategory(task.category);
    return /*html*/`
        <div class="detailed-card-container">
            <div class="detailed-card-top-container">
                <div style="background-color: ${backgroundColor}" class="detailed-card-category">${task.category}</div>
                <a onclick="closePopup()" class="detailed-card-close-button"><img src="../assets/img/close.svg" alt=""></a>
            </div>
            <span class="detailed-card-title">${task.title}</span>
            <span class="detailed-card-description">${task.description}</span>
            <div class="detailed-card-date">
                <span style="font-size: 20px">Due date:</span>
                <span style="font-size: 19px">${task.date}</span>
            </div>
            <div class="detailed-card-priority">
                <span style="font-size: 20px">Priority:</span>
                <span style="font-size: 19px">${task.priority}</span>
            </div>
            <div class="detailed-card-assigned">
                <span style="font-size: 20px">Assigned To:</span>
                <div class="detailed-card-contact-container">
                    <div class="task-contacts-ellipse flex-center" style="background-color: #1FD7C1; margin-left: -10px; border: 1px solid white">
                        <span class="task-contacts-letters">M</span><span class="task-contacts-letters">B</span>
                    </div>
                    <span style="font-size: 19px">Florian Müller</span>
                </div>
            </div>
            <div class="detailed-card-subtasks-container">
                <span style="font-size: 20px">Subtasks</span>
                <div>
                    <span style="font-size: 19px">${task.subtasks}</span>
                </div>                
            </div>
        </div>
    `;
}

function closePopup() {
    let popupOverlay = document.getElementById('popup-board-overlay');
    popupOverlay.classList.add('d-none');
}
