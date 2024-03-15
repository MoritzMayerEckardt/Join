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
    closeDialog();
}