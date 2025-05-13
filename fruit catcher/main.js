let basket, fruit, cursors;
let score=0;lives=3;
let scoreText,livesText,gameOverText,restartButton;

function preload() {
  this.load.image("background","./assets/background.png");
  this.load.image("basket","./assets/basket.png");
  this.load.image("fruit1","./assets/fruit1.png");
  this.load.image("fruit2","./assets/fruit2.png");
  this.load.image("fruit3","./assets/fruit3.png");
  this.load.image("fruit4","./assets/fruit4.png");
  this.load.image("restartBtn","./assets/restart.png");
  this.load.audio("gameOverSound","./assets/gameOver.mp3");
  this.load.audio("lostLifeSound","./assets/lostLife.mp3");
  this.load.audio("catchSound","./assets/catch.mp3");
}

function create() {
  this.add.image(200,300,"background");
  basket = this.physics.add.sprite(200,550,"basket").setImmovable();
  basket.body.allowGravity = false;
  basket.setCollideWorldBounds(true);

  fruits = this.physics.add.group();

  this.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      if(lives>0) {
        const x = Phaser.Math.Between(20,380);
        const fruitImages = ["fruit1","fruit2","fruit3","fruit4"];
        const randomFruit = Phaser.Math.RND.pick(fruitImages);
        fruits.create(x,0,randomFruit);
      }
    }
  });
  this.physics.add.collider(fruits,basket,catchFruit,null,this);
  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(10,10,"Score: 0",{ fontSize: "16px",fill: "#fff"});
  livesText = this.add.text(300,10,"Lives: 3",{ fontSize: "16px",fill: "#fff"});

  gameOverText = this.add.text(100,250,"Game Over",{
    fontSize: "32px",
    fill: "#ff0000",
    fontStyle: "bold"
  }).setVisible(false);
  gameOverText.x = (this.scale.width - gameOverText.width)/2;

  restartButton = this.add.image(200,320,"restartBtn")
  .setInteractive()
  .setVisible(false);

  restartButton.on("pointerover",()=>{
    this.input.setDefaultCursor("pointer");
  });
  restartButton.on("pointerout",()=>{
    this.input.setDefaultCursor("defult");
  });
  restartButton.on("pointerdown",()=>{
    score=0;
    lives=3;
    scoreText.setText("Score: 0");
    livesText.setText("Lives: 3");
    gameOverText.setVisible(false);
    restartButton.setVisible(false);
    fruits.clear(true,true);
  });

    catchSound = this.sound.add("catchSound");
    gameOverSound = this.sound.add("gameOverSound");
    lostLifeSound = this.sound.add("lostLifeSound");

}

function update() {
  if(lives<=0) {
    basket.setVelocityX(0);
    return;
  }
  if(cursors.left.isDown) {
    basket.setVelocityX(-200);
  } else if (cursors.right.isDown) {
    basket.setVelocityX(200);
  } else {
    basket.setVelocityX(0);
  }

  fruits.children.iterate(fruit => {
    if(fruit && fruit.y>510) {
      fruit.destroy();
      lives--;
      lostLifeSound.play();
      livesText.setText("Lives: "+lives);
      if(lives<=0) {
        gameOverText.setVisible(true);
        restartButton.setVisible(true);
        gameOverSound.play();
        fruits.clear(true,true);
      }
    }
  });
}

function catchFruit(basket,fruit) {
  fruit.destroy();
  score+=10;
  scoreText.setText("Score: "+score);
  catchSound.play();
}

const config = {
  type: Phaser.AUTO,
  width:400,
  height: 600,
  scene: {preload,create,update},
  physics: {
    default: "arcade",
    arcade: {gravity: {y:300},debug: false}
  }
};

const game = new Phaser.Game(config);























