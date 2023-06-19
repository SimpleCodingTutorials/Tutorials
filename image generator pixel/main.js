const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
const input=document.getElementById("imageFile");

input.onchange=function(){
  let file = input.files[0];
  let reader=new FileReader();
  reader.onload=function() {
    let img=new Image();
    img.onload=function(){
      canvas.width=600;
      canvas.height=300;
      const tempCanvas=document.createElement("canvas");
      tempCanvas.width=canvas.width;
      tempCanvas.height=canvas.height;
      const tempCtx=tempCanvas.getContext("2d");
      tempCtx.drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
      const imageData=tempCtx.getImageData(0,0,tempCanvas.width,tempCanvas.height);
      const coords=[];
      for(let y=0;y<imageData.height;y++) {
        for(let x=0;x<imageData.width;x++){
          coords.push({x:x,y:y});
        }
      }
      for (let i=coords.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [coords[i],coords[j]]=[coords[j],coords[i]];
      }
      let i=0;
      coords.forEach(coord=>{
        setTimeout(()=>{
          const index=(coord.y*imageData.width+coord.x)*4;
          const r=imageData.data[index];
          const g=imageData.data[index+1];
          const b=imageData.data[index+2];
          const a=imageData.data[index+3]/255;
          ctx.fillStyle=`rgba(${r},${g},${b},${a})`;
          ctx.fillRect(coord.x,coord.y,1,1);

        },i*0.00000001); 
        i+=1;     
      });

       };
       img.src=reader.result;
    }
    reader.readAsDataURL(file);
  }
