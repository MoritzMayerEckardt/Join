let linkIds = ['summary-aside', 'addtask-aside', 'board-aside', 'contacts-aside'];

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