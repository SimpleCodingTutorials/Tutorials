const dropZone=document.getElementById("dropZone");
const fileInput=document.getElementById("fileInput");
 
dropZone.addEventListener("dragover",(e)=>{
    e.preventDefault();
});

dropZone.addEventListener("click",(e)=>{
   fileInput.click();
});

dropZone.addEventListener("drop",(e)=>{
    e.preventDefault();
    const files=e.dataTransfer.files;
    fileInput.files = files;
    fileInput.dispatchEvent(new Event("change"));
});

fileInput.addEventListener("change",function(){
    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function(e){
        myImage.src = e.target.result;
        let image = new Image();
        image.src = myImage.src;
    }
    reader.readAsDataURL(file);
})
