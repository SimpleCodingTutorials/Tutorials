document.getElementById("upload").addEventListener("change",function(){
  document.getElementById("file-name").textContent=this.files[0].name;
});