const pixelColor=document.getElementById("pixelColor");
const canvas=document.getElementById("canvas");
const imageFile=document.getElementById("imageFile");
const ctx=canvas.getContext("2d");

 imageFile.onchange=function(){
 let file=imageFile.files[0];
 let reader= new FileReader();
 reader.readAsDataURL(file);
 reader.onload=function(){
    let img= new Image();
    img.src=reader.result;
    img.onload=function(){
        canvas.width=600;
        canvas.height=300;
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
    }
 }
}
canvas.addEventListener("click",function(e){
    let rect=canvas.getBoundingClientRect();
    let x=e.clientX-rect.left;
    let y=e.clientY-rect.top;
    let data=ctx.getImageData(x,y,1,1).data;
    let rgb=[data[0],data[1],data[2]];
    pixelColor.value=rgbToHex(data[0],data[1],data[2]);
    pixelColor.click();
    console.log((data[0]<<16).toString(16)+"   "+(data[1]).toString(16)+(data[2]).toString(16));
});
function rgbToHex(r,g,b){
    return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}
