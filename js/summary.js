let greeting;

/**
 * Initializes the summary page by loading necessary data and rendering the UI.
 * Also sets up event listeners for user interactions.
 */
async function initSummary() {
    await includeHTML();
    await loadGuestLogin();
    await loadUsers();
    await loadCurrentUserIndex();
    await loadGuestLogin();
    greetBasedOnTimeMobile();
    addBackgroundColor(0);
    greetBasedOnTime();
    renderData();
    showCurrentUserInButton();
    loadMobileMenu();
    showCurrentUserInButtonMobile();
}

function greetBasedOnTimeMobile() {
    if (window.innerWidth < 700) {
        if (document.referrer.includes("index.html")) {
            document.getElementById('greeting-container-mobile').classList.remove('d-none');
            setTimeout(() => {
                document.getElementById('greeting-container-mobile').classList.add('d-none');
            }, 1500);
        }
    }
}


/**
 * Sets the greeting based on the time of day.
 */
function greetBasedOnTime() {
    const now = new Date();
    const hour = now.getHours();
    greeting = "";

    if (hour >= 3 && hour < 12) {
        greeting = "Good morning,";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon,";
    } else {
        greeting = "Good evening,";
    }
    document.getElementById('greet').innerHTML = greeting;
}


/**
 * Renders various data elements on the summary page.
 * Updates the UI with the number of tasks, to-dos, done tasks, etc.
 */
function renderData() {
    renderCurrentUserName();
    loadAmountTodo();
    loadAmountDone();
    loadAmountAllTasks();
    loadAmountInProgress();
    loadAmountAwaitingFeedback();
    loadAmountUrgentTasks();
    loadUrgentDeadline();
}


/**
 * Renders the name of the current user on the summary page.
 * If the current user is a guest, displays "Dear Guest".
 */
function renderCurrentUserName() {
    let greetingName = document.getElementById('greeting-name');
    if (currentUserIndex == 'guestLogin') {
        greetingName.innerHTML = 'Dear Guest';
    } else {
        let name = users[currentUserIndex]['name']
        greetingName.innerHTML = name;
        document.getElementById('greet').innerHTML = greeting;
    }
}


/**
 * Loads and displays the number of tasks in the "toDo" category for the current user.
 */
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

/**
 * Loads and displays the number of tasks in the "done" category for the current user.
 */
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


/**
 * Loads and displays the total number of tasks for the current user.
 */
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


/**
 * Loads and displays the number of tasks in the "inProgress" category for the current user.
 */
function loadAmountInProgress() {
    let inProgressCount = 0;
    let tasks = getCurrentUserTasks();
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].boardCategory === "inProgress") {
            inProgressCount++;
        }
    }
    document.getElementById('tasks-in-progress').innerHTML = inProgressCount;
}


/**
 * Loads and displays the number of tasks in the "inProgress" category for the current user.
 */
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


/**
 * Loads and displays the number of tasks in the "awaitFeedback" category for the current user.
 */
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


/**
 * Loads and displays the number of tasks marked as "urgent" for the current user.
 */
function loadAmountUrgentTasks() {
    let urgentCount = 0;
    let tasks = getCurrentUserTasks();
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].priority === "urgent") {
            urgentCount++;
        }
    }
    document.getElementById('urgent-tasks-amount').innerHTML = urgentCount;
}


/**
 * Loads and displays the nearest deadline among tasks marked as "urgent" for the current user.
 */
function loadUrgentDeadline() {
    let tasks = getCurrentUserTasks();
    let urgentDates = getUrgentDates(tasks);
    let formattedDate = formatLatestDate(urgentDates);
    document.getElementById('urgent-deadline').innerHTML = formattedDate;
}


/**
 * Returns the tasks of the current user.
 * If the current user is a guest, returns the guest's tasks.
 * @returns {Array} An array of tasks for the current user.
 */
function getCurrentUserTasks() {
    if (currentUserIndex === 'guestLogin') {
        return guest['tasks'] || [];
    } else {
        return (users[currentUserIndex] && users[currentUserIndex]['tasks']) || [];
    }
}


/**
 * Filters tasks marked as "urgent" and returns their dates.
 * @param {Array} tasks - An array of tasks to filter.
 * @returns {Array} An array of dates of "urgent" tasks.
 */
function getUrgentDates(tasks) {
    return tasks
        .filter(task => task.priority === "urgent")
        .map(task => new Date(task.date));
}


/**
 * Formats the latest date from an array of dates into a readable string.
 * @param {Array} dates - An array of Date objects.
 * @returns {string} A formatted date string or 'No' if no dates provided.
 */
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