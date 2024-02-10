document.getElementById("upload-form").addEventListener("submit",function(event){
  event.preventDefault();
  let formData = new FormData();
  formData.append("image",document.getElementById("upload").files[0]);

  fetch("/upload",{
    method: "POST",
    body:formData
  })
  .then(function(response){
    if(response.ok) {
      document.getElementById("download-link").innerHTML=`<a href="/download">Download PDF</a>`;
    } else {
      console.log("Upload failed");
    }
  });
});

document.getElementById("upload").addEventListener("change",function(){
  document.getElementById("file-name").textContent = this.files[0].name;
});







