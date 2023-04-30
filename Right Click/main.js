const rightClickElement=document.getElementById("rightClickElement");
const menuBox =document.getElementById("rightClickMenu");
const menuItems = document.getElementsByClassName("item");
//Add click event to all menu items
for (var i=0;i<menuItems.length;i++) {
    menuItems[i].addEventListener("click",onItemClick);
}

rightClickElement.addEventListener("contextmenu",popMenu);
document.body.addEventListener("click",onBodyClick);

function onItemClick(){
    var itemNumber = this.getAttribute("number");
    if(itemNumber=="1"){
        hideMenu();
        rightClickElement.style.backgroundColor="cornflowerblue";
    }
    if(itemNumber=="2"){
        hideMenu();
        rightClickElement.style.backgroundColor="mediumaquamarine";
    }
    if(itemNumber=="3"){
        hideMenu();
        rightClickElement.style.backgroundColor="palevioletred";
    }
    if(itemNumber=="4"){
        hideMenu();
        rightClickElement.style.backgroundColor="lightgray";
    }
}

function onBodyClick(){
    hideMenu();
}
function hideMenu() {
    menuBox.style.display="none";
}

function popMenu(e) {
    e.preventDefault();
    menuBox.style.display="block";
    menuBox.style.top=e.pageY+"px";
    menuBox.style.left=e.pageX+"px";
}