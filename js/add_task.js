let taskIdCounter = localStorage.getItem('taskIdCounter') ? parseInt(localStorage.getItem('taskIdCounter')) : 0;

async function initAddTask() {
    await includeHTML();
    await loadTasks();
    addBackgroundColor(1);
}

async function addTask() {
    createTasksIfNotCreated();
    pushValuesToTasks();
    await postData();
    saveTaskIdCounter();
}

function createTasksIfNotCreated() {
    if (!tasks) {
        tasks = []; 
    }
}

function getValuesFromInput() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let assigned = document.getElementById('assigned');
    let date = document.getElementById('date');
    let category = document.getElementById('category');
    let subtasks = document.getElementById('subtasks');
    return (title, description, assigned, date, category, subtasks);
}

function pushValuesToTasks() {
    let boardCategory = "toDo";
    getValuesFromInput();
    tasks.push({
        id: taskIdCounter++,
        title: title.value,
        description: description.value,
        assigned: assigned.value,
        date: date.value,
        category: category.value,
        subtasks: subtasks.value,
        boardCategory: boardCategory,
    });
}

async function postData(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(tasks)
    });
    return responseAsJson = await response.json();
}

function saveTaskIdCounter() {
    localStorage.setItem('taskIdCounter', taskIdCounter.toString());
}
