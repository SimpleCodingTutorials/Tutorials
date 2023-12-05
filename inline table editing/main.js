let editButtons = document.querySelectorAll(".edit");
let editableRow = null;

editButtons.forEach(function(btn){
  btn.addEventListener("click",function(){
    if(editableRow) {
      makeRowUneditable(editableRow);
    }
    let row = btn.parentNode.parentNode;
    let cells = row.querySelectorAll("td:not(:last-child)");
    row.style.backgroundColor = "#a8c7ad47";

    cells.forEach(function(cell) {
      cell.contentEditable = true;
    });
    editableRow = row;
  });
});


function makeRowUneditable(row) {
  let cells = row.querySelectorAll("td");
  cells.forEach(function(cell){
    cell.contentEditable = false;
    cell.style.backgroundColor = "";
  });
  row.style.backgroundColor = "";
}

document.addEventListener("click",function(event){
  if(editableRow && !editableRow.contains(event.target)) {
    makeRowUneditable(editableRow);
    editableRow = null;
    return;
  }
  if(editableRow && editableRow.contains(event.target) && event.target.tagName.toLowerCase()==="td" && !event.target.querySelector(".edit")) {
    Array.from(editableRow.getElementsByTagName("td")).forEach(cell=>cell.style.backgroundColor = "#a8c7ad47");
    event.target.style.backgroundColor = "white";
  }
});




























