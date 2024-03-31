let score=0;
document.getElementById("startGame").addEventListener("click",function(){
  window.game.scene.keys["SnakeScene"].snake.resetGame();
});
class SnakeScene extends Phaser.Scene {
  constructor() {
    super({
      key: "SnakeScene"
    });
  }
  preload() {
    this.load.image("food","assets/apple.png");
    this.load.image("snakeRight","assets/head_right.png");
    this.load.image("snakeLeft","assets/head_left.png");
    this.load.image("snakeUp","assets/head_up.png");
    this.load.image("snakeDown","assets/head_down.png");
    this.load.image("bodyHorizontal","assets/body_horizontal.png");
    this.load.image("bodyVertical","assets/body_vertical.png");
    this.load.image("bodyRightUp","assets/body_rightup.png");
    this.load.image("bodyRightDown","assets/body_rightdown.png");
    this.load.image("bodyDownRight","assets/body_downright.png");
    this.load.image("bodyUpRight","assets/body_upright.png");
    this.load.image("tailRight","assets/tail_right.png");
    this.load.image("tailLeft","assets/tail_left.png");
    this.load.image("tailUp","assets/tail_up.png");
    this.load.image("tailDown","assets/tail_down.png");
    this.load.image("background","assets/bg.png");
    this.load.audio("eat","assets/eat.mp3");
    this.load.audio("hit","assets/hit.wav");
  }

  create() {
    let bg = this.add.image(0, 0, 'background');
    bg.displayWidth = this.sys.canvas.width;
    bg.displayHeight = this.sys.canvas.height;
    bg.setOrigin(0, 0); 
    this.snake = new Snake(this, 400, 100);
    this.food = new Food(this, 400, 300);
    this.physics.world.enable(this.food);
    this.physics.world.enable(this.snake.body[0]);
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update(time) {
    if(!this.snake.alive) return;
    let directions = {
      "left" : Phaser.Math.Vector2.LEFT,
      "right" : Phaser.Math.Vector2.RIGHT,
      "up" : Phaser.Math.Vector2.UP,
      "down" : Phaser.Math.Vector2.DOWN,
    };
    let animations = {
      "left": "moveLeft",
      "right": "moveRight",
      "up": "moveUp",
      "down": "moveDown",
    };

    for(let [direction,vector] of Object.entries(directions)) {
      if(this.cursors[direction].isDown) {
        this.snake.faceDirection(vector,animations[direction]);
      }
    }
   if(this.snake.update(time)) {
    if(this.physics.overlap(this.snake.body[0],this.food)) {
      this.food.reposition();
      this.snake.grow();
    }
   }

  }
}
let snakeHead;
class Snake{
  constructor(scene) {
    this.scene = scene;
    this.body=[];
    this.positions=[];
    this.directions=[];
    this.gameStarted = false;
    this.keyLock = false;
    this.moveEvents = [];
    this.bodyParts = [];
    this.body.push(this.scene.physics.add.sprite(100,300,"snakeRight"));
    snakeHead = this.body[0];
    snakeHead.setCollideWorldBounds(true);
    snakeHead.body.onWorldBounds = true;
    snakeHead.body.world.on("worldbounds",this.endGame,this);
    this.bodyPartLength = snakeHead.displayWidth;
    this.body.push(this.scene.physics.add.sprite(100-this.bodyPartLength,300,"tailLeft"));
    this.direction = Phaser.Math.Vector2.RIGHT;
    this.directions.unshift(this.direction.clone());
    this.eat = this.scene.sound.add("eat");
    this.hit = this.scene.sound.add("hit");
    this.moveTime =0;
    this.score =0;
    this.speed = 150;
    this.alive = true;
    scene.anims.create({
      key: "moveUp",
      frames: [{key: "snakeUp"}],
    });
    scene.anims.create({
      key: "moveDown",
      frames: [{key: "snakeDown"}],
    });
    scene.anims.create({
      key: "moveLeft",
      frames: [{key: "snakeLeft"}],
    });
    scene.anims.create({
      key: "moveRight",
      frames: [{key: "snakeRight"}],
    });
  }

  faceDirection(vector, animation) {
    this.gameStarted = true;
    let oppositeVector = new Phaser.Math.Vector2(-vector.x,-vector.y);
    if(!this.keyLock && !this.direction.equals(oppositeVector)) {
      this.moveEvents.push(vector);
      this.keyLock = true;
      snakeHead.anims.play(animation,true);
    }
  }
  update(time) {
    if(time>= this.moveTime && this.gameStarted) {
      this.keyLock = false;
      if(this.moveEvents.length>0) {
        this.direction = this.moveEvents.shift();
      }
      this.move();
      return true;
    }
    return false;
  }

