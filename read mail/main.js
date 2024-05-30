let Imap = require("node-imap");
let inspect = require("util").inspect;

let imap = new Imap({
  user:"SimpleCodingTutorials@hotmail.com",
  password: "123456",
  host: "imap-mail.outlook.com",
  port: 993,
  tls:true
});
function openInbox(cb) {
  imap.openBox("INBOX",true,cb);
}
function isPrintable(str) {
  return /^[\x20-\x7E\s]*$/.test(str);
}
imap.once("ready",function(){
  openInbox(function(err,box){
    if(err) throw err;
    let f = imap.seq.fetch(`${box.messages.total-2}:${box.messages.total}`,{
      bodies:["HEADER.FIELDS (FROM TO SUBJECT DATE)","1"],
      struct:true
    });
    f.on("message",function(msg,seqno){
      console.log(`Message #%d`,seqno);
      let prefix =`("`+seqno+`)`;
      msg.on("body",function(stream,info){
        let buffer = "";
        stream.on ("data",function(chunk){
          buffer+= chunk.toString("utf8");
        });
        stream.once("end",function(){
          if(info.which === "1") {
            let decodedBody = "";
            decodedBody = Buffer.from(buffer,"base64").toString("utf8");
            if(isPrintable(decodedBody)) {
              console.log(prefix + 'Parsed body: %s', decodedBody);
            }
            else
            console.log(prefix + 'Parsed body: %s', buffer);
          }
          else
          console.log(prefix+`Parsed header: %s`, inspect(Imap.parseHeader(buffer)));
        });
      });
    });
    f.once("error",function(err){
      console.log("Fetch error: "+err);
    });
    f.once("end",function(){
      console.log("Done fetching all messages!");
      imap.end();
    });
  });
});


imap.once("end",function(){
  console.log("Connection ended");
});

imap.connect();



























