let totalNumberOfPages =0;
$(document).ready(function(){
  const source = new EventSource("/pdf-to-img");
  source.addEventListener("generatedpages",function(event){
    $("#pageNumber").html(event.data);
  });
  source.addEventListener ("totalpages",function(event){
    totalNumberOfPages = parseInt(event.data);
    source.close();
    generatePages();
  });
})

function generatePages() {
  $("#message").css("display","none");
  for (let i = 1; i <= totalNumberOfPages; i++) {
    $('#flipbook').append(`<div class="page" style="background-image:url(http://localhost:3000/images/page${i}.png);"></div>`);
  }
  $("#flipbook").turn({
    display:"double",
    acceleration: true,
  });
}

$(window).bind("keydown",function(e){
  if(e.keyCode == 37) {
     $("#flipbook").turn("previous");
  } else  if(e.keyCode == 39) {
    $("#flipbook").turn("next");
  }
});




























