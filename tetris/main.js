const tetriminos = {
  i: [
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ],
  j: [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  l: [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  o: [
    [1,1],
    [1,1]
  ],
  s: [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  t: [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ],
  z: [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ]
};

class TetrisScene extends Phaser.Scene {
  constructor() {
    super({key: "TetrisScene"});
    this.gameBoard = [];
    this.currentTetrimino = null;
    this.blockSprites = [];
    for (let i=0;i<20;i++) {
      this.blockSprites[i] = new Array(10).fill(null);
    }
  }
  preload() {
    this.load.image("j","assets/Shape Blocks/J.png");
    this.load.image("i","assets/Shape Blocks/I.png");
    this.load.image("l","assets/Shape Blocks/L.png");
    this.load.image("z","assets/Shape Blocks/Z.png");
    this.load.image("s","assets/Shape Blocks/S.png");
    this.load.image("t","assets/Shape Blocks/T.png");
    this.load.image("o","assets/Shape Blocks/O.png");
    this.load.image("block-j","assets/Single Blocks/Blue.png");
    this.load.image("block-i","assets/Single Blocks/LightBlue.png");
    this.load.image("block-l","assets/Single Blocks/Orange.png");
    this.load.image("block-s","assets/Single Blocks/Green.png");
    this.load.image("block-t","assets/Single Blocks/Purple.png");
    this.load.image("block-z","assets/Single Blocks/Red.png");
    this.load.image("block-o","assets/Single Blocks/Yellow.png");
    this.load.image("board","assets/Board/Board.png");
    this.load.on("complete",()=>{
      const oTetrimino = this.textures.get("o").getSourceImage();
      this.blockSize = oTetrimino.width/4;
    });
  }
  create() {
    let bg = this.add.image(0,0,"board");
    bg.setOrigin(0,0);
    bg.displayWidth = this.sys.game.config.width;
    bg.displayHeight = this.sys.game.config.height;
    for(let i=0; i<20;i++) {
      this.gameBoard[i] = [];
      for(let j=0;j<10;j++) {
        this.gameBoard[i][j] = 0;
      }
    }
    this.moveCounter = 0;
    this.moveInterval = 60;
    this.spawnTetrimino();
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  spawnTetrimino() {
    const tetriminos = ["j","i","l","z","s","t","o"];
    if(!this.nextTetriminoType) {
      const randomIndex = Math.floor(Math.random()* tetriminos.length);
      this.nextTetriminoType = tetriminos[randomIndex];
    }
    this.currentTetriminoType = this.nextTetriminoType;
    const randomIndex = Math.floor(Math.random()* tetriminos.length);
    this.nextTetriminoType = tetriminos[randomIndex];
    nextTetriminoImage.src = "assets/Shape Blocks/"+this.nextTetriminoType.toUpperCase()+".png";
    this.currentTetrimino = this.physics.add.image(0,this.blockSize,this.currentTetriminoType);
    const tetriminoWidth = 0.5*this.currentTetrimino.displayWidth/this.blockSize;
    const xOffset = tetriminoWidth%2 === 0 ? (this.blockSize*(10-tetriminoWidth))/2: 3*this.blockSize;
    this.currentTetrimino.x = xOffset;
    this.currentTetrimino.y = 0;
    this.currentTetrimino.rotationState = 0;
    this.currentTetrimino.setOrigin(0,0);
    this.currentTetrimino.setScale(0.5);
    this.physics.world.enable(this.currentTetrimino);
    this.currentTetrimino.body.collideWorldBounds = true;
    this.currentTetrimino.blocks = this.calculateBlockPositions(this.currentTetriminoType,0);
  }
  calculateBlockPositions(type) {
    const positions = [];
    const matrix = tetriminos[type];
    for (let i = 0;i<matrix.length;i++) {
      for(let j=0;j<matrix[i].length;j++) {
        if(matrix[i][j]===1) {
          positions.push({x:j,y:i});
        }
      }
    }
    return positions;
  }
 update() {
  this.moveCounter++;
  if(this.currentTetrimino && this.moveCounter>= this.moveInterval) {
    this.setTetriminoOnBoard(0);
    this.currentTetrimino.y += this.blockSize;
    this.moveCounter =0;
    this.setTetriminoOnBoard(2);
    this.time.delayedCall(500,()=>{
      this.checkAndHandleLandedTetrimino();
    });
  }
  if(!this.currentTetrimino) return;
   if(Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
    if(!this.isMoveValid(-1)) return;
    this.setTetriminoOnBoard(0);
    this.currentTetrimino.x -=this.blockSize;
    this.setTetriminoOnBoard(2);
    this.checkAndHandleLandedTetrimino();
   }
   if(Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
    if(!this.isMoveValid(1)) return;
    this.setTetriminoOnBoard(0);
    this.currentTetrimino.x +=this.blockSize;
    this.setTetriminoOnBoard(2);
    this.checkAndHandleLandedTetrimino();
   }
   if(this.cursors.down.isDown && this.moveCounter % 5 == 0) {
    this.setTetriminoOnBoard(0);
    if(!this.hasLanded())
      this.currentTetrimino.y+=this.blockSize;
    this.setTetriminoOnBoard(2);
    if(this.hasLanded()) {
      this.landTetrimino();
    }
   }
   if(Phaser.Input.Keyboard.JustDown(this.cursors.up) && !this.hasLanded()) {
    this.setTetriminoOnBoard(0);
    this.setTetriminoOnBoard(2);
   }
   if(Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
    while(!this.hasLanded()) {
      this.currentTetrimino.y +=this.blockSize;
    }
    this.landTetrimino();
   }
 }

checkAndHandleLandedTetrimino() {
  if(this.hasLanded()) {
    this.setTetriminoOnBoard(0);
    this.landTetrimino();
  }
}

isMoveValid(direction) {
  let moveValid = true;
  this.currentTetrimino.blocks.forEach((block)=>{
    const x = Math.floor((this.currentTetrimino.x+block.x*this.blockSize)/this.blockSize);
    const y = Math.floor((this.currentTetrimino.y+block.y*this.blockSize)/this.blockSize);
    if(this.gameBoard[y][x+direction]===1 || (x+direction)<0 || (x+direction)>9) moveValid = false;
  });
   return moveValid;
}
setTetriminoOnBoard(value) {
   this.currentTetrimino.blocks.forEach((block)=>{
    const x = Math.floor((this.currentTetrimino.x+block.x*this.blockSize)/this.blockSize);
    const y = Math.floor((this.currentTetrimino.y+block.y*this.blockSize)/this.blockSize);
    if(x>=0 && x<10 && y>=0 && y<20) {
      this.gameBoard[y][x] = value;
    }
   });
}

hasLanded() {
  for(let block of this.currentTetrimino.blocks) {
    const x = Math.floor((this.currentTetrimino.x+block.x*this.blockSize)/this.blockSize);
    const y = Math.floor((this.currentTetrimino.y+block.y*this.blockSize)/this.blockSize);
    if(y>=19) {
      return true;
    }
    if(y<20 && x<10 && this.gameBoard[y+1][x]===1) {
      return true;
    }
  }
  return false;
}
landTetrimino() {
  this.setTetriminoOnBoard(1);
  this.spawnTetrimino();
}
}

const config = {
  type: Phaser.AUTO,
  width:320,
  height:640,
  parent: "boardContainer",
  physics: {
    default:"arcade",
    arcade: {
      gravity:{y:0},
      debug:false,
    },
  },
  scene:[TetrisScene],
};

window.game = new Phaser.Game(config);





















