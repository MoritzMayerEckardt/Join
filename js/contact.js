let currentIndex;
const colors = ["#1a1a1a", "#333333", "#4d4d4d", "#666666", "#808080", "#999999", "#b3b3b3", "#cccccc", "#e6e6e6", "#1a1a8d", "#3333a1", "#4d4db5", "#6666c8", "#8080dc", "#9999f0", "#b3b3f4", "#ccccf8", "#e6e6fc", "#ffffff"];

async function initContacts() {
    await includeHTML();
    await loadUsers();
    await loadCurrentUserIndex()
    await loadGuestLogin();
    addBackgroundColor(3);
    renderContactList();
    loadMobileMenu();
    showCurrentUserInButton();
    showCurrentUserInButtonMobile();
}


// **********************OPEN AND CLOSE ADD CONTACT WINDOW**********************

function openDialogAddContacts() {
    let dialog = document.getElementById('dialog-add-contacts');
    let dialogMobile = document.getElementById('dialog-add-contacts-mobile');
    dialog.classList.remove('d-none');
    dialogMobile.classList.remove('d-none')
    dialog.style.animation = 'slideInFromRight 0.250s ease-in-out';
    dialog.style.right = '0';
}


function closeAddContactDialog() {
    dialog = document.getElementById('dialog-add-contacts');
    dialogMobile = document.getElementById('dialog-add-contacts-mobile');
    dialog.style.animation = 'slideOutToRight 0.250s ease-in-out';
    dialog.style.right = '-200%';
    setTimeout(() => {
        dialog.classList.add('d-none');
    }, 250);

    dialogMobile.classList.add('d-none')
}


function doNotClose(event) {
    event.stopPropagation();
}


// **********************ADD CONTACT**********************

async function addContact() {
    createContactsIfNotCreated();
    pushValuesToContacts();
    await postData(`${CONTACTS_PATH}`);
    clearAddContactForm();
    renderContactList();
    document.getElementById('dialog-add-contacts').classList.add('d-none');
    document.getElementById('dialog-add-contacts-mobile').classList.add('d-none');
    showConfirmation();
}


function createContactsIfNotCreated() {
    if (!contacts) {
        contacts = [];
    }
}


function pushValuesToContacts() {
    let { name, email, phone, initials } = getValuesFromInputAddContact();
    let randomIndex = getRandomIndexFromColors();
    let color = colors[randomIndex];
    contacts.push({
        name: name,
        email: email,
        phone: phone,
        initials: initials,
        color: color,
    });
}


function getRandomIndexFromColors() {
    return Math.floor(Math.random() * colors.length);
}


function getValuesFromInputAddContact() {
    let { name, email, phone } = getInputElementsForContact();
    let initials = getInitialsFromName(name);
    return { name, email, phone, initials };
}


function getInputElementsForContact() {
    if (window.innerWidth > 1130) {
        return {
            name: document.getElementById('name-input-field-add-contact').value,
            email: document.getElementById('email-input-field-add-contact').value,
            phone: document.getElementById('phone-input-field-add-contact').value
        };
    } else {
        return {
            name: document.getElementById('name-input-field-add-contact-mobile').value,
            email: document.getElementById('email-input-field-add-contact-mobile').value,
            phone: document.getElementById('phone-input-field-add-contact-mobile').value
        };
    }
}


function getInitialsFromName(name) {
    let nameParts = name.split(" ");
    let firstLetters = nameParts.map(namePart => namePart.charAt(0));
    return firstLetters.join("");
}


async function postData(path) {
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
    document.getElementById('name-input-field-add-contact-mobile').value = '';
    document.getElementById('email-input-field-add-contact-mobile').value = '';
    document.getElementById('phone-input-field-add-contact-mobile').value = '';
}


async function renderContactList() {
    await loadContacts();
    if (Array.isArray(contacts) && contacts.length > 0) {
        contacts.sort(sortList);
        addContactToList();
    }
    else {
        document.getElementById('list-container').innerHTML = '';
    }
}


function sortList(a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}

function addContactToList() {
    let listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';

    let currentLetter = null;

    for (let i = 0; i < contacts.length; i++) {
        let { name, email, phone, initials, color, index, firstLetter } = getContactDetails(contacts[i], i);

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            addLetterHeaderToContainer(listContainer, currentLetter);
        }

        listContainer.innerHTML += createHtmlTemplateForList(name, email, phone, initials, index);

        setInitialsBackgroundColor(index, color);
    }
}


