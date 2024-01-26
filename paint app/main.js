let startX,startY;
let prevX,prevY;
let drawing = false;
let pg;
let currentShape;
let mode ="line";
let backgroundColor = 300;
let currentColor = 0;

function setup() {
  let canvasWidth = canvasContainer.offsetWidth;
  let canvasHeight = canvasContainer.offsetHeight;
  let myCanvas = createCanvas(canvasWidth,canvasHeight);
  myCanvas.parent("canvasContainer");
  pg = createGraphics(canvasWidth,canvasHeight);
  currentShape = new Shape(mode);
}

function draw() {
  background(backgroundColor);
  image(pg,0,0);
  if(drawing) {
    currentShape.draw(mouseX,mouseY);
  }
  if(mode==="eraser") {
    cursor("eraser.png");
    return;
  }
  if(mode==="line" || mode==="triangle" || mode==="rectangle" || mode==="ellipse" ) {
    cursor(CROSS);
    return;
  }
  if(mode==="free") {
    cursor("pencil.png");
    return;
  }
  if(mode==="fill") {
    cursor("paint.png");
    return;
  }
  cursor("default");
}

function mousePressed() {
  startX = mouseX;
  startY = mouseY;
  prevX = mouseX;
  prevY = mouseY;
  drawing = true;
  if(mode === "fill") {
    pg.loadPixels();
    let targetColor = pg.get(mouseX,mouseY);
    floodFill(mouseX,mouseY,targetColor);
    pg.updatePixels();
  }
}

function mouseReleased () {
  drawing = false;
  currentShape.finalize(mouseX,mouseY);
}

function Shape(type) {
  this.type=type;
  this.draw = function(x,y) {
    let w = x - startX;
    let h = y - startY;
    if(fillShape.checked) {
      fill(currentColor);
    }
    if(!fillShape.checked) {
      noFill();
    }
    stroke(currentColor);
    strokeWeight(lineWeight.value);
    if(this.type === "ellipse") {
      ellipse(startX+w/2,startY+h/2,abs(w),abs(h));
      return
    }
    if(this.type === "rectangle") {
      rect(startX,startY,w,h);
      return
    }
    if(this.type === "triangle") {
      triangle(startX+w/2,startY,startX,startY+h,startX+w,startY+h);
      return
    }
    if(this.type === "line") {
      line(startX,startY,x,y);
      return
    }
    if(this.type === "free") {
      pg.line(mouseX,mouseY,prevX,prevY);
      prevX = x;
      prevY = y;
      return
    }
    if(this.type === "eraser") {
      pg.stroke(backgroundColor);
      pg.line(mouseX,mouseY,prevX,prevY);
      pg.strokeWeight(lineWeight.value);
      pg.stroke(currentColor);
      prevX = x;
      prevY = y;
      return
    }
  }
  this.finalize = function(x,y) {
    if(fillShape.checked) {
      pg.fill(currentColor);
    }
    if(!fillShape.checked) {
      pg.noFill();
    }
    if(this.type === "ellipse") {
      let w = x-startX;
      let h = y-startY;
      pg.ellipse(startX+w/2,startY+h/2,abs(w),abs(h));
      return;
    }
    if(this.type === "rectangle") {
      pg.rect(startX,startY,x-startX,y-startY);
      return;
    }
    if(this.type === "triangle") {
      pg.triangle(startX+(x-startX)/2,startY,startX,y,x,y);
      return;
    }
    if(this.type === "line") {
      pg.line(startX,startY,x,y);
      return;
    }
  }
}

save.addEventListener("click",function(){
  saveCanvas("myCanvas","png");
});
clearCanvas.addEventListener("click",function(){
  clear();
  pg.clear();
});
ellipse.addEventListener("click",function(){
  mode = "ellipse";
  currentShape = new Shape("ellipse");
});
rectangle.addEventListener("click",function(){
  mode = "rectangle";
  currentShape = new Shape("rectangle");
});

triangle.addEventListener("click",function(){
  mode = "triangle";
  currentShape = new Shape("triangle");
 });
 line.addEventListener("click",function(){
  mode = "line";
  currentShape = new Shape("line");
 });
 pen.addEventListener("click",function(){
  mode = "free";
  currentShape = new Shape("free");
 });
 eraser.addEventListener("click",function(){
  mode = "eraser";
  currentShape = new Shape("eraser");
 });
 changeColor.addEventListener("click",function(){
   colorPicker.click();
 });

 colorPicker.addEventListener("input",function(){
  selectedColor.style.backgroundColor = colorPicker.value;
  let c = color(colorPicker.value);
  let r = red(c);
  let g= green(c);
  let b = blue(c);
  currentColor = color(r,g,b);
  pg.stroke(currentColor);
 });
 bucket.addEventListener("click",function(){
  mode = "fill";
  currentShape = new Shape("fill");
});
 lineWeight.addEventListener("change",function(){
   pg.strokeWeight(lineWeight.value);
 });

 let elements = document.querySelectorAll(".interactiveToolIcon");
 elements.forEach((element)=>{
  element.addEventListener("click",function(){
    elements.forEach((el)=>{
      el.classList.remove("active");
    });
    this.classList.add("active");
  });
 });
    
let directions =[
  [-1,0],
  [1,0],
  [0,-1],
  [0,1]
];

function floodFill(x,y,colour) {
   let stack = [{x:Math.round(x),y:Math.round(y),colour}];
   pg.set(Math.round(x),Math.round(y),currentColor);
   let checked = Array(width).fill().map(()=>Array(height).fill(false));

   while (stack.length>0) {
    let current = stack.pop();
    if(current.x<0 || current.x>=width || current.y<0 || current.y>=height)
     continue;
    if(checked[current.x][current.y]) continue;
    checked[current.x][current.y] = true;

    for (let i=0; i<directions.length;i++) {
      let child = {
        x: Math.round(current.x+directions[i][0]),
        y: Math.round(current.y+directions[i][1]),
        colour
      };
      if(isValidPixel(child.x,child.y,child.colour)&& !checked[child.x][child.y]) {
        pg.set(child.x,child.y,currentColor);
        pg.set(child.x+1,child.y,currentColor);
        pg.set(child.x,child.y+1,currentColor);
        pg.set(child.x-1,child.y,currentColor);
        pg.set(child.x,child.y-1,currentColor);
        pg.set(child.x+1,child.y+1,currentColor);
        pg.set(child.x-1,child.y-1,currentColor);
        pg.set(child.x+1,child.y-1,currentColor);
        pg.set(child.x-1,child.y+1,currentColor);
        stack.push(child);
      }
    }
   }
}

function isValidPixel(x,y,colour) {
  return (x>=0 && y>=0 && x<width && y<height && colorsMatch(pg.get(x,y),colour));
}

function colorsMatch(c1,c2) {
  return(
    c1[0] ===c2[0] && c1[1] ===c2[1] && c1[2] ===c2[2] && c1[3] ===c2[3] 
  );
}


























