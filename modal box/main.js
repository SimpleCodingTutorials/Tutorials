let modal = document.getElementById("myModal");
let btn = document.getElementById("openModal");
let modalBody = document.querySelector(".modal-body");
let span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
  setTimeout(() => {
    modal.style.width = "70%";
    modal.style.height = "70%";
    modal.style.top = "15%";
    modal.style.left = "15%";
    modal.style.transition = "0.3s ease";
  }, 50);
}

span.onclick = function() {
  modal.style.width = "0%";
  modal.style.height = "0%";
  modal.style.top = "0%";
  modal.style.left = "0%";
  modal.style.transition = "0.3s ease";
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

dragElement(document.getElementsByClassName("modal-header")[0]);

function dragElement(elmnt) {
  let pos1 =0,pos2=0,pos3=0,pos4=0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    modal.style.transition = "";
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e= e||window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.parentElement.style.top = (elmnt.parentElement.offsetTop - pos2) + "px";
    elmnt.parentElement.style.left = (elmnt.parentElement.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

















