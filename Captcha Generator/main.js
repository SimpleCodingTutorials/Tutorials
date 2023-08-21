const captchaCanvas=document.getElementById("captchaCanvas");
const imageContainer=document.getElementById("imageContainer");
const userText=document.getElementById("userText");
const checkCaptchaText=document.getElementById("checkCaptchaText");

captchaCanvas.width=250;
captchaCanvas.height=80;
let captchaText="";
const ctx=captchaCanvas.getContext("2d");

refreshText.addEventListener("click",createCaptchaImage);
readText.addEventListener("click",readCaptchaCharacters);
submit.addEventListener("click",checkCaptcha);

document.fonts.load("40px captchaFont").then(createCaptchaImage);

function createCaptchaImage() {
    ctx.fillStyle="white";
    ctx.fillRect(0,0,captchaCanvas.width,captchaCanvas.height);
    ctx.font="40px captchaFont";
    ctx.fillStyle="black";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    captchaText=generateCaptcha();
    writeToCanvas(captchaText);
    let image= canvasToImage(captchaCanvas);
    if(imageContainer.hasChildNodes())
        document.querySelector("#imageContainer > img").remove();
    imageContainer.appendChild(image);
}
function generateCaptcha() {
    const length=5;
    const charset="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha="";
    for (let i=0;i<length;i++) {
        captcha+=charset[Math.floor(Math.random()*charset.length)];
    }
    return captcha;
}
function writeToCanvas(text) {
    const x=captchaCanvas.width/3;
    const y=captchaCanvas.height/2;
    for(var i=0;i<text.length;i++){
        var charX=10+x-ctx.measureText(text).width/2+ctx.measureText(text.substring(0,i)).width;
        ctx.save();
        ctx.translate(1.5*charX,y);
        ctx.rotate(Math.sin(i)*0.1);
        ctx.fillText(text[i],0,0);
        ctx.restore();
    }
}
function canvasToImage(canvas) {
    var image = new Image();
    image.src=canvas.toDataURL("image/png");
    return image;
}

function readCaptchaCharacters() {
    let text=captchaText;
    let capital="";
    for (var i=0;i<text.length;i++){
        capital="";
        if(text[i]===text[i].toUpperCase()&&isNaN(text[i])){
            capital="capital"
        }
        let msgCapital=new SpeechSynthesisUtterance(capital);
        window.speechSynthesis.speak(msgCapital);
        let msgLetter = new SpeechSynthesisUtterance(text[i]);
        window.speechSynthesis.speak(msgLetter);

    }
}
function checkCaptcha() {
    let userEnteredText=userText.value;
    if(userEnteredText===captchaText){
        checkCaptchaText.style.color="green";
        checkCaptchaText.innerHTML="Correct!";
    }
    else {
        checkCaptchaText.style.color="red";
        checkCaptchaText.innerHTML="Try Again!";
        createCaptchaImage();
    }
}