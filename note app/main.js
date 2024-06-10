
let noteContainer = document.querySelector(".noteContainer");
let addNoteForm =document.querySelector(".addNote");
let closeButton = document.querySelector(".closeButton");
let noteDetailView = document.querySelector(".noteDetailView");
let closeDetailView = document.querySelector(".closeDetailView");
let currentNote = null;
function openForm() {
    addNoteForm.style.display="flex";
}

// Utility function to create an element with classes and content
function createElement(tag, classNames = [], textContent = '') {
    const element = document.createElement(tag);
    classNames.forEach(className => element.classList.add(className));
    element.textContent = textContent;
    return element;
}

// Utility function to clear form inputs
function clearForm() {
    noteTitle.value = "";
    noteBody.value = "";
    noteType.value = "home";
    addNoteForm.style.display = "none";
}

// Utility function to set note type class
function setNoteTypeClass(element, type) {
    element.className = 'noteType'; // Reset classes
    element.classList.add(type);
}

// Function to handle note detail view
function handleDetailView(noteDiv) {
    noteDetailView.style.display = "flex";
    noteDetailView.querySelector(".title").textContent = noteDiv.querySelector('.title').textContent;
    noteDetailView.querySelector(".bodyText").textContent = noteDiv.querySelector('.bodyText').textContent;
    noteDetailView.querySelector(".noteType").textContent = noteDiv.querySelector('.noteType').textContent;
    setNoteTypeClass(noteDetailView.querySelector(".noteType"), noteDiv.querySelector('.noteType').textContent);
    noteDetailView.querySelector(".date").textContent = noteDiv.querySelector('.date').textContent;
}

// Function to handle note editing
function handleEdit(noteDiv) {
    openForm();
    noteTitle.value = noteDiv.querySelector('.title').textContent;
    noteBody.value = noteDiv.querySelector('.bodyText').textContent;
    noteType.value = noteDiv.querySelector('.noteType').textContent;
    currentNote = noteDiv;
}

// Function to create note div
function createNoteDiv(noteType, title, bodyText) {
    const noteDiv = createElement('div', ['note']);
    
    const buttonContainerDiv = createElement('div', ['buttonContainer']);
    const noteTypeDiv = createElement('div', ['noteType', noteType], noteType);
    const iconContainerDiv = createElement('div', ['iconContainer']);
    
    const detailViewIcon = createElement('i', ['far', 'fa-square']);
    detailViewIcon.addEventListener('click', () => handleDetailView(noteDiv));
    
    const editIcon = createElement('i', ['fas', 'fa-edit']);
    editIcon.addEventListener('click', () => handleEdit(noteDiv));
    
    const trashIcon = createElement('i', ['fas', 'fa-trash']);
    trashIcon.addEventListener('click', () => noteDiv.remove());
    
    iconContainerDiv.append(detailViewIcon, editIcon, trashIcon);
    buttonContainerDiv.append(noteTypeDiv, iconContainerDiv);
    
    const titleDiv = createElement('div', ['title'], title);
    const bodyTextDiv = createElement('div', ['bodyText'], bodyText);
    
    const dateDiv = createElement('div', ['date'], new Date().toLocaleDateString('en-GB').replace(/\//g, '.'));
    
    noteDiv.append(buttonContainerDiv, titleDiv, bodyTextDiv, dateDiv);
    
    return noteDiv;
}

// Main function to create or update a note
function createNote() {
    if (currentNote) {
        currentNote.querySelector('.noteType').textContent = noteType.value;
        currentNote.querySelector('.title').textContent = noteTitle.value;
        currentNote.querySelector('.bodyText').textContent = noteBody.value;
        setNoteTypeClass(currentNote.querySelector('.noteType'), noteType.value);
        currentNote = null;
    } else {
        const note = createNoteDiv(noteType.value, noteTitle.value, noteBody.value);
        noteContainer.appendChild(note);
    }
    clearForm();
}

closeButton.addEventListener("click",()=>{  
    addNoteForm.style.display="none";
});

closeDetailView.addEventListener("click",()=>{  
    noteDetailView.style.display="none";
});


