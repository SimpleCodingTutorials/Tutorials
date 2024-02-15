const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(__dirname));
app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
});

app.listen(3000,()=> {
  console.log("Server is running on http://localhost:3000");
});




















// Configure cloudinary with your credentials
// cloudinary.config({
//   cloud_name: 'dytr6nrro',
//   api_key: '637247819339699',
//   api_secret: 'mcjK3LfiArFXqRMIMrSs27EUC98'
//fw0ceel0
// });
