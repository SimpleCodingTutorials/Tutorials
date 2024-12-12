let ballAttached = true;
let lives = 3;
let livesText;
let isGameOver = false;

function preload() {
    this.load.image("ball","./assets/ball.png");
    this.load.image("paddle","./assets/paddle.png");
    this.load.image("brick","./assets/brick.png");
    this.load.audio("brickHitSound","./assets/break.mp3");
    this.load.audio("ballHitSound","./assets/ballhit.mp3");
    this.load.audio("victorySound","./assets/win.mp3");
    this.load.audio("gameOverSound","./assets/gameOver.mp3");
    this.load.audio("lostLifeSound","./assets/lostLife.mp3");
}

function create() {
    paddle = this.physics.add.sprite(400,550,"paddle");
    paddle.setCollideWorldBounds(true);
    paddle.setImmovable(true);

    ball = this.physics.add.sprite(400,520,"ball");
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);

    bricks = this.physics.add.staticGroup();
    const colors = [0xff0000,0xff7105,0xffff00,0x00ff00,0x00c4fa,0xeb02c4];

    for(let row=0; row<colors.length;row++) {
        for(let col=0; col<8;col++) {
            const brick = bricks.create(100+col*80,100+row*30,"brick");
            brick.setTint(colors[row]);
        }
    }

    this.physics.add.collider(ball,paddle,hitPaddle,null,this);
    this.physics.add.collider(ball,bricks,hitBrick,null,this);

    livesText = this.add.text(10,10,`Lives: ${lives}`,{
        fontSize: "20px",
        fill: "#fff"
    });

    gameOverText = this.add.text(400,300,"Game Over",{
        fontSize: "48px",
        fill: "#ff0000",
        fontStyle: "bold"
    });

    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    victoryText = this.add.text(400, 300, 'Victory!', {
        fontSize: '48px',
        color: '#00ff00',
        fontStyle: 'bold',
      });
      victoryText.setOrigin(0.5);
      victoryText.setVisible(false);

    brickHitSound = this.sound.add("brickHitSound");
    ballHitSound = this.sound.add("ballHitSound");
    victorySound = this.sound.add("victorySound");
    gameOverSound = this.sound.add("gameOverSound");
    lostLifeSound = this.sound.add("lostLifeSound");
    
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown-SPACE",launchBall,this);
}

function update() {
    if(cursors.left.isDown) {
        paddle.setVelocityX(-400);
    } else if (cursors.right.isDown) {
        paddle.setVelocityX(400);
    } else {
        paddle.setVelocityX(0);
    }

    if(ballAttached) {
        ball.x = paddle.x;
    }
    if(ball.y>=590) {
        loseLife();
    }
}


function launchBall() {
    if(ballAttached) {
        ballAttached = false;
        ball.setVelocity(300,-300);
    }
}

function hitPaddle(ball,paddle) {
    let diff = ball.x - paddle.x;
    ball.setVelocityX(10*diff);
    ballHitSound.play();
}

function hitBrick(ball,brick) {
    brick.destroy();
    brickHitSound.play();
    if(bricks.countActive()===0) {
        displayVictory();
    }
}

function loseLife() {
    if(isGameOver)
        return;
    lives--;
    livesText.setText(`Lives: ${lives}`);
    if(lives>0) {
        resetBall();
        lostLifeSound.play();
    } else {
        gameOver();
    }
}

function resetBall() {
    ballAttached = true;
    ball.setVelocity(0);
    ball.setPosition(paddle.x,520);
}

function gameOver() {
    gameOverText.setVisible(true);
    ball.disableBody(true,true);
    paddle.disableBody(true,false);
    isGameOver = true;
    gameOverSound.play();
}

function displayVictory() {
    victoryText.setVisible(true);
    ball.disableBody(true,true);
    paddle.disableBody(true,false);
    isGameOver = true;
    victorySound.play();
}


const config = {
    type:Phaser.AUTO,
    width:800,
    height:600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y:0},
            debug:false,
        },
    },
    scene:{
        preload:preload,
        create:create,
        update:update
    },
};

const game = new Phaser.Game(config);



























