const express = require("express");
const {pdf} = require("pdf-to-img");
const fs = require("fs");
const path = require ("path");

const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get("/pdf-to-img",async(req,res)=>{
    const pdfPath = path.join(__dirname,"test.pdf");
    const imagesDir = "./images";
    fs.readdir(imagesDir,(err,files)=>{
        if(err) throw err;
        for (const file of files) {
            fs.unlink(path.join(imagesDir,file),err =>{
                if(err) throw err;
            });
        }
    }) ;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let pageNumber = 1;
    for await(const page of await pdf(pdfPath)) {
        fs.writeFileSync(`./images/page${pageNumber}.png`,page);
        res.write(`event: generatedpages\ndata: ${pageNumber}\n\n`);
        pageNumber++;
    }
    res.write(`event: totalpages\ndata: ${pageNumber}\n\n`);
    res.end();
});

app.use(`/images`,express.static(path.join(__dirname,"images")));

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});






















