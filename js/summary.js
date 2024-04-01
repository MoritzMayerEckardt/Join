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
    loadAmountAllTasks();
    loadAmountInProgress();
    loadAmountAwaitingFeedback();

    loadAmountUrgentTasks()
    loadUrgentDeadline();

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

function loadAmountAllTasks() {
    let allTasks = users[currentUserIndex]['tasks'];

    if (allTasks.length) {
        document.getElementById('tasks-amount').innerHTML = allTasks.length;
    } else {
        document.getElementById('tasks-amount').innerHTML = 0;
    }
}

function loadAmountInProgress() {
    let inProgressCount = 0;
    let tasks;

    if (currentUserIndex === 'guestLogin') {
        tasks = 'guest';
    } else {
        tasks = users[currentUserIndex].tasks;
    }

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].boardCategory === "inProgress") {
            inProgressCount++;
        }
    }
    document.getElementById('tasks-in-progress').innerHTML = inProgressCount;
}

function loadAmountAwaitingFeedback() {
    let awaitFeedbackCount = 0;
    let tasks;

    if (currentUserIndex === 'guestLogin') {
        tasks = 'guest';
    } else {
        tasks = users[currentUserIndex].tasks;
    }

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].boardCategory === "awaitFeedback") {
            awaitFeedbackCount++;
        }
    }
    document.getElementById('tasks-await-feedback').innerHTML = awaitFeedbackCount;
}

function loadAmountAwaitingFeedback() {
    let awaitFeedbackCount = 0;
    let tasks;

    if (currentUserIndex === 'guestLogin') {
        tasks = 'guest';
    } else {
        tasks = users[currentUserIndex].tasks;
    }

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].boardCategory === "awaitFeedback") {
            awaitFeedbackCount++;
        }
    }
    document.getElementById('tasks-await-feedback').innerHTML = awaitFeedbackCount;
}

function loadAmountUrgentTasks() {
    let urgentCount = 0;
    let tasks;

    if (currentUserIndex === 'guestLogin') {
        tasks = 'guest';
    } else {
        tasks = users[currentUserIndex].tasks;
    }

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].priority === "urgent") {
            urgentCount++;
        }
    }
    document.getElementById('urgent-tasks-amount').innerHTML = urgentCount;
}


function loadUrgentDeadline() {
    // Filtere nach Objekten mit priority: "urgent"
    let urgentDates = users[currentUserIndex]['tasks'].filter(user => user.priority === "urgent").map(user => new Date(user.date));

    // Sortiere die Datumswerte absteigend
    urgentDates.sort((a, b) => a - b);

    // Das jüngste Datum auswählen
    let juengstesDatum = urgentDates[0];

    let formattedDate = juengstesDatum.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
      
      document.getElementById('urgent-deadline').innerHTML = formattedDate;
}