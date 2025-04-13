let snowflakes = [];
let bgImage;

function preload() {
  bgImage = loadImage("pic.jpg");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  noStroke();
}

function draw() {
  background(bgImage);
  let newSnowflake = new Snowflake();
  snowflakes.push(newSnowflake);
  for (let i= snowflakes.length-1; i>=0; i--) {
    snowflakes[i].update();
    snowflakes[i].display();

    if(snowflakes[i].y>height) {
      snowflakes.splice(i,1);
    }
  }
}

class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = random(-50,-10);
    this.size = random(2,6);
    this.speedY = random(1,3);
    this.wind = random(-0.5,0.5);
  }
  update() {
    this.y+= this.speedY;
    this.x+= this.wind;
  }
  display() {
    fill(255);
    ellipse(this.x,this.y,this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth,windowHeight);
}























