let greeting;

async function initSummary() {
    await includeHTML();
    await loadUsers();
    await loadCurrentUserIndex();
    addBackgroundColor(0);
    greetBasedOnTime();
    renderData();
    showCurrentUserInButton();
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


function renderData(){
    renderCurrentUserName();
    console.log('der aktuelle Nutzer ist')
}

function renderCurrentUserName() {

    let greetingName = document.getElementById('greeting-name');

    if(currentUserIndex == 'guestLogin') {
        greetingName.innerHTML = '';
    } else {
        let name = users[currentUserIndex]['name']
        greetingName.innerHTML = name;
        document.getElementById('greet').innerHTML = greeting + ',';
    }
}

function showCurrentUserInButton() {
    let userInitialsButton = document.getElementById('userInitials');
    userInitialsButton.innerHTML = currentUserIndex;
}