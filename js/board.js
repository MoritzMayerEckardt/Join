async function init() {
    includeHTML();
    await loadTasks();
    addBackgroundColor(2);
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}

function renderToDo() {
    let toDoContainer = document.getElementById('to-do-column');
    let toDo = tasks.to_do
    toDoContainer.innerHTML = '';
    for (let index = 0; index < toDo.length; index++) {
        const task = toDo[index];
        toDoContainer.innerHTML += renderCard(task);
    }
}

function renderInProgress() {
    let inProgressContainer = document.getElementById('in-progress-column');
    let inProgress = tasks.in_progress
    inProgressContainer.innerHTML = '';
    for (let index = 0; index < inProgress.length; index++) {
        const task = inProgress[index];
        inProgressContainer.innerHTML += renderCard(task);
    }
}

function renderAwaitFeedback() {
    let awaitFeedbackContainer = document.getElementById('await-feedback-column');
    let awaitFeedback = tasks.await_feedback;
    awaitFeedbackContainer.innerHTML = '';
    for (let index = 0; index < awaitFeedback.length; index++) {
        const task = awaitFeedback[index];
        awaitFeedbackContainer.innerHTML += renderCard(task);
    }
}

function renderDone() {
    let doneContainer = document.getElementById('done-column');
    let done = tasks.done;
    doneContainer.innerHTML = '';
    if (done && done.length >= 1) {
    for (let index = 0; index < done.length; index++) {
        const task = done[index];
        doneContainer.innerHTML += /*html*/`
              <div class="task-card">
                <span class="task-title">${task.title}</span>
            </div>  
        `;
        }
    } else {
        doneContainer.innerHTML = /*html*/`
            <div class="no-tasks-container">
                <span class="no-tasks-text">No tasks to do</span>
            </div>
        `;
    }
}

function renderCard(task) {
    return /*html*/`
            <div class="task-card">
                <div class="task-category">${task.category.cat_1}</div>
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
                            <span class="task-contacts-letters">AM</span>
                        </div>
                        <div class="task-contacts-ellipse flex-center" style="background-color: #1FD7C1; margin-left: -10px; border: 1px solid white">
                            <span class="task-contacts-letters">EM</span>
                        </div>
                        <div class="task-contacts-ellipse flex-center" style="background-color: #462F8A; margin-left: -10px; border: 1px solid white">
                            <span class="task-contacts-letters">MB</span>
                        </div>
                    </div>
                    <div><img style="width: 17px" src="../assets/img/prio_medium.svg" alt=""></div>
                </div>
            </div>      
        `;
}

async function loadTasks() {
    try {
        tasks = await loadData(TASKS_PATH);
    } catch (error) {
        console.error("Loading users error:", error);
    }
}