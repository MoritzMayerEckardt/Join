async function init() {
    includeHTML();
    await loadTasks();
    renderTasks();
}

function renderTasks() {
    let content = document.getElementById('board-content');
    content.innerHTML = '';
    for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];
        content.innerHTML += /*html*/`
            <div class="task-card">
                <div class="task-category flex-center">${task.category}</div>
                <span class="task-title">${task.title}</span>
                <span>${task.assigned}</span>
                <span>${task.date}</span>
                <span>${task.priority}</span>
                <span>${task.title}</span>
                <span>${task.subtasks}</span>
            </div>
        `;
    }
}

async function loadTasks() {
    try {
        tasks = await loadData(TASKS_PATH);
    } catch (error) {
        console.error("Loading users error:", error);
    }
}