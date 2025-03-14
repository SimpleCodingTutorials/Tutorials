let arrow;
let bubble;
let bubblesGroup;
let initialBubble;
let nextBubble;
let leftWall;
let rightWall;
let topWall;
let grid = [];
const bubbleSize = 32;
const canvasHeight = 500;
const canvasWidth = 592;
let colors = ['red','pink','blue','green','yellow','purple'];

const rows =15;
const columns =17;
const filledRows = 9;
const marginX = bubbleSize;
const marginY = bubbleSize;
let currentBubbleColor = Phaser.Utils.Array.GetRandom(colors);
let nextBubbleColor = Phaser.Utils.Array.GetRandom(colors);

function preload() {
  this.load.image('red','assets/red.png');
  this.load.image('pink','assets/pink.png');
  this.load.image('blue','assets/blue.png');
  this.load.image('green','assets/green.png');
  this.load.image('yellow','assets/yellow.png');
  this.load.image('purple','assets/purple.png');
  this.load.image('arrow','assets/arrow.png');
  this.load.image('backgroundImage','assets/background.png');
  this.load.image('restartButtonImage','assets/restart.png');
  this.load.audio('bubblepop','assets/bubble.mp3');
  this.load.audio('bubbleshoot','assets/shoot.mp3');
}
function create() {
  setCanvasStyle();
  createBackground.call(this);
  createWalls.call(this);
  createRestartButton.call(this);
  createBubbleElements.call(this);
  setupInputHandlers.call(this);
  loadSounds.call(this);
}

function setCanvasStyle() {
  const canvas = document.querySelector("canvas");
  canvas.style.borderRadius= "20px";
}

function createBackground() {
  const sectionBackground = this.add.image(311,264,"backgroundImage");
  sectionBackground.setDisplaySize(599,496);
  sectionBackground.setOrigin(0.5);
}

function createWalls() {
  this.createWall = (x,y,displayWidth,displayHeight) => {
    const wall = this.add.rectangle(x,y,displayWidth,displayHeight,0x000000,0);
    this.physics.add.existing(wall,true);
    wall.body.setSize(displayWidth,displayHeight);
    return wall;
  };
  leftWall = this.createWall(20,510,10,1000);
  rightWall = this.createWall(600,510,10,1000);
  topWall = this.createWall(295,11,575,10);
}

function createRestartButton() {
  const restartButton = this.add.image(675,60,"restartButtonImage").setInteractive();
  restartButton.on("pointerdown",()=>{
    this.scene.restart();
    grid = [];
  });

  restartButton.on("pointerover",()=> this.input.setDefaultCursor("pointer"));
  restartButton.on("pointerout",()=> this.input.setDefaultCursor("default"));
}

function createBubbleElements() {
  bubblesGroup = this.physics.add.group();
  createBubbles(this);
  arrow = this.add.image(config.width/2-50,546,"arrow").setOrigin(0.5,1).setScale(0.3);

  initialBubble = this.add.image(config.width/2-50,550-bubbleSize/2,currentBubbleColor).setOrigin(0.5,0).setAlpha(1);

  nextBubble = this.add.image(bubbleSize,550-bubbleSize/2,nextBubbleColor).setOrigin(0.5,0).setAlpha(1);

  }

function setupInputHandlers() {
  this.input.on("pointermove",(pointer)=>{
     let angle = Phaser.Math.Angle.Between(arrow.x,arrow.y,pointer.x,pointer.y)+Math.PI/2;
     arrow.setRotation(angle);
  });
  this.input.on("pointerdown",(pointer)=> {
     if(pointer.y>(rows+0.5)*bubbleSize) return;
     shootBubble.call(this);
  });
}

function loadSounds() {
  bubbleSound = this.sound.add("bubblepop");
  bubbleshoot = this.sound.add("bubbleshoot");
}

