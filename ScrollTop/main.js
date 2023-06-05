const btn =document.getElementById("button");
btn.onclick =function () {
  //window.scrollTo({top:0,behavior:"smooth"});
  $("html,body").animate({scrollTop:0},1200);
}

//Fires when user scrolls up and down
document.onscroll = function () {
  var scrollPosition = window.scrollY;
  if(scrollPosition>300) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
}