let addedSubtasks = [];

async function addTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let assigned = document.getElementById('assigned');
    let date = document.getElementById('date');
    let category = document.getElementById('category');
    let subtasks = document.getElementById('subtasks');
    let boardCategory = 'toDo';
    if (!tasks) {
        tasks = [];
    }
    tasks.push({
        title: title.value,
        description: description.value,
        assigned: assigned.value,
        date: date.value,
        category: category.value,
        subtasks: subtasks.value,
        boardCategory: boardCategory,
    });
    await postData();
    renderBoard();
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

function addNewSubtask() {

    let addSubtask = document.getElementById('addSubtask').value;
    if (addSubtask === "") {
        // Gib eine Benachrichtigung aus, dass das Feld ausgefüllt werden muss
        alert("This input field is required.");
        return; // Beende die Funktion, wenn das Feld leer ist
    }
    if (addedSubtasks.length < 5) {
        addedSubtasks.push(addSubtask);
        getSubtask();
    } else {
        // Gib eine Benachrichtigung aus, dass das Maximum erreicht ist
        alert("You can only add up to 5 subtasks.");
    }

}


function getSubtask() {

    let newSubtask = document.getElementById('newSubtask');

    newSubtask.innerHTML = ``;

    for (i = 0; i < addedSubtasks.length; i++) {
        newSubtask.innerHTML += `
       <div>
            <b> •${addedSubtasks[i]} </b> <br>
        </div>`

    }

    document.getElementById('addSubtask').value = ``;


}

function clearForm() {
    // Formularelemente zurücksetzen
    document.getElementById('title').value = ''; // Titel zurücksetzen
    document.getElementById('description').value = ''; // Beschreibung zurücksetzen
    document.getElementById('category').selectedIndex = 0; // Das zweite Select-Feld zurücksetzen
    document.getElementById('priority').selectedIndex = 0; // Das erste Select-Feld zurücksetzen
    document.getElementById('date').value = ''; // Datum zurücksetzen
    document.getElementById('addSubtask').value = ''; // Subtask-Eingabefeld zurücksetzen

    // Neue Subtasks löschen
    document.getElementById('newSubtask').innerHTML = '';
}




