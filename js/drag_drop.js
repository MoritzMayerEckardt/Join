let currentDraggedElement;

function startDragging(task) {
    currentDraggedElement = task;
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(category) {
    let task = tasks.find(task => task.id === currentDraggedElement);
    task.boardCategory = category;
    await postData(); 
    renderColumns();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}