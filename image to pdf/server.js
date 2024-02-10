const express = require("express");
const multer = require("multer");
const imgToPDF = require("image-to-pdf");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.static("./"));
const upload = multer({dest:"uploads/"});

app.post("/upload",upload.single("image"),(req,res)=>{
  const pages= [
    req.file.path,
  ];
  imgToPDF(pages,imgToPDF.sizes.A4)
  .pipe(fs.createWriteStream(path.join(__dirname,"output.pdf")))
  .on("finish",function(){
    res.sendStatus(200);
  });
});

app.get("/",function(req,res){
  res.sendFile(path.join(__dirname,"index.html"));
});

app.get("/download",function(req,res){
  const file = `${__dirname}/output.pdf`;
  res.download(file);
});

app.listen(3000,()=>{
  console.log("Server started on port 3000");
});























