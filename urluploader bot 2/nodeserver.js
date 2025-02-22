const express = require("express");
const fs = require("fs");
const axios = require("axios");
const {TelegramClient} = require("telegram");
const {StringSession} = require("telegram/sessions");
const readlineSync = require("readline-sync");
const path = require("path");
const { url } = require("inspector");
const { rejects } = require("assert");
require("dotenv").config();
let fileName;
let bot;
const botUsername = "@uploaderbogbot";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const phoneNumber = process.env.PHONE_NUMBER;

const sessionFile = "session.txt";
let sessionString = fs.existsSync(sessionFile) ? fs.readFileSync(sessionFile, "utf8") : "";
const stringSession = new StringSession(sessionString);
const client = new TelegramClient(stringSession,apiId,apiHash,{
  connectionRetries:5
});
async function startClient() {
  await client.start({
    phoneNumber: async ()=> phoneNumber,
    password: async () => "",
    phoneCode: async () =>
      readlineSync.question("Enter the code you received: "),
    onError: (err) => console.error(err)
  });
  bot = await client.getEntity(botUsername);
  console.log("Connected to Telegram");
  fs.writeFileSync(sessionFile,client.session.save());
}

async function downloadFile(fileUrl) {
  fileName = path.basename(new URL(fileUrl).pathname);
  const writer = fs.createWriteStream(
    path.join(__dirname, "upload", fileName),
  );
  await client.sendMessage(bot, {
    message: `Downloading file: ${fileName}`,
  });
  try {
    const response = await axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
    });
    response.data.pipe(writer);
    return new Promise((resolve,reject)=>{
      console.log(`Error downloading file: ${fileName}`);
      writer.on("finish",()=>resolve(fileName));
      writer.on("error",(err)=>{
        reject(err);
      });
    });
  } catch(err) {
    console.error("Error during axios request:", err.message);
  }
}

async function uploadFile(filePath) {
  try {
    await client.sendMessage(bot,{
      message: `Uploading file: ${fileName}`,
    });
    await client.sendFile(bot.id,{
      file: filePath,
      caption: "Here is the file from URL!",
      forceDocument: true,
      partSizeKb: 40960,
      workers:64,
      progressCallback: (progress) => {
        console.log(`Uploaded: ${Math.round(progress*100)}%`);
      },
    });
    console.log(`File ${filePath} uploaded successfully!`);
    fs.unlinkSync(filePath);
    return;
  } catch(error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file to Telegram");
  }
}

app.post("/upload",async(req,res)=>{
  const {fileUrl} = req.body;
  if(!fileUrl) {
    return res.status(400).json({error: "File URL and chat ID are required"});
  }
  try {
    await startClient();
    const filePath = await downloadFile(fileUrl);
    await uploadFile(path.join(__dirname,"upload",filePath));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({error: error.message});
  }
});

app.listen(port,()=>{
  console.log(`Server running on port ${port}`);
});






































