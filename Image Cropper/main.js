const imageContainer =document.querySelector(".imageContainer");
let isDragging=false;
let startX,startY;
let selection=null;
const myCanvas = document.getElementById("myCanvas");
const context = myCanvas.getContext("2d");

const image = document.querySelector(".imageContainer img");
let imageRect = image.getBoundingClientRect();
let imageX =imageRect.left;
let imageY =imageRect.top;
let imageWidth = imageRect.width;
let imageHeight = imageRect.height;

image.setAttribute("draggable",false);

window.addEventListener("resize",()=>{
  imageRect = image.getBoundingClientRect();
  imageX =imageRect.left;
  imageY =imageRect.top;
  imageWidth = imageRect.width;
  imageHeight = imageRect.height;

});

addSelectionBox(imageContainer);

function addSelectionBox(element) {
  element.addEventListener("mousedown",(event)=>{
    if(selection){
      element.removeChild(selection);
      selection=null;
    }
    isDragging=true;
    startX = event.clientX;
    startY = event.clientY;

    selection = document.createElement("div");
    selection.style.position = "absolute";
    selection.style.left = `${startX}px`;
    selection.style.top = `${startY}px`;
    selection.style.with = "0px";
    selection.style.height = "0px";

    element.appendChild(selection);
  });

  element.addEventListener("mousemove",(event)=>{
    if(isDragging) {
      const currentX = event.clientX;
      const currentY = event.clientY;
      const width = Math.abs(currentX-startX);
      const height = Math.abs(currentY-startY);
      const left = Math.min(startX-imageX,currentX-imageX);
      const top = Math.min(startY-imageY,currentY-imageY);

      selection.style.width = `${width}px`;
      selection.style.height = `${height}px`;
      selection.style.left = `${left}px`;
      selection.style.top = `${top}px`;
      selection.style.background ="rgba(0,241,85,0.5)";
      selection.style.border ="1px solid white";
      selection.style.borderRadius ="5px";
    }
  })

  element.addEventListener("mouseup",()=>{
    isDragging = false;

    if(selection) {
      const x = parseInt(selection.style.left);
      const y = parseInt(selection.style.top);
      const selectionWidth = parseInt(selection.style.width);
      const selectionHeight = parseInt(selection.style.height);

      let originalImage = new Image();
      originalImage.src = image.src;

      let croppedWidth = (selectionWidth/imageWidth)*originalImage.width;
      let croppedHeight = (selectionHeight/imageHeight)*originalImage.height;
      let croppedX = (x/imageWidth)*originalImage.width;
      let croppedY = (y/imageHeight)*originalImage.height;

      let canvasWidth = (croppedWidth/originalImage.width)*imageWidth;
      let canvasHeight = (croppedHeight/originalImage.height)*imageHeight;

      myCanvas.style.width = canvasWidth+"px";
      myCanvas.style.height = canvasHeight+"px";
      myCanvas.width=croppedWidth;
      myCanvas.height=croppedHeight;

      context.drawImage(originalImage,croppedX,croppedY,croppedWidth,croppedHeight,0,0,croppedWidth,croppedHeight);

    }
  });
}

  
document.getElementById("copyButton").addEventListener("click",()=>{
  myCanvas.toBlob(function(blob){
    const item = new ClipboardItem({"image/png":blob});
    navigator.clipboard.write([item]).then(()=>{
      showAlert("Selected part of image copied to clipboard!");
    });
  });
});

































function showAlert(message) {
  const alert= document.getElementById("alert");
  alert.style.display="block";
  alert.innerHTML = message;
  setTimeout(function(){
       alert.style.display="none";
  },1500);
}