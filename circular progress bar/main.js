const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = radius * 2*Math.PI;
const progressText = document.getElementById("progress-text");
circle.style.strokeDasharray=`${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - percent/100*circumference;
  circle.style.strokeDashoffset = offset;
}

let progress = 0;
const targetProgress = 100;
const interval = setInterval(()=>{
  progress+=1;
  progressText.innerHTML = progress+"%";

  setProgress(progress);
  if(progress == targetProgress) clearInterval(interval);
},100);





















