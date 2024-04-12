let greeting;

async function initSummary() {
    await includeHTML();
    await loadGuestLogin();
    await loadUsers();
    await loadCurrentUserIndex();
    await loadGuestLogin();
    addBackgroundColor(0);
    greetBasedOnTime();
    renderData();
    showCurrentUserInButton();
    loadMobileMenu();
    showCurrentUserInButtonMobile();
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
        greetingName.innerHTML = 'Dear Guest';
    } else {
        let name = users[currentUserIndex]['name']
        greetingName.innerHTML = name;
        document.getElementById('greet').innerHTML = greeting + ',';
    }
}

function loadAmountTodo() {
    let tasks = getCurrentUserTasks();
    let todoCount = countTasksByBoard(tasks, "toDo");
    document.getElementById('amount-todo').innerHTML = todoCount;
}


function loadAmountTodo() {
    let todoCount = 0;
    let tasks;
    if (currentUserIndex === 'guestLogin') {
        tasks = guest['tasks'] || [];
    } else {
        tasks = (users[currentUserIndex] && users[currentUserIndex].tasks) || [];
    }
    if (tasks.length) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].boardCategory === "toDo") {
                todoCount++;
            }
        }
    }
    document.getElementById('amount-todo').innerHTML = todoCount;
}


function loadAmountDone() {
    let doneCount = 0;
    let tasks;
    if (currentUserIndex === 'guestLogin') {
        tasks = guest['tasks'] || [];
    } else {
        tasks = (users[currentUserIndex] && users[currentUserIndex].tasks) || [];
    }
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].boardCategory === "done") {
            doneCount++;
        }
    }
    document.getElementById('amount-done').innerHTML = doneCount;
}


function loadAmountAllTasks() {
    let allTasks;
    if (currentUserIndex === 'guestLogin') {
        allTasks = guest['tasks'] || [];
    } else {
        allTasks = (users[currentUserIndex] && users[currentUserIndex].tasks) || [];
    }
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
        tasks = guest['tasks'] || [];
    } else {
        tasks = (users[currentUserIndex] && users[currentUserIndex].tasks) || [];
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
        tasks = guest['tasks'] || [];
    } else {
        tasks = (users[currentUserIndex] && users[currentUserIndex].tasks) || [];
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
        tasks = guest['tasks'] || [];
    } else {
        tasks = (users[currentUserIndex] && users[currentUserIndex].tasks) || [];
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
        tasks = guest['tasks'] || [];
    } else {
        tasks = (users[currentUserIndex] && users[currentUserIndex].tasks) || [];
    }
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].priority === "urgent") {
            urgentCount++;
        }
    }
    document.getElementById('urgent-tasks-amount').innerHTML = urgentCount;
}


function loadUrgentDeadline() {
    let tasks = getCurrentUserTasks();
    let urgentDates = getUrgentDates(tasks);
    let formattedDate = formatLatestDate(urgentDates);
    document.getElementById('urgent-deadline').innerHTML = formattedDate;
}


function getCurrentUserTasks() {
    if (currentUserIndex === 'guestLogin') {
        return guest['tasks'] || [];
    } else {
        return (users[currentUserIndex] && users[currentUserIndex]['tasks']) || [];
    }
}


function getUrgentDates(tasks) {
    return tasks
        .filter(task => task.priority === "urgent")
        .map(task => new Date(task.date));
}


function getUrgentDates(tasks) {
    return tasks
        .filter(task => task.priority === "urgent")
        .map(task => new Date(task.date));
}


function formatLatestDate(dates) {
    if (dates && dates.length > 0) {
        dates.sort((a, b) => a - b);
        let latestDate = dates[0];
        return latestDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    } else {
        return 'No';
    }
}