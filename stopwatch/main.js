var displayScreen= document.getElementById("displayScreen");
var minute=0;
var second=0;
var centiSecond=0;
var timerInterval;

function startTimer(){
  clearInterval(timerInterval);
  timerInterval=setInterval(runTimer,10);
}

function runTimer(){
  centiSecond++;
  if(centiSecond==100) {
    centiSecond=0;
    second++;
  }
  if(second==60) {
    second=0;
    minute++;
  }
  centiSecond=("0"+centiSecond).slice(-2);
  second=("0"+second).slice(-2);
  minute=("0"+minute).slice(-2);
  displayScreen.innerHTML=minute+":"+second+":"+centiSecond;

}
function stopTimer() {
  clearInterval(timerInterval);
}
function resetTimer () {
  clearInterval(timerInterval);
  minute=0;
  second=0;
  centiSecond=0;
  displayScreen.innerHTML="00:00:00";
}