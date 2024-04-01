let greeting;

async function initSummary() {
    await includeHTML();
    await loadUsers();
    await loadCurrentUserIndex();
    addBackgroundColor(0);
    greetBasedOnTime();
    renderData();
}




function greetBasedOnTime() {
    const now = new Date();
    const hour = now.getHours();
    greeting = "";

    if (hour >= 3 && hour < 12) {
        greeting = "Good morning";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }
    document.getElementById('greet').innerHTML = greeting;
}


function renderData() {
    renderCurrentUserName();
    loadAmountTodo();
    loadAmountDone();
}

function renderCurrentUserName() {

    let greetingName = document.getElementById('greeting-name');

    if (currentUserIndex == 'guestLogin') {
        greetingName.innerHTML = '';
    } else {
        let name = users[currentUserIndex]['name']
        greetingName.innerHTML = name;
        document.getElementById('greet').innerHTML = greeting + ',';
    }
}

function loadAmountTodo() {
    let todoCount = 0;
    let tasks;

    if (currentUserIndex === 'guestLogin') {
        tasks = 'guest';
    } else {
        tasks = users[currentUserIndex].tasks;
    }

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].boardCategory === "toDo") {
            todoCount++;
        }
    }
    document.getElementById('amount-todo').innerHTML = todoCount;
}

function loadAmountDone() {
    let doneCount = 0;
    let tasks;

    if (currentUserIndex === 'guestLogin') {
        tasks = 'guest';
    } else {
        tasks = users[currentUserIndex].tasks;
    }

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].boardCategory === "done") {
            doneCount++;
        }
    }
    document.getElementById('amount-done').innerHTML = doneCount;
}