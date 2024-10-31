let sunImage;
let planetImages = [];
let planets = [];

function preload() {
   sunImage = loadImage("sun.png");
   planetImages.push(loadImage("mercury.png"));
   planetImages.push(loadImage("venus.png"));
   planetImages.push(loadImage("earth.png"));
   planetImages.push(loadImage("mars.png"));
   planetImages.push(loadImage("jupiter.png"));
   planetImages.push(loadImage("saturn.png"));
   planetImages.push(loadImage("uranus.png"));
   planetImages.push(loadImage("neptune.png"));
}

function setup() {
  createCanvas(1000,1000);
  sun = new Planet(0,0,sunImage,80);
  planets.push(new Planet(50,0,planetImages[0],20,0.01*4.17));
  planets.push(new Planet(75,0,planetImages[1],33,0.01*1.61));
  planets.push(new Planet(110,0,planetImages[2],40,0.01*1));
  planets.push(new Planet(145,0,planetImages[3],25,0.01*0.53));
  planets.push(new Planet(200,0,planetImages[4],60,0.01*0.24));
  planets.push(new Planet(280,0,planetImages[5],90,0.01*0.12));
  planets.push(new Planet(350,0,planetImages[6],60,0.01*0.06));
  planets.push(new Planet(420,0,planetImages[7],55,0.01*0.02));
}

function draw() {
  clear();
  translate(width/2,height/2);
  sun.show();
  for(let planet of planets) {
    planet.drawOrbit();
    planet.orbit();
    planet.show();
  }
}

class Planet {
  constructor(distance,angle,img,size,speed=0) {
     this.distance = distance;
     this.angle = angle;
     this.img = img;
     this.speed = speed;
     this.size = size;
  }
  orbit() {
    this.angle += this.speed;
  }
  drawOrbit() {
    noFill();
    strokeWeight(0.5);
    stroke(174,214,214);
    ellipse(0,0,this.distance*2,this.distance*2);
  }
  show() {
    let x=this.distance*cos(this.angle);
    let y=this.distance*sin(this.angle);
    imageMode(CENTER);
    image(this.img,x,y,this.size,this.size);
  }
}



























