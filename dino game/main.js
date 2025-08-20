let dino, cursors, ground, obstacles,birds, scoreText, score = 0,gameOverText, gameSpeed = 500,baseSpeed=500,speedFactor=100, isGameOver = false;

const cactusTypes = [
  "cactusSmall1",
  "cactusSmall2",
  "cactusSmall3",
  "cactusSmall4",
  "cactusLarge1",
  "cactusLarge2",
  "cactusLarge3",
  "cactusLarge4",
  "cactusDoubleSmall1",
  "cactusDoubleSmall2",
  "cactusDoubleSmall3",
  "cactusDoubleLarge1",
  "cactusDoubleLarge2",
  "cactusTripleLarge1",
  "cactusTripleSmall1",
  "cactusTripleSmall2",
  "cactusTripleSmall3",
];

function preload() {
  this.load.image("cloud", "./assets/cloud.png");
  this.load.image("dino", "./assets/dino.png");
  this.load.image("dinoRun1", "./assets/dinoRun1.png");
  this.load.image("dinoRun2", "./assets/dinoRun2.png");
  this.load.image("dinoJump", "./assets/dinoJump.png");
  this.load.image("dinoDuck1", "./assets/dinoDuck1.png");
  this.load.image("dinoDuck2", "./assets/dinoDuck2.png");
  this.load.image("dinoDie", "./assets/dinoDie.png");
  this.load.image("ground", "./assets/ground.png");
  this.load.image("cactusSmall1", "./assets/singlesmall1.png");
  this.load.image("cactusSmall2", "./assets/singlesmall2.png");
  this.load.image("cactusSmall3", "./assets/singlesmall3.png");
  this.load.image("cactusSmall4", "./assets/singlesmall4.png");
  this.load.image("cactusLarge1", "./assets/singlelarge1.png");
  this.load.image("cactusLarge2", "./assets/singlelarge2.png");
  this.load.image("cactusLarge3", "./assets/singlelarge3.png");
  this.load.image("cactusLarge4", "./assets/singlelarge4.png");
  this.load.image("cactusDoubleSmall1", "./assets/doublesmall1.png");
  this.load.image("cactusDoubleSmall2", "./assets/doublesmall2.png");
  this.load.image("cactusDoubleSmall3", "./assets/doublesmall3.png");
  this.load.image("cactusDoubleLarge1", "./assets/doublelarge1.png");
  this.load.image("cactusDoubleLarge2", "./assets/doublelarge2.png");
  this.load.image("cactusTripleSmall1", "./assets/triplesmall1.png");
  this.load.image("cactusTripleSmall2", "./assets/triplesmall2.png");
  this.load.image("cactusTripleSmall3", "./assets/triplesmall3.png");
  this.load.image("cactusTripleLarge1", "./assets/triplelarge1.png");
  this.load.image("bird1", "./assets/bird1.png");
  this.load.image("bird2", "./assets/bird2.png");
  this.load.image("resetBtn", "./assets/restart.png");
  this.load.image("gameOver", "./assets/gameover.png");
  this.load.audio("jump", "./assets/jump.wav");
  this.load.audio("lost", "./assets/gameover.wav");
}

function create() {
  setupBackground.call(this);
  setupDino.call(this);
  setupAnimations.call(this);
  setupPhysics.call(this);
  setupGroups.call(this);
  setupInput.call(this);
  setupUI.call(this);
  setupColliders.call(this);
  setupResetButton.call(this);
  setupSounds.call(this);
  spawnObstacleWithDelay(this);
}

function setupBackground() {
  groundTile = this.add.tileSprite(400, 330, 800, 21, "ground");
  cloud = this.add.tileSprite(400, 240, 1600, 80, "cloud");
  this.physics.add.existing(groundTile, true);
  this.physics.add.existing(cloud, true);
}

function setupDino() {
  dino = this.physics.add.sprite(100, 280, "dinoRun1").setScale(0.5);
  dino.setOrigin(0, 1);
  dino.setCollideWorldBounds(true);
  dino.play("run");
}

function setupAnimations() {
  this.anims.create({
    key: "run",
    frames: [{ key: "dinoRun1" }, { key: "dinoRun2" }],
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "duck",
    frames: [{ key: "dinoDuck1" }, { key: "dinoDuck2" }],
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "fly",
    frames: [{ key: "bird1" }, { key: "bird2" }],
    frameRate: 10,
    repeat: -1
  });
}

