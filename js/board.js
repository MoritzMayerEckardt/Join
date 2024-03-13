let currentDraggedElement;

async function init() {
    includeHTML();
    await loadTasks();
    addBackgroundColor(2);
    renderBoard(); 
}

async function loadTasks() {
    try {
        tasks = await loadData(TASKS_PATH);
    } catch (error) {
        console.error("Loading users error:", error);
    }
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
                toDoContainer.innerHTML += renderCard(task, index);
            }
        } else {
            toDoContainer.innerHTML = /*html*/`
                <div class="no-tasks-container">
                    <span class="no-tasks-text">No tasks to do</span>
                </div>
            `;
        }
    } else {
        toDoContainer.innerHTML = /*html*/`
            <div class="no-tasks-container">
                <span class="no-tasks-text">No tasks available</span>
            </div>
        `;
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
                inProgressContainer.innerHTML += renderCard(task, index);
            }
        } else {
            inProgressContainer.innerHTML = /*html*/`
                <div class="no-tasks-container">
                    <span class="no-tasks-text">No tasks in progress</span>
                </div>
            `;
        }
    } else {
        inProgressContainer.innerHTML = /*html*/`
            <div class="no-tasks-container">
                <span class="no-tasks-text">No tasks available</span>
            </div>
        `;
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
                awaitFeedbackContainer.innerHTML += renderCard(task, index);
            }
        } else {
            awaitFeedbackContainer.innerHTML = /*html*/`
                <div class="no-tasks-container">
                    <span class="no-tasks-text">No feedback to get</span>
                </div>
            `;
        }
    } else {
        awaitFeedbackContainer.innerHTML = /*html*/`
            <div class="no-tasks-container">
                <span class="no-tasks-text">No tasks available</span>
            </div>
        `;
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
                doneContainer.innerHTML += renderCard(task, index);
            }
        } else {
            doneContainer.innerHTML = /*html*/`
                <div class="no-tasks-container">
                    <span class="no-tasks-text">No tasks done</span>
                </div>
            `;
        }
    } else {
        doneContainer.innerHTML = /*html*/`
            <div class="no-tasks-container">
                <span class="no-tasks-text">No tasks available</span>
            </div>
        `;
    }
}


function getBackgroundColorTaskCategory(type) {
    switch (type) {
        case 'User Story':
            return '#0038FF';
        case 'Technical Task':
            return '#1FD7C1';
}

}
function prepareBackgroundColorTaskCategory(index) {
    let category = tasks[index].category;
    let backgroundColor = getBackgroundColorTaskCategory(category);
    return backgroundColor;
}

function renderCard(task, index) {
    return /*html*/`
            <div draggable="true" ondragstart="startDragging(${index})" class="task-card">
                <div class="task-category">${task.category}</div>
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

function startDragging(index) {
    currentDraggedElement = index;
    console.log("Current dragged element index:", index)
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(category) {
        tasks[currentDraggedElement].boardCategory = category;
        await postData();
        renderBoard();
}
