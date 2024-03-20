async function initContacts() {
    await includeHTML();
    addBackgroundColor(3);
    loadContacts();
}

function openDialogAddContacts() {
    let dialog = document.getElementById('dialog-add-contacts')
    dialog.classList.remove('d-none');
    dialog.style.animation = 'slideInFromRight 0.250s ease-in-out';
    dialog.style.right = '0';
}



function closeDialog() {
    let dialog = document.getElementById('dialog-add-contacts');
    dialog.style.animation = 'slideOutToRight 0.3s ease-in-out';
    dialog.style.right = '-200%';
    setTimeout(() => {
        dialog.classList.add('d-none');
    }, 250);
}

function doNotClose(event) {
    event.stopPropagation();
}

function addContact() {

    console.log('Kontakt wurde erfolgreich hinzugefügt')
    let dialog = document.getElementById('dialog-add-contacts');
    dialog.classList.add('d-none');
    showSlideContainer();
    addContactToArray();
    

    addContacts();
    clearAddContactForm();
}

function clearAddContactForm() {
    document.getElementById('name-input-field-add-contact').value = '';
    document.getElementById('email-input-field-add-contact').value = '';
    document.getElementById('phone-input-field-add-contact').value = '';
}

function showSlideContainer() {
    let slideContainer = document.getElementById('confirmation-field');
    slideContainer.classList.add('confirmation-field-active');
    setTimeout(function () {
        slideContainer.classList.remove('confirmation-field-active');
    }, 1500); // Die Gesamtdauer der Animation beträgt 1,5 Sekunden
}


let showFullContact = false;
let contact = [{
    'name': [],
    'email': [],
    'phone': [],
    'initials': [],
}
]

function openFullCard() {
    let showFullContact = document.getElementById('view-contact-container');
    showFullContact.classList.remove('d-none');
    showFullContact.classList.add('view-contact-container-slide-in');
}


function addContactToArray() {
    let name = document.getElementById('name-input-field-add-contact');
    let email = document.getElementById('email-input-field-add-contact');
    let phone = document.getElementById('phone-input-field-add-contact');

    let nameParts = name.value.split(" ");
    let firstLetters = nameParts.map(namePart => namePart.charAt(0));
    let initials = firstLetters.join("");


    contact[0]['name'].push(name.value);
    contact[0]['email'].push(email.value);
    contact[0]['phone'].push(phone.value);
    contact[0]['initials'].push(initials);

    addContactToList();
}

function addContactToList() {
    let listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';

    for (let i = 0; i < contact[0]['name'].length; i++) {
        let name = contact[0]['name'][i];
        let email = contact[0]['email'][i];
        let initials = contact[0]['initials'][i];

        listContainer.innerHTML += createHtmlTemplateForList(name, email, initials);
    }
}

function createHtmlTemplateForList(name, email, initials) {
    return `
        <li class="contact-in-list" onclick="openFullCard()">
            <div class="name-initials">${initials}</div>
            <div>
                <div>${name}</div>
                <div>${email}</div>
            </div>
        </li>`
}















function addContacts() {
    createContactsIfNotCreated();
    pushValuesToContacts();
    postData();
}

function createContactsIfNotCreated() {
    if (!contacts) {
        contacts = []; 
    }
}

function pushValuesToContacts() {
    let { name, email, phone, initials } = getValuesFromInputAddContact();

    contacts.push({
        name: name,
        email: email,
        phone: phone,
        initials: initials,
    });
}

function getValuesFromInputAddContact() {
    let name = document.getElementById('name-input-field-add-contact').value;
    let email = document.getElementById('email-input-field-add-contact').value;
    let phone = document.getElementById('phone-input-field-add-contact').value;

    let nameParts = name.split(" ");
    let firstLetters = nameParts.map(namePart => namePart.charAt(0));
    let initials = firstLetters.join("");

    return { name, email, phone, initials };
}

// async function postData(path = "/contacts") {
//     let response = await fetch(BASE_URL + path + ".json", {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(contacts)
//     });
//     return await response.json();
// }


// async function loadTasks() {
//     try {
//         tasks = await loadData(TASKS_PATH);
//     } catch (error) {
//         console.error("Loading users error:", error);
//     }
// }







async function postData(path = "/contacts") {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contacts) // Daten im JSON-Format
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        console.log("Daten erfolgreich gesendet:", data);
    } catch (error) {
        console.error("Fehler beim Senden der Daten:", error);
    }
}