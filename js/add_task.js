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

    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
    document.getElementById('assigned').selectedIndex = 0;
    document.getElementById('date').value = "";
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('subtasks').value = "";
    subtaskArray = [];
    getNewSubtask();

}

function changeBackgroundColor(clickedButton) {
    let urgentButton = document.getElementById('urgentButton');
    let mediumButton = document.getElementById('mediumButton');
    let mediumButtonText = document.getElementById('mediumText');
    let prioMedium = document.getElementById('prioMedium');
    let lowButton = document.getElementById('lowButton');
    let redArrow = document.getElementById('redArrow');
    let greenArrow = document.getElementById('greenArrow');
    let whiteArrow = document.getElementById('whiteArrow');
    let whiteArrowLow = document.getElementById('whiteArrowLow')



    if (clickedButton === 'urgent') {
        urgentButton.style.backgroundColor = 'rgba(255, 61, 0, 1)';
        urgentButton.style.color = 'white';
        redArrow.style.display = 'none';
        whiteArrow.style.display = 'flex';

        lowButton.style.backgroundColor = 'white';
        lowButton.style.color = 'black';
        greenArrow.style.display = 'flex';
        whiteArrowLow.style.display = 'none';

        mediumButton.style.backgroundColor = 'white';
        mediumButton.style.color = 'black';
        mediumButtonText.style.fontWeight = 'normal';
        prioMedium.style.display ='flex';


    } else if (clickedButton === 'medium') {
        mediumButton.style.backgroundColor = 'rgba(255, 168, 0, 1)';
        mediumButton.style.color = 'white';
        mediumButtonText.style.fontWeight = '700';
        prioMedium.style.display ='none';

        urgentButton.style.backgroundColor = 'white';
        urgentButton.style.color = 'black';
        redArrow.style.display = 'flex';
        whiteArrow.style.display = 'none';

        lowButton.style.backgroundColor = 'white';
        lowButton.style.color = 'black';
        greenArrow.style.display = 'flex';
        whiteArrowLow.style.display = 'none';

    } else if (clickedButton === 'low') {
        lowButton.style.backgroundColor = 'rgba(122, 226, 41, 1)';
        lowButton.style.color = 'white';
        greenArrow.style.display = 'none';
        whiteArrowLow.style.display = 'flex';

        mediumButton.style.backgroundColor = 'white';
        mediumButton.style.color = 'black';
        mediumButtonText.style.fontWeight = 'normal';
        prioMedium.style.display ='flex';

        urgentButton.style.backgroundColor = 'white';
        urgentButton.style.color = 'black';
        redArrow.style.display = 'flex';
        whiteArrow.style.display = 'none';
    }
}

