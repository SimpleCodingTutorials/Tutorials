function setup() {
  createCanvas(600,600);
  angleMode(DEGREES);
}

function draw() {
  translate(300,300);
  rotate(-90);
  let borderColor = color(22,22,22);
  let faceColor = color(50,50,50,200);
  stroke(borderColor);
  strokeWeight(40);
  noFill();
  ellipse(0,0,350,350);
  fill(faceColor);
  ellipse(0,0,390,390);
  let hr = hour();
  let mn = minute();
  let sc = second();

  let secondAngle = map(sc,0,60,0,360);
  let minuteAngle = map(mn+sc/60,0,60,0,360);
  let hourAngle = map(hr % 12+mn/60,0,12,0,360);

  drawHand(secondAngle,color(191,23,11),2,140);
  drawHand(minuteAngle,color(250,250,255),4,120);
  drawHand(hourAngle,color(57,247,197,140),10,90);

  strokeWeight(0);
  fill(255,255,255);
  ellipse(0,0,15,15);
  addNumbers();
}

function drawHand(angle,color,lineWeight,handLength) {
  push();
  rotate(angle);
  stroke(color);
  strokeWeight(lineWeight);
  line(0,0,handLength,0);
  pop();
}
function addNumbers() {
  stroke(255);
  textSize(32);
  textAlign(CENTER,CENTER);
  for(let i=1;i<=12;i++) {
    let angle = map(i,0,12,0,360);
    let x = 140*cos(angle);
    let y = 140*sin(angle);
    push();
    translate(x,y);
    rotate(90);
    text(i,0,0);
    pop();
  }
}





















