/**
 * Resets the styles of priority buttons, arrows, and other related elements to their default state.
 * Called when switching between different priority buttons.
 */
function resetButtonStyles() {
    resetUrgentButton();
    resetMediumButton();
    resetArrows();
    resetLowButton();
}


/**
 * Resets the styles of the urgent priority button to its default state.
 */
function resetUrgentButton() {
    let urgentButton = document.getElementById('urgentButton');
    urgentButton.style.backgroundColor = '';
    urgentButton.style.color = '';
}


/**
 * Resets the styles of the medium priority button to its default state.
 * Also resets the associated text, arrows, and low priority button.
 */
function resetMediumButton() {
    let mediumButton = document.getElementById('mediumButton');
    let mediumButtonText = document.getElementById('mediumText');
    let prioMedium = document.getElementById('prioMedium');
    mediumButton.style.backgroundColor = '';
    mediumButton.style.color = '';
    mediumButtonText.style.fontWeight = '';
    prioMedium.style.display = '';
}


/**
 * Resets the styles of all arrows to their default state.
 */
function resetArrows() {
    let redArrow = document.getElementById('redArrow');
    let greenArrow = document.getElementById('greenArrow');
    let whiteArrow = document.getElementById('whiteArrow');
    let whiteArrowLow = document.getElementById('whiteArrowLow');
    redArrow.style.display = '';
    whiteArrow.style.display = '';
    greenArrow.style.display = '';
    whiteArrowLow.style.display = '';
}


/**
 * Resets the styles of the low priority button to its default state.
 */
function resetLowButton() {
    let lowButton = document.getElementById('lowButton');
    lowButton.style.backgroundColor = '';
    lowButton.style.color = '';
}


/**
 * Changes the background color and other styles of the priority buttons based on the button clicked.
 * @param {string} clickedButton - The ID of the clicked priority button ('urgent', 'medium', or 'low').
 */
function changeBackgroundColor(clickedButton) {
    if (clickedButton === 'urgent') {
        changeBackgroundColorRedButton();
    } else if (clickedButton === 'medium') {
        changeBackgroundColorYellowButton();
    } else if (clickedButton === 'low') {
        changeBackgroundColorGreenButton();
    }
}


/**
 * Changes the background color and other styles of the medium priority button.
 */
function changeBackgroundColorRedButton() {
    let {mediumButton, urgentButton, urgentArrow, mediumArrow, lowButton, lowArrow} = getVariablesForPriorityButtons();
    urgentButton.style.backgroundColor = 'rgba(255, 61, 0, 1)';
    urgentButton.style.color = 'white';
    urgentButton.style.fontWeight = '700';
    mediumButton.style.backgroundColor = 'white';
    mediumButton.style.color = 'black';
    mediumButton.style.fontWeight = '400';
    lowButton.style.fontWeight = '400';
    urgentArrow.setAttribute('src', './assets/img/prioUrgent.svg');
    mediumArrow.setAttribute('src', './assets/img/prio_medium.svg');
    lowButton.style.backgroundColor = 'white';
    lowButton.style.color = 'black';
    lowArrow.setAttribute('src', './assets/img/greenArrow.svg');
}


/**
 * Changes the background color and other styles of the low priority button.
 */
function changeBackgroundColorYellowButton() {
    let {mediumButton, urgentButton, urgentArrow, mediumArrow, lowButton, lowArrow} = getVariablesForPriorityButtons();
    mediumButton.style.backgroundColor = 'rgba(255, 168, 0, 1)';
    mediumButton.style.color = 'white';
    urgentButton.style.backgroundColor = 'white';
    urgentButton.style.color = 'black';
    urgentButton.style.fontWeight = '400';
    lowButton.style.fontWeight = '400';
    urgentArrow.setAttribute('src', './assets/img/redArrow.svg');
    mediumArrow.setAttribute('src', './assets/img/hypen.svg');
    lowButton.style.backgroundColor = 'white';
    lowButton.style.color = 'black';
    lowArrow.setAttribute('src', './assets/img/greenArrow.svg');
    mediumButton.style.fontWeight = '700';
}


/**
 * Changes the background color and other styles of the low priority button.
 */
function changeBackgroundColorGreenButton() {
    let {mediumButton, urgentButton, urgentArrow, mediumArrow, lowButton, lowArrow} = getVariablesForPriorityButtons();
    lowButton.style.backgroundColor = 'rgb(122, 226, 41)';
    lowButton.style.color = 'white';
    lowArrow.setAttribute('src', './assets/img/prioLow.svg');
    urgentArrow.setAttribute('src', './assets/img/redArrow.svg');
    mediumArrow.setAttribute('src', './assets/img/prio_medium.svg');
    urgentButton.style.backgroundColor = 'white';
    urgentButton.style.color = 'black';
    mediumButton.style.backgroundColor = 'white';
    mediumButton.style.color = 'black';
    urgentButton.style.fontWeight = '400';
    mediumButton.style.fontWeight = '400';
    lowButton.style.fontWeight = '700';
}


/**
 * Retrieves the HTML elements associated with the priority buttons.
 * @returns {object} - An object containing references to the priority button elements.
 */
function getVariablesForPriorityButtons() {
    let mediumButton = document.getElementById('btn-medium');
    let urgentButton = document.getElementById('btn-urgent');
    let urgentArrow = document.getElementById('img-urgent-btn');
    let mediumArrow = document.getElementById('img-medium-btn');
    let lowButton = document.getElementById('btn-low');
    let lowArrow = document.getElementById('img-low-btn');
    return {mediumButton, urgentButton, urgentArrow, mediumArrow, lowButton, lowArrow}
}