function createBubbles(scene) {
  for(let row=1;row<=rows;row++) {
    const rowArray = [];
    for(let col=1;col<=columns;col++) {
      const x = col*bubbleSize-(row%2 === 0 ? bubbleSize/2:bubbleSize)+marginX;
      const y = row*bubbleSize-bubbleSize+marginY;
      const centerX = x+bubbleSize/2;
      const centerY = y+bubbleSize/2;

      if(row<= filledRows) {
        const color = Phaser.Utils.Array.GetRandom(colors);
        const bubble = scene.physics.add.image(centerX,centerY,color);
        bubble.setOrigin(0.5,0.5);
        bubble.body.setImmovable(true);
        bubblesGroup.add(bubble);

        rowArray.push({centerX,centerY,color,bubble});
      } else {
        rowArray.push({centerX,centerY,color:"blank",bubble});
      }
    }
    grid.push(rowArray);
  }
}

function shootBubble() {
  bubbleshoot.play();
  const angle = arrow.rotation;
  const bubble = createMovingBubble.call(this,angle);
  updateNextBubbleTextures();
  this.physics.add.collider(bubble,leftWall);
  this.physics.add.collider(bubble,rightWall);
  this.physics.add.overlap(bubble,[bubblesGroup,topWall],async(movingBubble,stationaryObject)=>{
    handleBubbleCollision.call(this,movingBubble,stationaryObject);

  });
  
}

function createMovingBubble(angle) {
  const bubble = this.physics.add.image(arrow.x,arrow.y,currentBubbleColor);
  bubble.body.setCircle(bubbleSize/4);
  bubble.body.setVelocity(
    Math.cos(angle-Math.PI/2)*800,
    Math.sin(angle-Math.PI/2)*800
  );
  bubble.body.setBounce(1);
  return bubble;
}

function updateNextBubbleTextures() {
  if(colors.includes(nextBubbleColor)) {
    currentBubbleColor = nextBubbleColor;
  } else {
    currentBubbleColor = Phaser.Utils.Array.GetRandom(colors);
  }
  initialBubble.setTexture(currentBubbleColor);
  nextBubbleColor = Phaser.Utils.Array.GetRandom(colors);
  nextBubble.setTexture(nextBubbleColor);
}

async function handleBubbleCollision(movingBubble,stationaryObject) {
  const dx = movingBubble.x - stationaryObject.x;
  const dy = movingBubble.y - stationaryObject.y;
  const distance = Math.sqrt(dx*dx+dy*dy);

  if(distance>bubbleSize && stationaryObject !== topWall)
    return;

  movingBubble.body.stop();
  let closestSquare = findClosestEmptySquare(movingBubble.x,movingBubble.y);
  let snappedX = closestSquare.centerX;
  let snappedY = closestSquare.centerY;

  movingBubble.destroy();

  const snappedBubble = this.physics.add.image(snappedX,snappedY,movingBubble.texture.key);
  snappedBubble.setOrigin(0.5,0.5);
  snappedBubble.setImmovable(true);
  snappedBubble.body.setCircle(bubbleSize/2);
  bubblesGroup.add(snappedBubble);

  updateGridWithBubble(snappedX,snappedY,movingBubble.texture.key,snappedBubble);

  let connectedBalls = findConnectedBalls(snappedX,snappedY,movingBubble.texture.key);
  await removeConnectedBalls(connectedBalls,bubbleSound);
  await removeFloatingIslands();
  updateAvailableColors();

}

function findClosestEmptySquare(x,y) {
  let closestSquare = null;
  let closestDistance = Infinity;

  for(let row=0; row<grid.length; row++) {
    for (let col = 0; col<grid[row].length;col++) {
      const square = grid[row][col];
      if(square.color === "blank") {
        const distance = Math.sqrt(
          Math.pow(square.centerX-x,2) + Math.pow(square.centerY-y,2)
        );
        if(distance<closestDistance) {
          closestDistance = distance;
          closestSquare = square;
        }
      }
    }
  }
  return closestSquare;
}

function updateGridWithBubble(x,y,color,bubble) {
  const col = Math.floor(((x-marginX)- bubbleSize/2)/bubbleSize);

  const row = Math.floor(((y-marginY)-bubbleSize)/bubbleSize)+1;

  if(row >=0 && row<rows && col>=0 && col<columns) {
    grid[row][col] = {
      centerX: col*bubbleSize+bubbleSize/2+(row%2 === 0 ? 0 : bubbleSize/2)+marginX,
      centerY: row*bubbleSize+bubbleSize/2+marginY,
      color:color,
      bubble:bubble
    };
  } else {
    console.warn("Bubble us outside the grid bounds!");
  }
}

