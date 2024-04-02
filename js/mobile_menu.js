function loadMobileMenu() {
    // Get the current page URL
    const currentPage = window.location.href;

    // Get all menu items
    const menuItems = document.querySelectorAll('.link-menu-container');

    // Check if the current page URL matches any menu item's href 
    menuItems.forEach(menuItem => {
        if (currentPage.includes(menuItem.getAttribute('href'))) {
            menuItem.classList.add('active');
        }
      });
  }