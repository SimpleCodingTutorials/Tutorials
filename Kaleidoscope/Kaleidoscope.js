let imgBackground;
let segments = 12;
let angleStep;
let rotationSpeedBackground = 0.2;
let currentAngleBackground = 0;
let time =0;
let radius =30;
let textureRotationSpeed = 0.2;
let maxRotationAngle = 90;

function preload() {
  imgBackground = loadImage("pic.jpg");
}

function setup() {
  createCanvas(600,600,WEBGL);
  angleMode(DEGREES);
  angleStep = 360/segments;
  noStroke();
}


function draw() {
  background(0);
  let {offsetX,offsetY} = computeOffsets();
  push();
  applyBackgroundRotation();
  for(let i=0;i<segments;i++) {
    let textureRotation = computeTextureRotation(i);
    drawSegment(i,offsetX,offsetY,textureRotation);
  }
  pop();
  time+=1;
}

function computeOffsets() {
  let offsetX = cos(time)*radius;
  let offsetY = sin(time)*radius;
  return {offsetX,offsetY};
}

function computeTextureRotation(i) {
  return (i%2 === 0 ? 1:-1) * maxRotationAngle * abs(sin(time*textureRotationSpeed));
}

function applyBackgroundRotation() {
  rotate(currentAngleBackground);
  currentAngleBackground +=rotationSpeedBackground;
}

function drawSegment(i,offsetX,offsetY,textureRotation) {
    push();
    rotate(i*angleStep);
    beginShape();
    texture(imgBackground);
    vertex(0,0,imgBackground.width/2+offsetX,imgBackground.height/2+offsetY);
    vertex(width/2*cos(-angleStep/2),height/2*sin(-angleStep/2),cos(textureRotation)*imgBackground.width,0);
    vertex(width/2*cos(angleStep/2),height/2*sin(angleStep/2),imgBackground.width,imgBackground.height*cos(textureRotation));
  endShape(CLOSE);
  pop();
}



























