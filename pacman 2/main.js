class Pacman extends Phaser.Scene {
  constructor() {
    super();
    this.pacman = null;
    this.direction = null;
    this.previousDirection = "left";
    this.blockSize = 16;
    this.board = [];
    this.speed = 170;
    this.intersections = [];
    this.nextIntersection = null;
  }

  preload() {
    // Load the tile image, the JSON file, and the Pac-Man sprite
    this.load.image("pacman tileset", "pac man tiles/tileset.png");
    this.load.tilemapTiledJSON("map", "pacman-map.json");
    this.load.spritesheet(
      "pacman",
      "pac man & life counter & death/pac man/pacman0.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "pacman1",
      "pac man & life counter & death/pac man/pacman1.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "pacman2",
      "pac man & life counter & death/pac man/pacman2.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "pacman3",
      "pac man & life counter & death/pac man/pacman3.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "pacman4",
      "pac man & life counter & death/pac man/pacman4.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.image("dot", "dot.png");
  }

  create() {
    // Create a tile map object
    this.map = this.make.tilemap({ key: "map" });

    // Add the tile set to the map
    const tileset = this.map.addTilesetImage("pacman tileset");

    // Add a layer to the map
    const layer = this.map.createLayer("Tile Layer 1", [tileset]);

    // Set the tiles in the layer to be collidable
    layer.setCollisionByExclusion(-1, true);

    this.pacman = this.physics.add.sprite(230, 432, "pacman");

    this.anims.create({
      key: "pacmanAnim",
      frames: [
        { key: "pacman" },
        { key: "pacman1" },
        { key: "pacman2" },
        { key: "pacman3" },
        { key: "pacman4" },
      ],
      frameRate: 10,
      repeat: -1,
    });
    this.pacman.play("pacmanAnim");

    // Enable collision between Pac-Man and the layer
    this.physics.add.collider(this.pacman, layer);

    this.dots = this.physics.add.group();

    this.populateBoardAndTrackEmptyTiles(layer);
    //
    this.physics.add.overlap(this.pacman, this.dots, this.eatDot, null, this);

    // Enable cursor keys for movement
    this.cursors = this.input.keyboard.createCursorKeys();
    this.detectIntersections();
  }

  populateBoardAndTrackEmptyTiles(layer) {
    layer.forEachTile((tile) => {
      if (!this.board[tile.y]) {
        this.board[tile.y] = [];
      }
      // Save the index of the tile in the board
      this.board[tile.y][tile.x] = tile.index;

      if (
        tile.y < 4 ||
        (tile.y > 11 && tile.y < 23 && tile.x > 6 && tile.x < 21) ||
        (tile.y === 17 && tile.x !== 6 && tile.x !== 21)
      )
        return;
      let rightTile = this.map.getTileAt(
        tile.x + 1,
        tile.y,
        true,
        "Tile Layer 1"
      );
      let bottomTile = this.map.getTileAt(
        tile.x,
        tile.y + 1,
        true,
        "Tile Layer 1"
      );
      let rightBotomTile = this.map.getTileAt(
        tile.x + 1,
        tile.y + 1,
        true,
        "Tile Layer 1"
      );

      if (
        tile.index === -1 &&
        rightTile &&
        rightTile.index === -1 &&
        bottomTile &&
        bottomTile.index === -1 &&
        rightBotomTile &&
        rightBotomTile.index === -1
      ) {
        const x = tile.x * tile.width;
        const y = tile.y * tile.height;
        this.dots.create(x + tile.width, y + tile.height, "dot");
      }
    });
  }
  eatDot(pacman, dot) {
    dot.disableBody(true, true);
  }
  update() {
    // If a new direction key is pressed, update the direction
    this.handleDirectionInput();
    this.teleportPacmanAcrossWorldBounds();
    this.handlePacmanMovement();
  }
  handleDirectionInput() {
    const arrowKeys = ["left", "right", "up", "down"];
    for (const key of arrowKeys) {
      if (this.cursors[key].isDown && this.direction !== key) {
        this.previousDirection = this.direction;
        this.direction = key;
        this.nextIntersection = this.getNextIntersectionInNextDirection(
          this.pacman.x,
          this.pacman.y,
          this.previousDirection,
          key
        );
        break; // Exit the loop after finding the pressed key
      }
    }
  }

  teleportPacmanAcrossWorldBounds() {
    const worldBounds = this.physics.world.bounds;
    if (this.pacman.x <= worldBounds.x) {
      this.pacman.body.reset(worldBounds.right - this.blockSize, this.pacman.y);
      this.nextIntersection = this.getNextIntersectionInNextDirection(
        this.pacman.x,
        this.pacman.y,
        "left",
        this.direction
      );
      this.pacman.setVelocityX(-1*this.speed);
    }
    if (this.pacman.x >= worldBounds.right) {
      this.pacman.body.reset(worldBounds.x + this.blockSize, this.pacman.y);
      this.nextIntersection = this.getNextIntersectionInNextDirection(
        this.pacman.x,
        this.pacman.y,
        "right",
        this.direction
      );
      this.pacman.setVelocityX(this.speed);
    }
  }

  handlePacmanMovement() {
    let nextIntersectionx = null;
    let nextIntersectiony = null;
    if (this.nextIntersection) {
      nextIntersectionx = this.nextIntersection.x;
      nextIntersectiony = this.nextIntersection.y;
    }
    switch (this.direction) {
      case "left":
        this.handleMovementInDirection(
          "left",
          "right",
          this.pacman.y,
          nextIntersectiony,
          this.pacman.x,
          true,
          false,
          0,
          -1 * this.speed,
          0,
          this.pacman.body.velocity.y
        );
        break;
      case "right":
        this.handleMovementInDirection(
          "right",
          "left",
          this.pacman.y,
          nextIntersectiony,
          this.pacman.x,
          true,
          false,
          180,
          this.speed,
          0,
          this.pacman.body.velocity.y
        );
        break;
      case "up":
        this.handleMovementInDirection(
          "up",
          "down",
          this.pacman.x,
          nextIntersectionx,
          this.pacman.y,
          false,
          true,
          -90,
          0,
          -1 * this.speed,
          this.pacman.body.velocity.x
        );
        break;
      case "down":
        this.handleMovementInDirection(
          "down",
          "up",
          this.pacman.x,
          nextIntersectionx,
          this.pacman.y,
          false,
          true,
          90,
          0,
          this.speed,
          this.pacman.body.velocity.x
        );
        break;
      default:
        this.pacman.setVelocityX(0);
        this.pacman.setVelocityY(0);
    }
  }

  handleMovementInDirection(
    currentDirection,
    oppositeDirection,
    pacmanPosition,
    intersectionPosition,
    pacmanPerpendicularPosition,
    filpX,
    flipY,
    angle,
    velocityX,
    velocityY,
    currentVelocity
  ) {
    let otherDirections =
      currentDirection === "left" || currentDirection === "right"
        ? ["up", "down"]
        : ["left", "right"];

    let condition = false;

    if (this.nextIntersection)
      condition =
        (this.previousDirection == otherDirections[0] &&
          pacmanPosition <= intersectionPosition) ||
        (this.previousDirection == otherDirections[1] &&
          pacmanPosition >= intersectionPosition) ||
        this.previousDirection === oppositeDirection;

    if (condition) {
      let newPosition = intersectionPosition;
      if (
        this.previousDirection != oppositeDirection &&
        newPosition !== pacmanPosition
      ) {
        if (currentDirection === "left" || currentDirection === "right")
          this.pacman.body.reset(pacmanPerpendicularPosition, newPosition);
        else this.pacman.body.reset(newPosition, pacmanPerpendicularPosition);
      }
      this.changeDirection(filpX, flipY, angle, velocityX, velocityY);
      this.adjustPacmanPosition(velocityX, velocityY);
    } else if (currentVelocity === 0) {
      this.changeDirection(filpX, flipY, angle, velocityX, velocityY);
      this.adjustPacmanPosition(velocityX, velocityY);
    }
  }

  adjustPacmanPosition(velocityX, velocityY) {
    if (this.pacman.x % this.blockSize !== 0 && velocityY > 0) {
      let nearestMultiple =
        Math.round(this.pacman.x / this.blockSize) * this.blockSize;
      this.pacman.body.reset(nearestMultiple, this.pacman.y);
    }
    if (this.pacman.y % this.blockSize !== 0 && velocityX > 0) {
      let nearestMultiple =
        Math.round(this.pacman.y / this.blockSize) * this.blockSize;
      this.pacman.body.reset(this.pacman.x, nearestMultiple);
    }
  }

  changeDirection(filpX, flipY, angle, velocityX, velocityY) {
    this.pacman.setFlipX(filpX);
    this.pacman.setFlipY(flipY);
    this.pacman.setAngle(angle);
    this.pacman.setVelocityY(velocityY);
    this.pacman.setVelocityX(velocityX);
  }

  detectIntersections() {
    const directions = [
      { x: -this.blockSize, y: 0, name: "left" },
      { x: this.blockSize, y: 0, name: "right" },
      { x: 0, y: -this.blockSize, name: "up" },
      { x: 0, y: this.blockSize, name: "down" },
    ];

    const blockSize = this.blockSize;

    for (let y = 0; y < this.map.heightInPixels; y += blockSize) {
      for (let x = 0; x < this.map.widthInPixels; x += blockSize) {
        if (x % blockSize !== 0 || y % blockSize !== 0) continue; // Ensure multiples of blockSize

        if (!this.isPointClear(x, y)) continue; // Ensure the point itself is not on any corner of an occupied tile

        let openPaths = [];

        directions.forEach((dir) => {
          if (this.isPathOpenAroundPoint(x + dir.x, y + dir.y)) {
            openPaths.push(dir.name);
          }
        });

        if (openPaths.length > 2 && y > 64 && y < 530) {
          this.intersections.push({ x: x, y: y, openPaths: openPaths });
        } else if (openPaths.length === 2 && y > 64 && y < 530) {
          // Check for turning points
          const [dir1, dir2] = openPaths;
          if (
            ((dir1 === "left" || dir1 === "right") &&
              (dir2 === "up" || dir2 === "down")) ||
            ((dir1 === "up" || dir1 === "down") &&
              (dir2 === "left" || dir2 === "right"))
          ) {
            this.intersections.push({ x: x, y: y, openPaths: openPaths });
          }
        }
      }
    }
  }

  isPathOpenAroundPoint(pixelX, pixelY) {
    const corners = [
      { x: pixelX - 1, y: pixelY - 1 },
      { x: pixelX + 1, y: pixelY - 1 },
      { x: pixelX - 1, y: pixelY + 1 },
      { x: pixelX + 1, y: pixelY + 1 },
    ];

    return corners.every((corner) => {
      const tileX = Math.floor(corner.x / this.blockSize);
      const tileY = Math.floor(corner.y / this.blockSize);

      if (!this.board[tileY] || this.board[tileY][tileX] !== -1) {
        return false;
      }

      return true;
    });
  }

  isPointClear(x, y) {
    const corners = [
      { x: x - 1, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];

    return corners.every((corner) => {
      const tileX = Math.floor(corner.x / this.blockSize);
      const tileY = Math.floor(corner.y / this.blockSize);

      return !this.board[tileY] || this.board[tileY][tileX] === -1;
    });
  }

  getNextIntersectionInNextDirection(
    currentX,
    currentY,
    currentDirection,
    nextDirection
  ) {
    // Filter intersections based on current direction
    let filteredIntersections;
    const isUp = currentDirection === "up";
    const isDown = currentDirection === "down";
    const isLeft = currentDirection === "left";
    const isRight = currentDirection === "right";
    filteredIntersections = this.intersections
      .filter((intersection) => {
        return (
          ((isUp && intersection.x === currentX && intersection.y < currentY) ||
            (isDown &&
              intersection.x === currentX &&
              intersection.y > currentY) ||
            (isLeft &&
              intersection.y === currentY &&
              intersection.x < currentX) ||
            (isRight &&
              intersection.y === currentY &&
              intersection.x > currentX)) &&
          this.isIntersectionInDirection(intersection, nextDirection)
        );
      })
      .sort((a, b) => {
        if (isUp || isDown) {
          return isUp ? b.y - a.y : a.y - b.y;
        } else {
          return isLeft ? b.x - a.x : a.x - b.x;
        }
      });

    // Return the first intersection in the sorted array
    return filteredIntersections ? filteredIntersections[0] : null;
  }

  isIntersectionInDirection(intersection, direction) {
    switch (direction) {
      case "up":
        return intersection.openPaths.includes("up");
      case "down":
        return intersection.openPaths.includes("down");
      case "left":
        return intersection.openPaths.includes("left");
      case "right":
        return intersection.openPaths.includes("right");
      default:
        return false;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 464,
  height: 560,
  parent: "boardContainer",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: Pacman,
};

const game = new Phaser.Game(config);