function findConnectedBalls(x,y,color) {
  const col = Math.floor(((x-marginX)-bubbleSize/2)/bubbleSize);
  const row = Math.floor(((y-marginY)-bubbleSize)/bubbleSize)+1;
  const visited = new Set();
  const connectedBalls = [];

  function isValid(row,col) {
    return row >=0 && row < rows && col >=0 && col < columns;
  }

  function dfs(r,c) {
    const key = `${r},${c}`;
    if(!isValid(r,c) || visited.has(key) || grid[r][c].color !== color) {
      return;
    }
    visited.add(key);
    connectedBalls.push({row:r,col:c, ...grid[r][c]});
    const offsets = r%2 === 0 
    ? [[-1,-1],[-1,0],[0,-1],[0,1],[1,-1],[1,0]]
    : [[-1,0],[-1,1],[0,-1],[0,1],[1,0],[1,1]];

    for(const [dr,dc] of offsets) {
      dfs(r+dr,c+dc);
    }
  }
   dfs(row,col);

   return connectedBalls.length>2 ? connectedBalls : [];
}

function removeConnectedBalls(connectedBalls, sound) {
  return new Promise((resolve)=>{
    if(connectedBalls.length === 0) {
      sound.play();
      resolve();
      return;
    }
    let delay = 0;
    let completed =0;

    connectedBalls.forEach(({row,col}) => {
      setTimeout(()=> {
        const bubble = grid[row][col].bubble;
        if(bubble) {
          sound.play();
          bubble.destroy();
        }
        grid[row][col] = {
          centerX: grid[row][col].centerX,
          centerY: grid[row][col].centerY,
          color: "blank",
          bubble: null,
        };
        completed +=1;
        if(completed === connectedBalls.length) {
          resolve();
        }
      },delay);
      delay +=80;
    });
  });
}

function removeFloatingIslands() {
  const rows = grid.length;
  const columns = grid[0].length;
  const visited = createVisitedArray(rows,columns);
  markConnectedBubbles();
  const floatingBalls = removeUnvisitedBubbles();

  function createVisitedArray(rows,columns) {
    return Array.from({length: rows},()=> Array(columns).fill(false));
  }

  function getNeighbors(row,col) {
    return [
      [row-1,col],
      [row+1,col],
      [row,col-1],
      [row,col+1],
      [row-1,col+(row%2 === 0 ? -1 : 1)],
      [row+1,col+(row%2 === 0 ? -1 : 1)],
    ];
  }
  function dfs(row,col) {
     if(
       row<0 || row >=rows ||
       col<0 || col >=columns ||
       visited[row][col] ||
       !grid[row][col].bubble 
     )return;
     visited[row][col] = true;
     for (const [neighborRow, neighborCol] of getNeighbors(row,col)) {
      dfs(neighborRow,neighborCol);
     }
  }
  function markConnectedBubbles() {
    for( let col=0; col<columns; col++) {
      if(grid[0][col].bubble && !visited[0][col]) {
        dfs(0,col);
      }
    }
  }
  function removeUnvisitedBubbles() {
    const floatingBalls = [];
    for(let row=0; row<rows; row++) {
      for(let col=0; col<columns;col++) {
        if(grid[row][col].bubble && !visited[row][col]) {
          floatingBalls.push({row,col,bubble: grid[row][col].bubble});
          grid[row][col].bubble.destroy();
          grid[row][col] = {centerX: grid[row][col].centerX,centerY: grid[row][col].centerY,color: "blank",bubble: null};
        }
      }
    }
    return floatingBalls;
  }
}

function updateAvailableColors() {
  const presentColors = new Set();
  for(let row of grid) {
    for(let cell of row) {
      if(cell.bubble) {
        presentColors.add(cell.color);
      }
    }
  }
  if(colors.length!=presentColors.size) {
    colors = colors.filter(color=>presentColors.has(color));
    updateNextBubbleTextures();
  }
}












 







   


 



const config = {
    type:Phaser.AUTO,
    width:750,
    height:600,
    backgroundColor: "#E8CDEA",
    scene: {
      preload: preload,
      create: create
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: {y:0},
        debug: false,
      },
    },
  };
  
  const game = new Phaser.Game(config);