function getContactDetails(contact, index) {
    let name = contact['name'];
    let email = contact['email'];
    let phone = contact['phone'];
    let initials = contact['initials'];
    let color = contact['color'];
    let firstLetter = name.charAt(0).toUpperCase();

    return { name, email, phone, initials, color, index, firstLetter };
}


function setInitialsBackgroundColor(index, color) {
    let initialsContainer = document.getElementById(`name-initials${index}`);
    if (initialsContainer) {
        initialsContainer.style.backgroundColor = color;
    }
}


function setInitialsBackgroundColor(index, color) {
    let initialsContainer = document.getElementById(`name-initials${index}`);
    if (initialsContainer) {
        initialsContainer.style.backgroundColor = color;
    }
}


function addLetterHeaderToContainer(container, letter) {
    container.innerHTML += `<div class="contact-letter">${letter}</div>`;
}


function createHtmlTemplateForList(name, email, phone, initials, index) {
    return `
        <li class="contact-in-list" id="contact-in-list${index}" onclick="openFullCard('${name}', '${email}', '${phone}', '${initials}', ${index})">
            <div class="name-initials" id="name-initials${index}">${initials}</div>
            <div>
                <div>${name}</div>
                <div class="email-in-Contact-list">${email}</div>
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

function openFullCard(name, email, phone, initials, index) {
    let showFullContact = document.getElementById('view-contact-container');
    let allContactElements = document.querySelectorAll('.contact-in-list');
    showFullContact.classList.remove('d-none');
    showFullContact.classList.add('view-contact-container-slide-in');
    currentIndex = index;
    allContactElements.forEach(function (contactElement) {
        contactElement.classList.remove('contactActive');
    });
    document.getElementById(`contact-in-list${index}`).classList.add('contactActive');
    showDataFromCurrentContact(name, email, phone, initials, index);
    showFullContactMobile();
}


function showDataFromCurrentContact(name, email, phone, initials, index) {
    document.getElementById('name-initials-view-contact').innerHTML = initials;
    document.getElementById('name-view-contact').innerHTML = name;
    document.getElementById('email-view-contact').innerHTML = email;
    document.getElementById('phone-noumber-view-contact').innerHTML = phone;
    let color = contacts[index]['color'];
    let bgColorInitials = document.getElementById('name-initials-container-view-contact');
    bgColorInitials.style.backgroundColor = color;
}


function openDialogAddContacts() {
    let dialog = document.getElementById('dialog-add-contacts');
    let dialogMobile = document.getElementById('dialog-add-contacts-mobile');
    dialog.classList.remove('d-none');
    dialogMobile.classList.remove('d-none')
    dialog.style.animation = 'slideInFromRight 0.250s ease-in-out';
    dialog.style.right = '0';
}


// function showEditForm() {
//     showEditFormDesktop();
//     showEditFormMobile();

//     let initials = document.getElementById('name-initials-view-contact').innerHTML;
//     let name = document.getElementById('name-view-contact').innerHTML;
//     let email = document.getElementById('email-view-contact').innerHTML;
//     let phone = document.getElementById('phone-noumber-view-contact').innerHTML;
//     let color = document.getElementById('name-initials-container-view-contact').style.backgroundColor;


//     document.getElementById('initals-field-edit-contact').innerHTML = initials;
//     document.getElementById('name-input-field-edit-contact').value = name;
//     document.getElementById('email-input-field-edit-contact').value = email;
//     document.getElementById('phone-input-field-edit-contact').value = phone;

//     document.getElementById('name-input-field-edit-contact-mobile').value = name;
//     document.getElementById('email-input-field-edit-contact-mobile').value = email;
//     document.getElementById('phone-input-field-edit-contact-mobile').value = phone;


//     document.getElementById('initals-field-edit-contact').style.backgroundColor = color;


//     dialog.style.animation = 'slideInFromRight 0.250s ease-in-out';
// }

function showEditForm() {
    showEditFormDesktop();
    showEditFormMobile();
    let initials = document.getElementById('name-initials-view-contact').innerHTML;
    let name = document.getElementById('name-view-contact').innerHTML;
    let email = document.getElementById('email-view-contact').innerHTML;
    let phone = document.getElementById('phone-noumber-view-contact').innerHTML;
    fillEditFormFields(initials, name, email, phone);
    document.getElementById('dialog-edit-contacts').style.animation = 'slideInFromRight 0.250s ease-in-out';
}


function showEditFormDesktop() {
    let dialog = document.getElementById('dialog-edit-contacts');
    dialog.classList.remove('d-none');
    dialog.style.animation = 'slideInFromRight 0.250s ease-in-out';
    dialog.style.right = '0';
}


function showEditFormMobile() {
    let dialogMobile = document.getElementById('dialog-edit-contacts-mobile');
    dialogMobile.classList.remove('d-none');

}


function fillEditFormFields(initials, name, email, phone) {
    document.getElementById('initals-field-edit-contact').innerHTML = initials;
    document.getElementById('name-input-field-edit-contact').value = name;
    document.getElementById('email-input-field-edit-contact').value = email;
    document.getElementById('phone-input-field-edit-contact').value = phone;

    // Mobile Ansicht
    document.getElementById('name-input-field-edit-contact-mobile').value = name;
    document.getElementById('email-input-field-edit-contact-mobile').value = email;
    document.getElementById('phone-input-field-edit-contact-mobile').value = phone;

    let color = document.getElementById('name-initials-container-view-contact').style.backgroundColor;
    document.getElementById('initals-field-edit-contact').style.backgroundColor = color;
}



// **********************OPEN EDIT MENU MOBILE**********************

function showEditMenuMobile() {
    document.getElementById('edit-menu-mobile-contacts').classList.remove('d-none');
}


function closeEditMenuMobile() {
    document.getElementById('edit-menu-mobile-contacts').classList.add('d-none');
}


// **********************OPEN AND CLOSE EDIT CONTACT WINDOW**********************

function closeEditContactDialog() {
    let dialog = document.getElementById('dialog-edit-contacts');
    let dialogMobile = document.getElementById('dialog-edit-contacts-mobile');
    dialog.style.animation = 'slideOutToRight 0.250s ease-in-out';
    dialog.style.right = '-200%';
    setTimeout(() => {
        dialog.classList.add('d-none');
    }, 250);
    dialogMobile.classList.add('d-none');
}


async function deleteContact() {
    contacts.splice(currentIndex, 1);
    await postData(`${CONTACTS_PATH}`);
    renderContactList();
    closeEditContactDialog();
    clearEditContact();
}


async function deleteContactMobile() {
    await deleteContact();
    closeContactMobile();
    closeEditMenuMobile();
}


function clearEditContact() {
    let showFullContact = document.getElementById('view-contact-container');
    showFullContact.classList.add('d-none');
}


async function saveEditContact() {
    let contactToEdit = contacts[currentIndex];
    
    let { name, email, phone } = getContactInfoForEdit();
    
    await editAndSaveContact(contactToEdit, name, email, phone);
    
    renderContactList();
    closeEditContactDialog();
    openFullCard(name, email, phone, contactToEdit['initials'], currentIndex);
}


function getContactInfoForEdit() {
    let name, email, phone;

    if (window.innerWidth < 1080) {
        name = document.getElementById('name-input-field-edit-contact-mobile').value;
        email = document.getElementById('email-input-field-edit-contact-mobile').value;
        phone = document.getElementById('phone-input-field-edit-contact-mobile').value;
    } else {
        name = document.getElementById('name-input-field-edit-contact').value;
        email = document.getElementById('email-input-field-edit-contact').value;
        phone = document.getElementById('phone-input-field-edit-contact').value;
    }

    return { name, email, phone };
}


function getInitialsFromName(name) {
    let nameParts = name.split(" ");
    let firstLetters = nameParts.map(namePart => namePart.charAt(0));
    return firstLetters.join("");
}


async function editAndSaveContact(contactToEdit, name, email, phone) {
    let initials = getInitialsFromName(name);

    contactToEdit['name'] = name;
    contactToEdit['email'] = email;
    contactToEdit['phone'] = phone;
    contactToEdit['initials'] = initials;

    await postData(`${CONTACTS_PATH}`);
}



function showFullContactMobile() {
    if (window.innerWidth < 1080) {
        document.getElementById('contacts-container').classList.add('d-none1080');
        document.getElementById('show-complete-contact-template').classList.remove('d-none1080');
    }
}


function closeContactMobile() {
    document.getElementById('contacts-container').classList.remove('d-none1080');
    document.getElementById('show-complete-contact-template').classList.add('d-none1080');
}