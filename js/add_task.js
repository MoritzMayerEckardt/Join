async function initAddTask() {
    await includeHTML();
    await loadCurrentUserIndex(); 
    await loadTasks();
    await loadContacts();
    await loadUsers();
    await loadGuestLogin();
    addBackgroundColor(1);
    showCurrentUserInButton();
    showCurrentUserInButtonMobile();
}

async function addTask() {
    createTasksIfNotCreated();
    pushValuesToTasks();
    await postTasks(TASKS_PATH);
    saveTaskIdCounter();
    jumpToBoard()
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
    let priority;
    if (lastClickedButton === 'urgent') {
        priority = 'urgent';
    } else if (lastClickedButton === 'medium') {
        priority = 'medium';
    } else if (lastClickedButton === 'low') {
        priority = 'low';
    } else {
        priority = 'medium';
    }
    return { title, description, assigned, date, category, priority, };
}

function pushValuesToTasks() {
    let boardCategory = "toDo";
    let { title, description, date, category, priority } = getValuesFromInput();
    tasks.push({
        id: taskIdCounter++,
        title: title.value,
        description: description.value,
        assigned: chosenContacts,
        date: date.value,
        category: category.value,
        subtasks: subtaskArray,
        boardCategory: boardCategory,
        priority: priority
    });
}