  move() {
    let oldHeadPosition = {x: snakeHead.x, y: snakeHead.y};
    this.directions.unshift(this.direction.clone());
    snakeHead.x += this.direction.x*this.bodyPartLength;
    snakeHead.y += this.direction.y*this.bodyPartLength;

    if(snakeHead.x>game.config.width || snakeHead.x<0 ||snakeHead.y>game.config.height || snakeHead.y<0  ) return;

    for(let i=1; i<this.body.length; i++) {
      let oldBodyPosition = {x:this.body[i].x,y: this.body[i].y};
      let oldBodyDirection = this.directions[i];
      this.body[i].x = oldHeadPosition.x;
      this.body[i].y = oldHeadPosition.y;
      oldHeadPosition = oldBodyPosition;
      this.setBodyPartTexture(i,oldBodyDirection);
    }
    this.setTailTexture();
    if(this.positions.length>this.body.length*this.bodyPartLength) {
      this.positions.pop();
      this.directions.pop();
    }
    this.moveTime = this.scene.time.now+this.speed;
  }
  setBodyPartTexture(i,oldBodyDirection) {
    if(!oldBodyDirection.equals(this.directions[i-1])) {
      let prevDirection = `${this.directions[i-1].x},${this.directions[i-1].y}`;
      let currDirection = `${oldBodyDirection.x},${oldBodyDirection.y}`;
      let textureMap = {
        "1,0,0,-1": "bodyUpRight",
        "0,1,-1,0": "bodyUpRight",
        "-1,0,0,1": "bodyRightUp",
        "0,-1,1,0": "bodyRightUp",
        "0,1,1,0": "bodyRightDown",
        "-1,0,0,-1": "bodyRightDown",
        "0,-1,-1,0": "bodyDownRight",
        "1,0,0,1": "bodyDownRight",
      };
      let directionKey = `${prevDirection},${currDirection}`;
      this.body[i].setTexture(textureMap[directionKey]);
    } else {
      if(oldBodyDirection.y !=0) {
        this.body[i].setTexture("bodyVertical");
      } else {
        this.body[i].setTexture("bodyHorizontal");
      }
    }
  }
  setTailTexture() {
    let tailIndex = this.body.length - 1;
    if(tailIndex>0) {
      let prevDirection = this.directions[tailIndex-1];
      let textureMap = {
        "0,-1": "tailDown",
        "0,1": "tailUp",
        "-1,0": "tailRight",
        "1,0": "tailLeft",
      };
      let directionKey = `${prevDirection.x},${prevDirection.y}`;
      this.body[tailIndex].setTexture(textureMap[directionKey]);
    }
  }
  grow() {
    let newPart = this.scene.physics.add.sprite(-1*this.bodyPartLength,-1*this.bodyPartLength,"tailRight");
    this.scene.physics.add.collider(snakeHead,newPart,this.endGame,null,this.scene.snake);
    let collider = this.scene.physics.add.collider(snakeHead,newPart,this.endGame,null,this.scene.snake);
    this.bodyParts.push(newPart) ;
    this.body.push(newPart);

    this.eat.play();
    score++;
    scoreNumber.innerHTML = score;
  }
  endGame() {
    this.alive = false;
    gameControlPanel.style.display = "block";
    finalScore.innerHTML = score;
    this.bodyParts.forEach(newPart=>{
      newPart.body.enable = false;
    });
    this.hit.play();
  }
  resetGame = () => {
    score =0;
    scoreNumber.innerHTML=0;
    this.scene.create();
    gameControlPanel.style.display = "none";
    this.gameStarted = true;
  }
}

class Food extends Phaser.GameObjects.Image{
  constructor(scene,x,y) {
    super(scene,x,y,"food");
    this.scene.add.existing(this);
  }
  reposition() {
    let bodyPartLength = this.scene.snake.bodyPartLength;
    let x = Phaser.Math.Between(0,(this.scene.game.config.width/bodyPartLength)-1);
    let y = Phaser.Math.Between(0,(this.scene.game.config.height/bodyPartLength)-1);
    x= bodyPartLength*x+0.5*bodyPartLength;
    y=bodyPartLength*y+0.5*bodyPartLength;
    let bodyParts = this.scene.snake.body;
    this.setPosition(x,y);
    for(let i=1; i<bodyParts.length;i++) {
      let spriteBounds = bodyParts[i].getBounds();
      if(spriteBounds.contains(x,y)) {
        this.reposition();
      }
    }
  }
}


const config = {
  type : Phaser.AUTO,
  width:600,
  height:600,
  physics:{
    default: "arcade",
    arcade:{
      gravity:{y:0},
    },
  },
  scene: [SnakeScene],
};

window.game = new Phaser.Game(config);



















