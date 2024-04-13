/**
 * Array containing the IDs of link elements.
 * @type {string[]}
 */
let linkIds = ['summary-aside', 'addtask-aside', 'board-aside', 'contacts-aside'];


/**
 * Adds background color to the selected link element based on the selectedIndex.
 * @param {number} selectedIndex - The index of the link to be highlighted.
 * @returns {void}
 */
function addBackgroundColor(selectedIndex) {
    for (let i = 0; i < linkIds.length; i++) {
        let currentElement = document.getElementById(linkIds[i]);
        if (i === selectedIndex) {
            currentElement.classList.add('chosen-link');
        } else {
            currentElement.classList.remove('chosen-link');
        }
    }
}