function addNewSubtask() {
    let addNewSubtask = document.getElementById('subtasks').value;
    if (subtaskArray.length < 2) {
        subtaskArray.push({
            title: addNewSubtask,
            isChecked: false
        });
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
             <b> •${subtaskArray[i].title} </b> 
         </div>`
    }
    document.getElementById('subtasks').value = ``;
}

function handleKeyPress(event) {
    if (event.keyCode === 13) { // 13 entspricht der Enter-Taste
        event.preventDefault(); // Standardverhalten unterdrücken
        addNewSubtask();
    }
}

function clearForm() {
    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
    document.getElementById('assigned').selectedIndex = 0;
    document.getElementById('date').value = "";
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('subtasks').value = "";
    document.getElementById('showChosenInitials').innerHTML= "";
    subtaskArray = [];
    chosenContacts = [];
    getNewSubtask();
    resetButtonStyles();
}

function resetButtonStyles() {
    let urgentButton = document.getElementById('urgentButton');
    let mediumButton = document.getElementById('mediumButton');
    let mediumButtonText = document.getElementById('mediumText');
    let prioMedium = document.getElementById('prioMedium');
    let lowButton = document.getElementById('lowButton');
    let redArrow = document.getElementById('redArrow');
    let greenArrow = document.getElementById('greenArrow');
    let whiteArrow = document.getElementById('whiteArrow');
    let whiteArrowLow = document.getElementById('whiteArrowLow');

    urgentButton.style.backgroundColor = '';
    urgentButton.style.color = '';
    redArrow.style.display = '';
    whiteArrow.style.display = '';

    mediumButton.style.backgroundColor = '';
    mediumButton.style.color = '';
    mediumButtonText.style.fontWeight = '';
    prioMedium.style.display = '';

    lowButton.style.backgroundColor = '';
    lowButton.style.color = '';
    greenArrow.style.display = '';
    whiteArrowLow.style.display = '';
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
        prioMedium.style.display = 'flex';

    } else if (clickedButton === 'medium') {
        mediumButton.style.backgroundColor = 'rgba(255, 168, 0, 1)';
        mediumButton.style.color = 'white';
        mediumButtonText.style.fontWeight = '700';
        prioMedium.style.display = 'none';

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
        prioMedium.style.display = 'flex';

        urgentButton.style.backgroundColor = 'white';
        urgentButton.style.color = 'black';
        redArrow.style.display = 'flex';
        whiteArrow.style.display = 'none';
    }
    lastClickedButton = clickedButton;
}

function jumpToBoard() {
    window.location.href = "../board.html";
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('assigned').addEventListener('click', function(event) {
        let showContacts = document.getElementById('showContactsToAssign');
        let arrowImage = document.getElementById('dropdownArrow');
        let initialDIV = document.getElementById('showChosenInitials');
        initialDIV.style.display = 'flex';
        toggleContactsVisibility();
    });
    
    document.addEventListener('click', function(event) {
        let showContacts = document.getElementById('showContactsToAssign');
        let arrowImage = document.getElementById('dropdownArrow');
        let initialDIV = document.getElementById('showChosenInitials');
        let assignedDIV = document.getElementById('assigned');

        if (showContacts.style.display !== 'none') {
            if (!showContacts.contains(event.target) && event.target !== assignedDIV && event.target.id !== 'assigned' && event.target.id !== 'standardOption' && event.target.id !== 'dropdownArrow') {
                showContacts.innerHTML = '';
                contactsVisible = false;
                arrowImage.style.transform = 'rotate(0deg)';
                initialDIV.style.display = 'flex';
            }
        }
    });
});

function toggleContactsVisibility() {
    let showContacts = document.getElementById('showContactsToAssign');
    let arrowImage = document.getElementById('dropdownArrow');
    let initialDIV = document.getElementById('showChosenInitials');

    if (contactsVisible) {
        showContacts.innerHTML = '';
        contactsVisible = false;
        arrowImage.style.transform = 'rotate(0deg)';
        initialDIV.style.display = 'flex !important';
    } else {
        showContactsForAssign();
        contactsVisible = true;
        arrowImage.style.transform = 'rotate(180deg)';
        initialDIV.style.display = 'none';
    }
}

function showContactsForAssign() {
    let showContacts = document.getElementById('showContactsToAssign');
    showContacts.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        showContacts.innerHTML += `
        <div id="newcontact${i}" class="newcontact">
            <div class="circle" style="background-color: ${contact.color};">
                <p>${contact.initials}</p>
            </div>
            <div class="nameAndCheckbox">    
                <p class="contactName">${contact.name}</p>
                <input type="checkbox" id="checkbox${i}" class="checkBox">
            </div> 
        </div>`;
    }
    chosenContact();
}

function chosenContact() {
    for (let i = 0; i < contacts.length; i++) {
        let contactElement = document.getElementById(`newcontact${i}`);
        contactElement.style.backgroundColor = '';
        contactElement.addEventListener('click', function () {
            let currentBackgroundColor = window.getComputedStyle(contactElement).getPropertyValue('background-color');
            if (currentBackgroundColor === 'rgb(42, 54, 71)') {
                contactElement.style.backgroundColor = '';
                contactElement.style.color = 'black';
                let checkbox = contactElement.querySelector('.checkBox');
                checkbox.checked = false;
                let index = chosenContacts.findIndex(c => c.name === contacts[i].name);
                if (index !== -1) {
                    chosenContacts.splice(index, 1);
                }
            } else {
                contactElement.style.backgroundColor = 'rgb(42, 54, 71)';
                contactElement.style.color = 'white';
                let checkbox = contactElement.querySelector('.checkBox');
                checkbox.checked = true;

                let index = chosenContacts.findIndex(c => c.name === contacts[i].name);
                if (index === -1) {
                    chosenContacts.push(contacts[i]);
                }
            }
            showChosenInitials();
        });
        checkedContactStaysChecked(contactElement, i);
    }
}

function checkedContactStaysChecked(contactElement, i) {
    if (chosenContacts.findIndex(c => c.name === contacts[i].name) !== -1) {
        contactElement.style.backgroundColor = '#2A3647';
        contactElement.style.color = 'white';
        let checkbox = contactElement.querySelector('.checkBox');
        checkbox.checked = true;
    }
}

function showChosenInitials() {
    let showChosenInitials = document.getElementById('showChosenInitials');
    showChosenInitials.innerHTML = '';
    chosenContacts.forEach(contact => {
        if (chosenContacts.includes(contact)) {
            showChosenInitials.innerHTML += `
            <div class="circleSmall" style="background-color: ${contact.color};">
                <p>${contact.initials}</p>
            </div>`;
        } else {
            showChosenInitials.innerHTML += ``;
        }
    });
}






