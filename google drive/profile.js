const token=localStorage.getItem("accessToken");
if(token) {
  listFiles(token);
} else {
  document.getElementById("file-list").textContent="No access token found.";
}

function listFiles(accessToken) {
  fetch("https://www.googleapis.com/drive/v3/files?fields=files(id,name,modifiedTime)",{
    headers:{
      Authorization: `Bearer ${accessToken}`
    }
  })
  .then(response=>response.json())
  .then(data=>{
    const tbody = document.querySelector("#fileTable tbody");
    tbody.innerHTML = "";
    if(data.files && data.files.length>0) {
      data.files.forEach(file => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = file.name;
        row.appendChild(nameCell);
        const lastModifiedCell = document.createElement("td");

        if(file.modifiedTime) {
          const lastModifiedDate = new Date(file.modifiedTime);

          if(isNaN(lastModifiedDate)) {
            lastModifiedCell.textContent = "Invalid date";
          } else {
            lastModifiedCell.textContent = lastModifiedDate.toLocaleString();
          }
        } else {
          lastModifiedCell.textContent = "No date available";
        }
        row.appendChild(lastModifiedCell);

        const downloadCell = document.createElement("td");
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";
        downloadButton.onclick = () => downloadFile(file.id);
        downloadCell.appendChild(downloadButton);
        row.appendChild(downloadCell);

        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteFile(file.id);
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
        
        tbody.appendChild(row);
      });
    }  else {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan =4;
      cell.textContent = "No Files found.";
      row.appendChild(cell);
      tbody.appendChild(row);
    }
  });
}

fileInput.addEventListener("change",()=>{
  selectedFile.style.display = "flex";
  uploadStatus.style.display = "none";
  selectedFile.textContent = fileInput.files[0]
  ? fileInput.files[0].name
  : "No file selected";
});

function uploadFile() {
  const file = fileInput.files[0];
  const token = localStorage.getItem("accessToken");
  if(!file || !token) {
    uploadStatus.textContent = "Missing file or token";
    return;
  }
  const metadata = {
    name: file.name,
    mimeType: file.type
  };
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)],{type:"application/json"}));
  form.append("file",file);

  fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{
    method: "POST",
    headers: new Headers({Authorization:`Bearer ${token}`}),
    body: form,
  })
  .then(res=>res.json())
  .then(data => {
    uploadStatus.style.display = "flex";
    uploadStatus.textContent = `Uploaded: ${data.name}`;
    selectedFile.style.display = "none";
    listFiles(token);
  })
  .catch(err=> {
    console.error(err);
    uploadStatus.textContent = "Upload failed.";
  });
}

function downloadFile(fileId) {
  const token = localStorage.getItem("accessToken");
  if(!token) {
    alert("No access token found.");
    return;
  }

  fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,{
    method: "GET",
    headers: new Headers({Authorization: `Bearer ${token}`})
  })
  .then(response => response.blob())
  .then(blob=>{
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "download-file";
    link.click();
    URL.revokeObjectURL(url);
  })
  .catch(err=>{
    alert("Download failed.");
  });
}

function deleteFile(fileId) {
  const token = localStorage.getItem("accessToken");

  if(!fileId || !token) {
    console.error("Missing file ID or token.");
    return;
  }

  fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`,{
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  .then(response => {
    if(response.ok) {
      alert("File deleted successfully.");
      listFiles(token);
    } else {
      console.error("Failed to delete file");
      alert("Failed to delete file.");
    }
  })
  .catch(error => {
    console.error("Error deleting file:",error);
    alert("Error deleting file.");
  });
}

function signOut() {
  google.accounts.id.disableAutoSelect();
  localStorage.removeItem("accessToken");
  window.location.href = "/";
}






















