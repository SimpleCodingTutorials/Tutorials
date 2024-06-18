let noteContainer = document.querySelector(".noteContainer");
let addNoteForm = document.querySelector(".addNote");
let closeButton = document.querySelector(".closeButton");
let noteDetailView = document.querySelector(".noteDetailView");
let closeDetailView = document.querySelector(".closeDetailView");
let currentNote = null;
const db = new Dexie("noteAppDB");
db.version(1).stores({
    notes: "++id,type,title,body,date"
});


function openForm() {
    addNoteForm.style.display = "flex";
}
 async function createNote() {
    if(currentNote) {
         const noteId = parseInt(currentNote.dataset.id);
         const updatedNote = {
            id:noteId,
            type: noteType.value,
            title:noteTitle.value,
            body: noteBody.value,
            date:currentNote.querySelector(".date").textContent
         };
         await db.notes.put(updatedNote);
        currentNote.querySelector(".noteType").textContent = noteType.value;
        currentNote.querySelector(".title").textContent = noteTitle.value;
        currentNote.querySelector(".bodyText").textContent = noteBody.value;
        setNoteTypeClass(currentNote.querySelector(".noteType"),noteType.value);
        currentNote = null;
    } else {
        const newNote = {
            type: noteType.value,
            title: noteTitle.value,
            body: noteBody.value,
            date: new Date().toLocaleDateString("en-GB").replace(/\//g,".")
        };
        const id= await db.notes.add(newNote);
        const noteDiv = createNoteDiv(noteType.value, noteTitle.value, noteBody.value,id);
        noteContainer.appendChild(noteDiv);
    }
    clearForm();
}

function setNoteTypeClass(element,type) {
    element.className = "noteType";
    element.classList.add(type);
}

function createNoteDiv(noteType,title,bodyText,id) {
    const noteDiv = createElement("div",["note"]);
    if(id) noteDiv.dataset.id = id;
    const buttonContainerDiv = createElement("div",["buttonContainer"]);
    const noteTypeDiv = createElement("div",["noteType",noteType],noteType);
    const iconContainerDiv = createElement("div",["iconContainer"]);
    const detailViewIcon = createElement("i",["far","fa-square"]);
    detailViewIcon.addEventListener("click",()=>handleDetailView(noteDiv));
    const editIcon = createElement("i",["fas","fa-edit"]);
    editIcon.addEventListener("click",()=>handleEdit(noteDiv));
    const trashIcon = createElement("i",["fas","fa-trash"]);
    trashIcon.addEventListener("click",async ()=>{
        await deleteNoteFromDB(noteDiv);
        noteDiv.remove();
    });
    iconContainerDiv.append(detailViewIcon,editIcon,trashIcon);
    buttonContainerDiv.append(noteTypeDiv,iconContainerDiv);

    const titleDiv = createElement("div",["title"],title);
    const bodyTextDiv = createElement("div",["bodyText"],bodyText);
    const dateDiv = createElement("div",["date"],new Date().toLocaleDateString("en-GB").replace(/\//g,"."));
    noteDiv.append(buttonContainerDiv,titleDiv,bodyTextDiv,dateDiv);
    return noteDiv;

}

function clearForm() {
    noteTitle.value = "";
    noteBody.value = "";
    noteType.value = "Home";
    addNoteForm.style.display = "none";
}

function createElement(tag,className = [],textContent = "") {
    const element = document.createElement(tag);
    className.forEach(className => element.classList.add(className));
    element.textContent = textContent;
    return element;
}

function handleDetailView(noteDiv) {
    noteDetailView.style.display = "flex";
    noteDetailView.querySelector(".title").textContent = noteDiv.querySelector(".title").textContent;
    noteDetailView.querySelector(".bodyText").textContent = noteDiv.querySelector(".bodyText").textContent;
    noteDetailView.querySelector(".noteType").textContent = noteDiv.querySelector(".noteType").textContent;
    setNoteTypeClass(noteDetailView.querySelector(".noteType"),noteDiv.querySelector(".noteType").textContent);
    noteDetailView.querySelector(".date").textContent = noteDiv.querySelector(".date").textContent;
}
function handleEdit(noteDiv) {
    openForm();
    noteTitle.value = noteDiv.querySelector(".title").textContent;
    noteBody.value = noteDiv.querySelector(".bodyText").textContent;
    noteType.value = noteDiv.querySelector(".noteType").textContent;
    currentNote = noteDiv;
}

closeButton.addEventListener("click",()=>{
    addNoteForm.style.display = "none";
});

closeDetailView.addEventListener("click",()=>{
    noteDetailView.style.display = "none";
});


document.addEventListener("DOMContentLoaded",async()=> {
    const notes = await db.notes.toArray();
    notes.forEach(note => {
        const noteDiv = createNoteDiv(note.type,note.title,note.body,note.id);
        noteContainer.appendChild(noteDiv);
    });
});

async function deleteNoteFromDB(noteDiv) {
    const noteId = parseInt(noteDiv.dataset.id);
    await db.notes.delete(noteId);
}



















