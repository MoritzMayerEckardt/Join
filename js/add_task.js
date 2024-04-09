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
    await postData(TASKS_PATH);
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
    const urgentButton = document.getElementById('urgentButton');
    const mediumButton = document.getElementById('mediumButton');
    const mediumButtonText = document.getElementById('mediumText');
    const prioMedium = document.getElementById('prioMedium');
    const lowButton = document.getElementById('lowButton');
    const redArrow = document.getElementById('redArrow');
    const greenArrow = document.getElementById('greenArrow');
    const whiteArrow = document.getElementById('whiteArrow');
    const whiteArrowLow = document.getElementById('whiteArrowLow');

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
    // Dieser Eventlistener wird ausgeführt, wenn 'assigned' angeklickt wird und es wird toggleContactsVisibility() ausgeführt.
    document.getElementById('assigned').addEventListener('click', function(event) {
        // Elemente aus dem DOM auswählen
        let showContacts = document.getElementById('showContactsToAssign');
        let arrowImage = document.getElementById('dropdownArrow');
        let initialDIV = document.getElementById('showChosenInitials');
        
        // Zeige initialDIV an
        initialDIV.style.display = 'flex';
        
        // Schließe showContactsToAssign und setze die andere Logik für das Klicken auf assigned fort
        toggleContactsVisibility();
    });
    
    // Dieser Eventlistener sorgt dafür, dass sich beim Klicken außerhalb den Containers, der Container wieder schließt.
    document.addEventListener('click', function(event) {
        // Elemente aus dem DOM auswählen
        let showContacts = document.getElementById('showContactsToAssign');
        let arrowImage = document.getElementById('dropdownArrow');
        let initialDIV = document.getElementById('showChosenInitials');
        let assignedDIV = document.getElementById('assigned');

        // Überprüfen, ob die Liste der zuzuweisenden Kontakte sichtbar ist
        if (showContacts.style.display !== 'none') {
            // Überprüfen, ob der Klick außerhalb der Liste und bestimmter anderer Elemente erfolgt ist
            if (!showContacts.contains(event.target) && event.target !== assignedDIV && event.target.id !== 'assigned' && event.target.id !== 'standardOption' && event.target.id !== 'dropdownArrow') {
                // Wenn ja, die Liste leeren und das Aussehen ändern
                showContacts.innerHTML = '';
                contactsVisible = false;
                arrowImage.style.transform = 'rotate(0deg)';
                initialDIV.style.display = 'flex';
            }
        }
    });
});

// Diese Funktion ändert die Sichtbarkeit der Liste der zuzuweisenden Kontakte
function toggleContactsVisibility() {
    // Elemente aus dem DOM auswählen
    let showContacts = document.getElementById('showContactsToAssign');
    let arrowImage = document.getElementById('dropdownArrow');
    let initialDIV = document.getElementById('showChosenInitials');

    // Überprüfen, ob die Liste der zuzuweisenden Kontakte sichtbar ist
    if (contactsVisible) {
        // Wenn ja, leere die Liste und ändere das Aussehen entsprechend
        showContacts.innerHTML = '';
        contactsVisible = false;
        arrowImage.style.transform = 'rotate(0deg)';
        initialDIV.style.display = 'flex !important';
    } else {
        // Wenn nicht, zeige die Liste an und ändere das Aussehen entsprechend
        showContactsForAssign();
        contactsVisible = true;
        arrowImage.style.transform = 'rotate(180deg)';
        initialDIV.style.display = 'none';
    }
}




// Diese Funktion zeigt die Liste der Kontakte an, die zur Zuweisung verfügbar sind
function showContactsForAssign() {
    // Das Element 'showContactsToAssign' aus dem DOM auswählen
    let showContacts = document.getElementById('showContactsToAssign');
    // Die HTML-Inhalte des Elements leeren
    showContacts.innerHTML = '';

    // Eine Schleife durchläuft alle Kontakte und fügt sie der Liste hinzu
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        // Das HTML für jedes Kontakt-Element erstellen und zur 'showContacts' Liste hinzufügen
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
    // Die Funktion 'chosenContact' aufrufen, um das Verhalten der Kontakt-Elemente zu definieren
    chosenContact();
}

