let acc = document.getElementsByClassName("accordion");
let i;

for (i=0;i<acc.length;i++) {
  acc[i].addEventListener("click",function(){
    let active = document.querySelector(".accordion.active");
    if(active && active !=this) {
      active.classList.remove("active");
      active.nextElementSibling.style.maxHeight = null;
    }
    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    if(panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}