function setupPhysics() {
  this.physics.add.collider(dino, groundTile);
}

function setupGroups() {
  obstacles = this.physics.add.group();
  birds = this.physics.add.group();
}

function setupInput() {
  cursors = this.input.keyboard.createCursorKeys();
}

function setupUI() {
  scoreText = this.add.text(670, 150, "Score: 0", { fontSize: "20px", fill: "#000" });
  gameOver = this.add.image(380, 200, "gameOver").setVisible(false).setScale(0.6);
}

function setupResetButton() {
  resetButton = this.add.image(380, 250, "resetBtn").setInteractive().setVisible(false).setScale(0.6);
  resetButton.on("pointerdown", () => {
    this.scene.restart();
    isGameOver = false;
    score = 0;
  });
}

function setupColliders() {
  this.physics.add.collider(dino, obstacles, handleGameOver, null, this);
  this.physics.add.collider(dino, birds, handleGameOver, null, this);
}

function spawnObstacle(scene) {
  const canSpawnBird = score > 400;
  const birdChance = 0.3;

 if (canSpawnBird && Math.random() < birdChance) {
    spawnBird(scene);
  } else {
    spawnCactus(scene);
  }
}

function spawnObstacleWithDelay(scene) {
  const delay = Phaser.Math.Between(500, 1500);

  scene.time.addEvent({
    delay,
    callback: () => {
      spawnObstacle(scene);
      spawnObstacleWithDelay(scene); // Schedule next spawn
    }
  });
}

function spawnCactus() {
  const cactusKey = Phaser.Utils.Array.GetRandom(cactusTypes);
  const cactus = obstacles.create(800, 325, cactusKey).setScale(0.5);
  cactus.setOrigin(0, 1);
  cactus.setVelocityX(-gameSpeed);
  cactus.setImmovable(true);
  cactus.body.allowGravity = false;
}

function spawnBird() {
  const birdY = Phaser.Math.RND.pick([280, 260, 300]); 
  const birdKey = "bird1";
  const bird = birds.create(800, birdY, birdKey).setScale(0.5);
  bird.setOrigin(0, 1);
  bird.setVelocityX(-gameSpeed);
  bird.setImmovable(true);
  bird.body.allowGravity = false;
  bird.play("fly");
}

function handleGameOver() {
  isGameOver = true;
  this.physics.pause();
  scoreText.setText("Score: " + parseInt(score));
  resetButton.setVisible(true); 
  gameOver.setVisible(true); 
  dino.setTexture("dinoDie");
  dino.anims.stop();
  gameOverSound.play();
  
}

function setupSounds() {
  jumpSound = this.sound.add("jump");
  gameOverSound = this.sound.add("lost");
}

function update() {
  if (isGameOver) return;

  updateGameSpeed();
  handleInput();
  handleDinoState();
  cleanupObstacles();
  updateBackground();
  updateScore();
}

function updateGameSpeed() {
  gameSpeed = baseSpeed + (score / speedFactor);

}

function handleInput() {
  const isOnGround = dino.body.blocked.down;

  if (cursors.up.isDown && isOnGround) {
    dino.setVelocityY(-500);
    jumpSound.play();
  }
}

function handleDinoState() {
  const isOnGround = dino.body.blocked.down;

  if (cursors.down.isDown && isOnGround && !isGameOver) {
    if (!dino.anims.isPlaying || dino.anims.currentAnim.key !== "duck") {
      dino.setTexture("dinoDuck1");
      dino.play("duck");
      dino.setSize(111, 51);
      dino.setOffset(0, 35);
    }
  } else if (!isOnGround) {
    dino.setTexture("dinoJump");
  } else if (!cursors.down.isDown && (!dino.anims.isPlaying || dino.anims.currentAnim.key !== "run")) {
    dino.setTexture("dinoRun1");
    dino.play("run");
    dino.setSize(111, 86);
    dino.setOffset(0, 0);
  }
}

function cleanupObstacles() {
  obstacles.getChildren().forEach(obstacle => {
    if (obstacle.x < -50) obstacle.destroy();
  });
}

function updateBackground() {
  groundTile.tilePositionX += gameSpeed / 60;
  cloud.tilePositionX += gameSpeed / 800;
}

function updateScore() {
  score += 0.12;
  scoreText.setText("Score: " + parseInt(score));
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 330,
  backgroundColor: "#ffffff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1700 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update  
  }
};

const game = new Phaser.Game(config);
