const magnifiedImageContainer = document.querySelector(".magnifiedImage");
const thumbnailImage = document.querySelector(".thumbnailImage");
let thumbnailRectangle = thumbnailImage.getBoundingClientRect();
let magnifiedImageRect = magnifiedImageContainer.getBoundingClientRect();

thumbnailImage.addEventListener("mousemove",onMouseMove);
thumbnailImage.addEventListener("mouseout",onMouseOut);
thumbnailImage.addEventListener("mouseenter",onMouseEnter);

let magnifiedImage;
function onMouseEnter() {
  let imgElement = this.querySelector("img");
  magnifiedImage = document.createElement("img");
  magnifiedImage.src = imgElement.src;
  while (magnifiedImageContainer.firstChild) {
    magnifiedImageContainer.removeChild(magnifiedImageContainer.firstChild);
  }
  magnifiedImageContainer.appendChild(magnifiedImage);
}


function onMouseMove (event) {
  let magnifierWidth = (magnifiedImageRect.width/magnifiedImage.width)*thumbnailRectangle.width;
  let magnifierHeight = (magnifiedImageRect.height/magnifiedImage.height)*thumbnailRectangle.height;

  magnifier.style.width = magnifierWidth +"px";
  magnifier.style.height = magnifierHeight +"px";
  magnifier.style.left = thumbnailRectangle.left +"px";
  magnifier.style.top = thumbnailRectangle.top +"px";

  magnifiedImageContainer.style.visibility = "visible";
  magnifier.style.visibility = "visible";

  const mouseX = event.clientX-thumbnailRectangle.left;
  const mouseY = event.clientY-thumbnailRectangle.top;
  let xPercent = (mouseX/thumbnailRectangle.width)*100;
  let yPercent = (mouseY/thumbnailRectangle.height)*100;

  let magnifierBoundaryX = 0.5 * (magnifierWidth/thumbnailRectangle.width)*100;
  let magnifierBoundaryY = 0.5 * (magnifierHeight/thumbnailRectangle.height)*100;

  xPercent = Math.min(Math.max(0,(xPercent-magnifierBoundaryX)/(100-2*magnifierBoundaryX)*100),100);
  yPercent = Math.min(Math.max(0,(yPercent-magnifierBoundaryY)/(100-2*magnifierBoundaryY)*100),100);

  magnifier.style.left=Math.min(Math.max(thumbnailRectangle.left,event.clientX-magnifierWidth/2),thumbnailRectangle.left+thumbnailRectangle.width-magnifierWidth)+"px";

  magnifier.style.top=Math.min(Math.max(thumbnailRectangle.top,event.clientY-magnifierHeight/2),thumbnailRectangle.top+thumbnailRectangle.height-magnifierHeight)+"px";

  const translateX = (xPercent/100)*(magnifiedImage.offsetWidth-magnifiedImageRect.width);
  const translateY = (yPercent/100)*(magnifiedImage.offsetHeight-magnifiedImageRect.height);

  magnifiedImage.style.transform=`translate(${-translateX}px,${-translateY}px)`;
}

function onMouseOut() {
  magnifiedImageContainer.style.visibility="hidden";
  magnifier.style.visibility="hidden";
}

































