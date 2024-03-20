let taskIdCounter = localStorage.getItem('taskIdCounter') ? parseInt(localStorage.getItem('taskIdCounter')) : 0;
let subtaskArray = [];

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
    return { title, description, assigned, date, category };
}

function pushValuesToTasks() {
    let boardCategory = "toDo";
    let { title, description, assigned, date, category } = getValuesFromInput();
    tasks.push({
        id: taskIdCounter++,
        title: title.value,
        description: description.value,
        assigned: assigned.value,
        date: date.value,
        category: category.value,
        subtasks: subtaskArray,
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

function addNewSubtask() {
    let addNewSubtask = document.getElementById('subtasks').value;

    if (subtaskArray.length < 2) {
        subtaskArray.push(addNewSubtask);
        getNewSubtask();
    } else {
        alert("You can only add a maximum of two subtasks.");
    }
}

function getNewSubtask() {
    console.log("getNewSubtask() wird aufgerufen")
    let newSubtask = document.getElementById('newSubtask');

    newSubtask.innerHTML = ``;

    for (i = 0; i < subtaskArray.length; i++) {
        newSubtask.innerHTML += `
        <div> 
             <b> •${subtaskArray[i]} </b> 
         </div>`

    }

    document.getElementById('subtasks').value = ``;
}

function clearForm() {

    document.getElementById('title').value = ""; // Titel löschen
    document.getElementById('description').value = ""; // Beschreibung löschen
    document.getElementById('assigned').selectedIndex = 0; // Auswahl zurücksetzen
    document.getElementById('date').value = ""; // Datum löschen
    document.getElementById('category').selectedIndex = 0; // Auswahl zurücksetzen
    document.getElementById('subtasks').value = ""; // Subtasks löschen
    subtaskArray = []; // Subtask-Array leeren
    getNewSubtask(); // Anzeige der Subtasks aktualisieren

}
