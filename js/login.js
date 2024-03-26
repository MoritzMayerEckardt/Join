async function initLogin() {
    await loadUsers();
    // setTimeout(() => {
    //     includeHTML();
    // }, 1500);
}

function loginUser() {
    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');
    let user = users.find(user => user.email == email.value && user.password == password.value);

    if(user) {
        console.log('user gefunden')
    } else{
        console.log('nichtgefunden')
    }

}
