const audio = document.getElementById("audio");
const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioContext.destination);

fileInput.addEventListener("change",(event)=> {
  const file = event.target.files[0];
  if(file) {
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.load();
  }
});

function visualize() {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  const bufferLength = analyser.frequencyBinCount;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    analyser.getByteFrequencyData(dataArray);
    const barWidth = (canvas.width/bufferLength)*0.9;
    let x = (canvas.width-barWidth*bufferLength)/2;
    const centerY = canvas.height/2;

    ctx.strokeStyle = "red";
    ctx.lineWidth =2;
    ctx.beginPath();
    ctx.moveTo(0,centerY);
    ctx.lineTo(canvas.width,centerY);
    ctx.stroke();

    for(let i=0; i<bufferLength;i++) {
      const barHeight = dataArray[i]/2;
      const r = Math.sin(0.02*i+0)*127+128;
      const g = Math.sin(0.02*i+2)*127+128;
      const b = Math.sin(0.02*i+4)*127+128;

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x,centerY-barHeight,barWidth,barHeight*2);
      x+= barWidth+0.1;
    }
    requestAnimationFrame(draw);
}
  draw();
}

audio.addEventListener("play",()=> {
  audioContext.resume();
  visualize();
});

customFileButton.addEventListener("click",()=>{
  fileInput.click();
});

fileInput.addEventListener("change",(event)=> {
  const file = event.target.files[0];
  fileName.textContent = file ? file.name : "No file selected";
});























