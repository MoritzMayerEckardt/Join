async function initContacts() {
    await includeHTML();
    addBackgroundColor(3);
    renderContactList()
}

// **********************OPEN AND CLOSE ADD CONTACT WINDOW**********************

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

// **********************ADD CONTACT**********************


async function addContact() {
    document.getElementById('dialog-add-contacts').classList.add('d-none');
    createContactsIfNotCreated();
    addContactToArray();
    pushValuesToContacts();
    await postData();
    clearAddContactForm();
    renderContactList();
    showConfirmation();
}

function createContactsIfNotCreated() {
    if (!contacts) {
        contacts = [];
    }
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

function clearAddContactForm() {
    document.getElementById('name-input-field-add-contact').value = '';
    document.getElementById('email-input-field-add-contact').value = '';
    document.getElementById('phone-input-field-add-contact').value = '';
}

async function renderContactList() {
    await loadContacts();
    addContactToList();
}

function addContactToList() {
    let listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let name = contact['name'];
        let email = contact['email'];
        let phone = contact['phone'];
        let initials = contact['initials'];

        listContainer.innerHTML += createHtmlTemplateForList(name, email, phone, initials);
    }
}

function createHtmlTemplateForList(name, email, phone, initials) {
    return `
        <li class="contact-in-list" onclick="openFullCard('${name}', '${email}', '${phone}', '${initials}')">
            <div class="name-initials">${initials}</div>
            <div>
                <div>${name}</div>
                <div>${email}</div>
            </div>
        </li>`
}

function showConfirmation() {
    let slideContainer = document.getElementById('confirmation-field');
    slideContainer.classList.add('confirmation-field-active');
    setTimeout(function () {
        slideContainer.classList.remove('confirmation-field-active');
    }, 1500); // Die Gesamtdauer der Animation beträgt 1,5 Sekunden
}


// **********************SHCOW ALL DATA FROM CONTACT**********************


let showFullContact = false;
let contact = [{
    'name': [],
    'email': [],
    'phone': [],
    'initials': [],
}
]

function openFullCard(name, email, phone, initials) {
    let showFullContact = document.getElementById('view-contact-container');
    showFullContact.classList.remove('d-none');
    showFullContact.classList.add('view-contact-container-slide-in');

    showDataFromCurrentContact(name, email, phone, initials);
}

function showDataFromCurrentContact(name, email, phone, initials) {
    document.getElementById('name-initials-view-contact').innerHTML = initials;
    document.getElementById('name-view-contact').innerHTML = name;
    document.getElementById('email-view-contact').innerHTML = email;
    document.getElementById('phone-noumber-view-contact').innerHTML = phone;
}

function showEditForm() {
    document.getElementById('dialog-edit-contacts').classList.remove('d-none')

}