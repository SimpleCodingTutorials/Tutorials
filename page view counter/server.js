let express = require("express");
let fs = require("fs");
let path = require("path");
let app = express();
let cors = require("cors");
app.use(cors());
app.use(express.static(__dirname));

function incrementCounter(file,callback) {
    fs.readFile(file,function(err,data){
        if(err) throw err;
        let count = Number(data);
        count++;
        fs.writeFile(file,count.toString(),function(err){
            if(err) throw err;
            callback(count);
        });
    });
}

app.get("/",function(req,res){
    incrementCounter("counter.txt",function(){
        res.sendFile(path.join(__dirname+"/index.html"),function(err){
            if(err) throw err;
        });
    });
});

app.get("/count",function(req,res){
    incrementCounter("counter.txt",function(count){
        res.send({count:count});
    });
});

app.listen(3000,function(){
    console.log("App listening on port 3000");
});






