// Diese Funktion definiert das Verhalten der ausgewählten Kontakte
// Diese Funktion definiert das Verhalten der ausgewählten Kontakte
function chosenContact() {
    // Eine Schleife durchläuft alle Kontakte
    for (let i = 0; i < contacts.length; i++) {
        let contactElement = document.getElementById(`newcontact${i}`);
        // Die Hintergrundfarbe des Kontakt-Elements zurücksetzen
        contactElement.style.backgroundColor = '';
        // Ein Eventlistener wird auf das Kontakt-Element angewendet, um das Klicken zu behandeln
        contactElement.addEventListener('click', function () {
            // Die aktuelle Hintergrundfarbe des Kontakt-Elements abrufen
            let currentBackgroundColor = window.getComputedStyle(contactElement).getPropertyValue('background-color');
            // Überprüfen, ob das Kontakt-Element ausgewählt ist oder nicht
            if (currentBackgroundColor === 'rgb(42, 54, 71)') {
                // Wenn ausgewählt, das Aussehen zurücksetzen und den Kontakt aus der Liste der ausgewählten Kontakte entfernen
                contactElement.style.backgroundColor = '';
                contactElement.style.color = 'black';
                let checkbox = contactElement.querySelector('.checkBox');
                checkbox.checked = false;

                let index = chosenContacts.findIndex(c => c.name === contacts[i].name);
                if (index !== -1) {
                    chosenContacts.splice(index, 1);
                }
            } else {
                // Wenn nicht ausgewählt, das Aussehen ändern und den Kontakt zur Liste der ausgewählten Kontakte hinzufügen
                contactElement.style.backgroundColor = 'rgb(42, 54, 71)';
                contactElement.style.color = 'white';
                let checkbox = contactElement.querySelector('.checkBox');
                checkbox.checked = true;

                let index = chosenContacts.findIndex(c => c.name === contacts[i].name);
                if (index === -1) {
                    chosenContacts.push(contacts[i]);
                }
            }
            // Die Funktion 'showChosenInitials' aufrufen, um die ausgewählten Initialen anzuzeigen
            showChosenInitials();
        });
        // Die Funktion 'checkedContactStaysChecked' aufrufen, um sicherzustellen, dass ausgewählte Kontakte ausgewählt bleiben
        checkedContactStaysChecked(contactElement, i);
    }
}

// Diese Funktion stellt sicher, dass ausgewählte Kontakte ausgewählt bleiben
function checkedContactStaysChecked(contactElement, i) {
    // Überprüfen, ob der aktuelle Kontakt in der Liste der ausgewählten Kontakte enthalten ist
    if (chosenContacts.findIndex(c => c.name === contacts[i].name) !== -1) {
        // Wenn ja, das Aussehen entsprechend ändern
        contactElement.style.backgroundColor = '#2A3647';
        contactElement.style.color = 'white';
        let checkbox = contactElement.querySelector('.checkBox');
        checkbox.checked = true;
    }
}


// Diese Funktion zeigt die ausgewählten Initialen an
function showChosenInitials() {
    // Das Element 'showChosenInitials' aus dem DOM auswählen
    let showChosenInitials = document.getElementById('showChosenInitials');
    // Die HTML-Inhalte des Elements leeren
    showChosenInitials.innerHTML = '';

    // Durch alle ausgewählten Kontakte iterieren und die Initialen anzeigen
    chosenContacts.forEach(contact => {
        if (chosenContacts.includes(contact)) {
            // Wenn der Kontakt ausgewählt ist, die Initialen anzeigen
            showChosenInitials.innerHTML += `
            <div class="circleSmall" style="background-color: ${contact.color};">
                <p>${contact.initials}</p>
            </div>`;
        } else {
            // Andernfalls nichts anzeigen
            showChosenInitials.innerHTML += ``;
        }
    });
}






