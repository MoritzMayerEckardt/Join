function openSmallMenu() {
    let smallMenu = document.getElementById('smallMenu');

    if (!smallMenuOpen) {
        smallMenu.style.display = 'flex';
        smallMenuOpen = true;
    } else {
        smallMenu.style.display = 'none';
        smallMenuOpen = false;
    }
}

document.addEventListener('click', function (event) {
    let smallMenu = document.getElementById('smallMenu');
    let smallMenuBtn = document.getElementById('userInitials')
    let targetElement = event.target; 
    if (targetElement !== smallMenuOpen && targetElement !== smallMenuBtn) {
        smallMenu.style.display = 'none';
        smallMenuOpen = false;
    }
});

async function showCurrentUserInButtonMobile() {
    let button = document.getElementById('user-initials-mobile');
    let currentUserInitials;
    if (currentUserIndex == 'guestLogin') {
        currentUserInitials = guest['initials']
    } else {
        currentUserInitials = users[currentUserIndex]['initials'];
    }
    button.innerHTML = currentUserInitials;
}

function openSmallMenuMobile() {
    let smallMenuMobile = document.getElementById('small-menu-mobile');
    if (!smallMenuMobileOpen) {
        smallMenuMobile.style.display = 'flex';
        smallMenuMobileOpen = true;
    } else {
        smallMenuMobile.style.display = 'none';
        smallMenuMobileOpen = false;
    }
}

document.addEventListener('click', function (event) {
    let smallMenuMobile = document.getElementById('small-menu-mobile');
    let smallMenuBtnMobile = document.getElementById('user-initials-mobile')
    let targetElement = event.target; 
    if (targetElement !== smallMenuMobileOpen && targetElement !== smallMenuBtnMobile) {
        smallMenuMobile.style.display = 'none';
        smallMenuBtnMobile = false;
    }
});