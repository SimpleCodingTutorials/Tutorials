class Pacman extends Phaser.Scene {
  constructor() {
    super();
    this.Pacman =null;
    this.direction = null;
    this.previousDirection = "left";
    this.blockSize =16;
    this.board = [];
    this.speed = 170;
    this.intersections = [];
    this.nextIntersection = null;
    this.oldNextIntersection = null;

    this.PINKY_SCATTER_TARGET = {x:432,y:80};
    this.BLINKY_SCATTER_TARGET =  {x:32,y:80};
    this.INKY_SCATTER_TARGET =  {x:432,y:528};
    this.CLYDE_SCATTER_TARGET =  {x:32,y:528};

    this.scatterModeDuration = 7000;
    this.chaseModeDuration = 20000;
    this.entryDelay = 7000;
    this.respawnDelay = 5000;
    this.modeTimer = null;
    this.modeStartTime = Date.now();
    this.currentMode = "scatter";
    this.initModeTimers();
  }
  initModeTimers() {
    this.setModeTimer(this.scatterModeDuration);
  }
  setModeTimer(duration) {
    if(this.modeTimer) {
      clearTimeout(this.modeTimer);
    }
    this.modeTimer = setTimeout(()=>{
      this.switchMode();
    },duration);
  }
  switchMode() {
    if(this.currentMode === "scatter") {
      this.currentMode = "chase";
      this.setModeTimer(this.chaseModeDuration);
      console.log("chase");
      let chaseTarget = {x:this.pacman.x,y:this.pacman.y};
      this.updateGhostPath(this.redGhost,chaseTarget);

    } else {
      this.currentMode = "scatter";
      this.setModeTimer(this.scatterModeDuration);
      console.log("scatter");
      let chaseTarget = this.BLINKY_SCATTER_TARGET;
      this.updateGhostPath(this.redGhost,chaseTarget);
    }
    this.modeStartTime = Date.now();
  }


  preload() {
    this.load.image("pacman tileset","pac man tiles/tileset.png");
    this.load.tilemapTiledJSON("map","pacman-map.json");
    this.load.spritesheet("pacman","pacman characters/pacman/pacman0.png",{
      frameWidth:32,frameHeight:32
    });
    this.load.spritesheet("pacman1","pacman characters/pacman/pacman1.png",{
      frameWidth:32,frameHeight:32
    });
    this.load.spritesheet("pacman2","pacman characters/pacman/pacman2.png",{
      frameWidth:32,frameHeight:32
    });
    this.load.spritesheet("pacman3","pacman characters/pacman/pacman3.png",{
      frameWidth:32,frameHeight:32
    });
    this.load.spritesheet("pacman4","pacman characters/pacman/pacman4.png",{
      frameWidth:32,frameHeight:32
    });
    this.load.image("dot","pacman items/dot.png");

    this.load.spritesheet("pinkGhost","ghost/pink ghost/spr_ghost_pink_0.png",{
      frameWidth:32,frameHeight:32
    });
    this.load.spritesheet("orangeGhost","ghost/orange ghost/spr_ghost_orange_0.png",{
      frameWidth:32,frameHeight:32
    });
    this.load.spritesheet("blueGhost","ghost/blue ghost/spr_ghost_blue_0.png",{
      frameWidth:32,frameHeight:32
    });
    this.load.spritesheet("redGhost","ghost/red ghost/spr_ghost_red_0.png",{
      frameWidth:32,frameHeight:32
    });
    

  }
  create() {
    this.map = this.make.tilemap({key:"map"});
    const tileset = this.map.addTilesetImage("pacman tileset");
    const layer = this.map.createLayer("Tile Layer 1",[tileset]);
    layer.setCollisionByExclusion(-1,true);
    this.pacman = this.physics.add.sprite(230,432,"pacman");
    this.anims.create({
      key:"pacmanAnim",
      frames: [
        {key:"pacman"},
        {key:"pacman1"},
        {key:"pacman2"},
        {key:"pacman3"},
        {key:"pacman4"},
      ],
      frameRate:10,
      repeat:-1,
    });
    this.pacman.play("pacmanAnim");
    this.physics.add.collider(this.pacman,layer);
    this.dots = this.physics.add.group();
    this.populateBoardAndTrackEmptyTiles(layer);
    this.physics.add.overlap(this.pacman,this.dots,this.eatDot,null,this);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.detectIntersections();
    this.initializeGhosts(layer);
    let startPoint = {x:232,y:240};
    this.pinkGhost.path = this.aStarAlgorithm(startPoint,this.PINKY_SCATTER_TARGET);
    this.pinkGhost.nextIntersection = this.pinkGhost.path.shift();

    this.blueGhost.path = this.aStarAlgorithm(startPoint,this.INKY_SCATTER_TARGET);
    this.blueGhost.nextIntersection = this.blueGhost.path.shift();

    this.orangeGhost.path = this.aStarAlgorithm(startPoint,this.CLYDE_SCATTER_TARGET);
    this.orangeGhost.nextIntersection = this.orangeGhost.path.shift();

    this.redGhost.path = this.aStarAlgorithm(startPoint,this.BLINKY_SCATTER_TARGET);
    this.redGhost.nextIntersection = this.redGhost.path.shift();
  }
  initializeGhosts(layer) {
    this.pinkGhost = this.initializeGhost(232,290,"pinkGhost",layer);
    this.orangeGhost = this.initializeGhost(210,290,"orangeGhost",layer);
    this.redGhost = this.initializeGhost(232,290,"redGhost",layer);
    this.blueGhost = this.initializeGhost(255,290,"blueGhost",layer);
    this.ghosts = [this.pinkGhost,this.orangeGhost,this.redGhost,this.blueGhost];
    this.startGhostEntries();
  }
  startGhostEntries() {
    this.ghosts.forEach((ghost,index)=>{
      setTimeout(()=>{
        this.enterMaze(ghost);
      },this.entryDelay*index);
    });
  }
  enterMaze(ghost) {
    ghost.setPosition(232,280);
    ghost.enteredMaze = true;
  }
  initializeGhost(x,y,spriteKey,layer) {
    const ghost = this.physics.add.sprite(x,y,spriteKey);
    this.physics.add.collider(ghost,layer);
    ghost.direction = "right";
    ghost.previousDirection = "right";
    ghost.nextIntersection = null;
    ghost.enteredMaze = false;
    return ghost;
  }
  isInghostHouse(x,y) {
    if((x<=262 && x>=208) && (y<=288 && y>240))
      return true;
    else return false;
  }
  aStarAlgorithm(start,target) {
    function findNearestIntersection(point,intersections) {
      let nearest = null;
      let minDist = Infinity;
      for(const intersection of intersections) {
        const dist = Math.abs(intersection.x-point.x)+Math.abs(intersection.y-point.y);
        if(dist<minDist) {
          minDist = dist;
          nearest = intersection;
        }
      }
      return nearest;
    }
    const startIntersection = findNearestIntersection(start,this.intersections);
    if(!startIntersection) {
      return[];
    }
    const openList = [];
    const closedList = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    openList.push({node:startIntersection,g:0,f:heuristic(startIntersection,target)});
    gScore.set(JSON.stringify(startIntersection),0);
    function heuristic(node,target) {
      return Math.abs(node.x - target.x)+Math.abs(node.y-target.y);
    }
    while(openList.length>0) {
      openList.sort((a,b)=>a.f-b.f);
      const current = openList.shift().node;
      if(current.x === target.x && current.y === target.y) {
        const path = [];
        let currentNode = current;
        while(cameFrom.has(JSON.stringify(currentNode))) {
          path.push(currentNode);
          currentNode = cameFrom.get(JSON.stringify(currentNode));
        }
        path.push(startIntersection);
        return path.reverse();
      }
      closedList.add(JSON.stringify(current));
      const currentIntersection = this.intersections.find(i=>i.x ===current.x && i.y === current.y);
      if(currentIntersection) {
        for(const direction of currentIntersection.openPaths) {
          const neighbor = this.getNextIntersection(current.x,current.y,direction);
          if(neighbor && !closedList.has(JSON.stringify(neighbor))) {
            const  tentativeGScore = gScore.get(JSON.stringify(current))+1;
            if(!gScore.has(JSON.stringify(neighbor)) || tentativeGScore<gScore.get(JSON.stringify(neighbor))) {
              gScore.set(JSON.stringify(neighbor),tentativeGScore);
              const fScore = tentativeGScore+heuristic(neighbor,target);
              openList.push({node:neighbor,g:tentativeGScore,f: fScore});
              cameFrom.set(JSON.stringify(neighbor),current);
            }
          }
        }
      }
    }
    return [];
  }
  getNextIntersection(currentX,currentY,previousDirection) {
    let filteredIntersections;
    const isUp = previousDirection === "up";
    const isDown = previousDirection === "down";
    const isLeft = previousDirection === "left";
    const isRight = previousDirection === "right";
    filteredIntersections = this.intersections.filter((intersection)=>{
      return(
        ((isUp && intersection.x === currentX && intersection.y<currentY)||
        (isDown && intersection.x === currentX && intersection.y>currentY) ||
        (isLeft && intersection.y === currentY && intersection.x<currentX) ||
        (isRight && intersection.y === currentY && intersection.x>currentX))
      );
    })
    .sort((a,b)=>{
      if(isUp || isDown) {
        return isUp ? b.y-a.y:a.y-b.y;
      } else {
        return isLeft ? b.x-a.x:a.x-b.x;
      }
    });
    return filteredIntersections ? filteredIntersections[0]:null;
  }

  populateBoardAndTrackEmptyTiles(layer) {
    layer.forEachTile((tile)=>{
      if(!this.board[tile.y]) {
        this.board[tile.y] = [];
      }
      this.board[tile.y][tile.x] = tile.index;
      if(tile.y<4 || (tile.y>11 && tile.y<23 && tile.x>6 && tile.x<21) || (tile.y ===17 && tile.x!==6 && tile.x !==21))
        return;
      let rightTile = this.map.getTileAt(tile.x+1,tile.y,true,"Tile Layer 1");
      let bottomTile = this.map.getTileAt(tile.x,tile.y+1,true,"Tile Layer 1");
      let rightBottomTile = this.map.getTileAt(tile.x+1,tile.y+1,true,"Tile Layer 1");
      if(tile.index === -1 && rightTile && rightTile.index === -1 && bottomTile && bottomTile.index === -1 && rightBottomTile && rightBottomTile.index === -1){
        const x = tile.x*tile.width;
        const y = tile.y*tile.height;
        this.dots.create(x+tile.width,y+tile.height,"dot");
      }

    });
  }
  eatDot(pacman,dot) {
    dot.disableBody(true,true);
  }

  detectIntersections() {
    const directions = [
      {x:-this.blockSize,y:0,name:"left"},
      {x:this.blockSize,y:0,name:"right"},
      {x:0,y:-this.blockSize,name:"up"},
      {x:0,y:this.blockSize,name:"down"},     
    ];
    const blockSize = this.blockSize;
    for(let y=0; y<this.map.heightInPixels;y+=blockSize) {
      for(let x=0; x<this.map.widthInPixels;x+=blockSize) {
        if(x%blockSize !==0 || y%blockSize !==0) continue;
        if(!this.isPointClear(x,y)) continue;
        let openPaths = [];
        directions.forEach((dir)=>{
          if(this.isPathOpenAroundPoint(x+dir.x,y+dir.y)) {
            openPaths.push(dir.name);
          }
        });
        if(openPaths.length>2 && y>64 && y<530) {
          this.intersections.push({x:x,y:y,openPaths:openPaths});
        } else if (openPaths.length ===2 && y>64 && y<530) {
           const [dir1,dir2] = openPaths;
           if(((dir1==="left" || dir1 === "right")&&
           (dir2==="up" || dir2 === "down")) ||
           (dir1==="up" || dir1 === "down") &&
           (dir2==="left" || dir2 === "right")) {
            this.intersections.push({x:x,y:y,openPaths:openPaths});
           }
        }
      }
    }
  }

  isPathOpenAroundPoint(pixelX,pixelY) {
    const corners = [
      {x:pixelX-1,y:pixelY-1},
      {x:pixelX+1,y:pixelY-1},
      {x:pixelX-1,y:pixelY+1},
      {x:pixelX+1,y:pixelY+1},
    ];
    return corners.every((corner)=>{
      const tileX = Math.floor(corner.x/this.blockSize);
      const tileY = Math.floor(corner.y/this.blockSize);
      if(!this.board[tileY]|| this.board[tileY][tileX]!==-1) {
        return false;
      }
      return true;
    });
  }
  isPointClear(x,y) {
    const corners = [
      {x:x-1,y:y-1},
      {x:x+1,y:y-1},
      {x:x-1,y:y+1},
      {x:x+1,y:y+1},
    ]; 
    return corners.every((corner)=>{
      const tileX = Math.floor(corner.x/this.blockSize);
      const tileY = Math.floor(corner.y/this.blockSize);
     
      return !this.board[tileY] || this.board[tileY][tileX] === -1;
    });
  }
  update() {

    this.handleDirectionInput();
    this.handlePacmanMovement();
    this.teleportPacmanAcrossWorldBounds();
    if(this.pinkGhost.enteredMaze) {
      this.handleGhostDirection(this.pinkGhost);
      this.handleGhostMovement(this.pinkGhost);
    }
    if(this.orangeGhost.enteredMaze) {
      this.handleGhostDirection(this.orangeGhost);
      this.handleGhostMovement(this.orangeGhost);
    }
    if(this.blueGhost.enteredMaze) {
      this.handleGhostDirection(this.blueGhost);
      this.handleGhostMovement(this.blueGhost);
    }
    if(this.redGhost.enteredMaze) {
      //let chaseStartPoint = {x:232,y:280}
      //ghost.texture.key==="redGhost" 
     
      this.handleGhostDirection(this.redGhost);
      this.handleGhostMovement(this.redGhost);
    }
  }
  
  updateGhostPath(ghost,chaseTarget) {
    let chaseStartPoint = {x:ghost.x,y:ghost.y};
    ghost.path = this.aStarAlgorithm(chaseStartPoint,chaseTarget);
    if(ghost.path.length>0)
      ghost.nextIntersection = ghost.path.shift();
  }

  handleDirectionInput() {
    const arrowKeys = ["left","right","up","down"];
    for (const key of arrowKeys) {
      if(this.cursors[key].isDown && this.direction!== key) {
        this.previousDirection = this.direction;
        this.direction = key;
        this.nextIntersection = this.getNextIntersectionInNextDirection(
          this.pacman.x,this.pacman.y,this.previousDirection,key
        );
        break;
      }
    }
  }

  getNextIntersectionInNextDirection(currentX,currentY,currentDirection,nextDirection) {
    let filteredIntersections;
    const isUp = currentDirection === "up";
    const isDown = currentDirection === "down";
    const isLeft = currentDirection === "left";
    const isRight = currentDirection === "right";
    filteredIntersections = this.intersections.filter((intersection)=>{
      return(
        ((isUp && intersection.x === currentX && intersection.y <= currentY) ||
      (isDown && intersection.x === currentX && intersection.y>=currentY) ||
      (isLeft && intersection.y === currentY && intersection.x<=currentX) ||
    (isRight && intersection.y === currentY && intersection.x >= currentX)) &&
        this.isIntersectionInDirection(intersection,nextDirection)
      );
    })
    .sort((a,b)=>{
      if(isUp || isDown) {
        return isUp ? b.y-a.y : a.y-b.y;
      } else {
        return isLeft ? b.x - a.x : a.x-b.x;
      }
    });
    return filteredIntersections ? filteredIntersections[0]:null;
  }
  isIntersectionInDirection(intersection,direction) {
    switch(direction) {
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

  handlePacmanMovement() {
    let nextIntersectionx =null;
    let nextIntersectiony =null;
    if(this.nextIntersection) {
      nextIntersectionx = this.nextIntersection.x;
      nextIntersectiony = this.nextIntersection.y;
    }
    switch(this.direction) {
      case "left":
        this.handleMovementInDirection("left","right",this.pacman.y,nextIntersectiony,this.pacman.x,true,false,0,-this.speed,0,this.pacman.body.velocity.y);
        break;
       case "right":
          this.handleMovementInDirection("right","left",this.pacman.y,nextIntersectiony,this.pacman.x,true,false,180,this.speed,0,this.pacman.body.velocity.y);
          break;  
        case "up":
          this.handleMovementInDirection("up","down",this.pacman.x,nextIntersectionx,this.pacman.y,false,true,-90,0,-this.speed,this.pacman.body.velocity.x);
          break;    
        case "down":
        this.handleMovementInDirection("down","up",this.pacman.x,nextIntersectionx,this.pacman.y,false,true,90,0,this.speed,this.pacman.body.velocity.x);
        break;        
    }
  }
  handleMovementInDirection(currentDirection,oppositeDirection,pacmanPosition,intersectionPosition,movingCoordinate,flipX,flipY,angle,velocityX,velocityY,currentVelocity) {
    let perpendicularDirection = currentDirection === "left" || currentDirection ==="right" ? ["up","down"] : ["left","right"];
    let condition =false;
    if(this.nextIntersection)
      condition = (this.previousDirection == perpendicularDirection[0] && pacmanPosition <=intersectionPosition) || (this.previousDirection == perpendicularDirection[1] && pacmanPosition >= intersectionPosition) ||
      this.previousDirection === oppositeDirection;
      if(condition) {
        let newPosition = intersectionPosition;
        if(this.previousDirection != oppositeDirection && newPosition !== pacmanPosition) {
          if(currentDirection === "left" || currentDirection === "right")
            this.pacman.body.reset(movingCoordinate,newPosition);
          else this.pacman.body.reset(newPosition,movingCoordinate);
        }
        this.changeDirection(flipX,flipY,angle,velocityX,velocityY);
        this.adjustPacmanPosition(velocityX,velocityY);
      
      } 
      else if (currentVelocity ===0) {
        this.changeDirection(flipX,flipY,angle,velocityX,velocityY);
        this.adjustPacmanPosition(velocityX,velocityY);
      }
  }
  adjustPacmanPosition(velocityX,velocityY) {
    if(this.pacman.x%this.blockSize !==0 && velocityY>0) {
      let nearestMultiple = Math.round(this.pacman.x/this.blockSize)*this.blockSize;
      this.pacman.body.reset(nearestMultiple,this.pacman.y);
    }
    if(this.pacman.y%this.blockSize !==0 && velocityX>0) {
      let nearestMultiple = Math.round(this.pacman.y/this.blockSize)* this.blockSize;
      this.pacman.body.reset(this.pacman.x,nearestMultiple);
    }
  }
 

  changeDirection(flipX,flipY,angle,velocityX,velocityY) {

    this.pacman.setFlipX(flipX);
    this.pacman.setFlipY(flipY);
    this.pacman.setAngle(angle);
    this.pacman.setVelocityY(velocityY);
    this.pacman.setVelocityX(velocityX);
  }
  teleportPacmanAcrossWorldBounds() {
    const worldBounds = this.physics.world.bounds;
    if(this.pacman.x <= worldBounds.x) {
      this.pacman.body.reset(worldBounds.right - this.blockSize,this.pacman.y);
      this.nextIntersection = this.getNextIntersectionInNextDirection(this.pacman.x,this.pacman.y,"left",this.direction);
      this.pacman.setVelocityX(-1*this.speed);
    }
    if(this.pacman.x>=worldBounds.right) {
      this.pacman.body.reset(worldBounds.x+this.blockSize,this.pacman.y);
      this.nextIntersection = this.getNextIntersectionInNextDirection(this.pacman.x,this.pacman.y,"right",this.direction);
      this.pacman.setVelocityX(this.speed);
    }
  }

  handleGhostDirection(ghost) {
    if(this.isInghostHouse(ghost.x,ghost.y)){
      this.changeGhostDirection(ghost,0,-this.speed*0.8);
    }
    if(ghost.body.velocity.x==0 && ghost.body.velocity.y == 0)
      this.adjustGhostPosition(ghost);
    let isAtIntersection = this.isGhostAtIntersection(ghost.nextIntersection,ghost.x,ghost.y,ghost.direction);
    if(isAtIntersection) {
      if((this.PINKY_SCATTER_TARGET.x === ghost.nextIntersection.x) && (this.PINKY_SCATTER_TARGET.y === ghost.nextIntersection.y) && this.currentMode === "scatter")
        return;
      if((this.BLINKY_SCATTER_TARGET.x === ghost.nextIntersection.x) && (this.BLINKY_SCATTER_TARGET.y === ghost.nextIntersection.y) && this.currentMode === "scatter")
        return;
      if((this.INKY_SCATTER_TARGET.x === ghost.nextIntersection.x) && (this.INKY_SCATTER_TARGET.y === ghost.nextIntersection.y) && this.currentMode === "scatter")
        return;
      if((this.CLYDE_SCATTER_TARGET.x === ghost.nextIntersection.x) && (this.CLYDE_SCATTER_TARGET.y === ghost.nextIntersection.y) && this.currentMode === "scatter")
        return;

      if(ghost.texture.key==="redGhost" && this.currentMode == "chase") {
        let chaseTarget = {x:this.pacman.x,y:this.pacman.y};
        this.updateGhostPath(ghost,chaseTarget);      
      }

      if(ghost.path.length>0)
        ghost.nextIntersection = ghost.path.shift();
      let newDirection = this.getGhostNextDirection(ghost,ghost.nextIntersection);
      ghost.previousDirection = ghost.direction;
      ghost.direction = newDirection;
    }
  }
 adjustGhostPosition(ghost) {
  if(ghost.x%this.blockSize!==0){
    let nearestMultiple = Math.round(ghost.x/this.blockSize)*this.blockSize;
    ghost.body.reset(nearestMultiple,ghost.y);
  }  
  if(ghost.y%this.blockSize!==0){
    let nearestMultiple = Math.round(ghost.y/this.blockSize)*this.blockSize;
    ghost.body.reset(ghost.x,nearestMultiple);
  }

 }
 isGhostAtIntersection(intersection,currentX,currentY,direction) {
  const isUp = direction === "up";
  const isDown = direction === "down";
  const isLeft = direction === "left";
  const isRight = direction === "right";
   
  let condition = ((isUp && intersection.x === currentX && intersection.y>=currentY) ||(isDown && intersection.x === currentX && intersection.y<=currentY) || (isLeft && intersection.y === currentY && intersection.x>=currentX) || (isRight && intersection.y === currentY && intersection.x<=currentX) );
  return condition;
 }
 
 getGhostNextDirection(ghost,intersection) {
  if(Math.abs(intersection.x-ghost.x)<this.blockSize && ghost.y<=intersection.y)
    return "down";
  if(Math.abs(intersection.x-ghost.x)<this.blockSize && ghost.y>=intersection.y)
    return "up";
  if(Math.abs(intersection.y-ghost.y)<this.blockSize && ghost.x<=intersection.x)
    return "right";
  if(Math.abs(intersection.y-ghost.y)<this.blockSize && ghost.x>=intersection.x)
    return "left";
 }


  handleGhostMovement(ghost) {
    let nextIntersectionx = null;
    let nextIntersectiony = null;
    if(ghost.nextIntersection) {
      nextIntersectionx = ghost.nextIntersection.x;
      nextIntersectiony = ghost.nextIntersection.y;
    }
    switch(ghost.direction) {
      case "left":
        this.handleGhostMovementInDirection(ghost,"left","right",ghost.y,nextIntersectiony,ghost.x,-this.speed*0.8,0,ghost.body.velocity.y);
        break;
        case "right":
          this.handleGhostMovementInDirection(ghost,"right","left",ghost.y,nextIntersectiony,ghost.x,this.speed*0.8,0,ghost.body.velocity.y);
          break; 
       case "up":
          this.handleGhostMovementInDirection(ghost,"up","down",ghost.x,nextIntersectionx,ghost.y,0,-this.speed*0.8,ghost.body.velocity.x);
          break; 
      case "down":
        this.handleGhostMovementInDirection(ghost,"down","up",ghost.x,nextIntersectionx,ghost.y,0,this.speed*0.8,ghost.body.velocity.x);
        break;      
    }
  }

  handleGhostMovementInDirection(ghost,currentDirection,oppositeDirection,ghostPosition,intersectionPosition,movingCoordinate,velocityX,velocityY,currentVelocity) {
    let perpendicularDirection = currentDirection === "left" || currentDirection === "right" ? ["up","down"]:["left","right"];
    let condition = false;
    if(ghost.nextIntersection)
      condition = (ghost.previousDirection == perpendicularDirection[0] && ghostPosition<=intersectionPosition) || (ghost.previousDirection == perpendicularDirection[1] && ghostPosition>=intersectionPosition) ||(ghost.previousDirection === oppositeDirection);
    if(condition) {
      let newPosition = intersectionPosition;
      if(ghost.previousDirection != oppositeDirection && newPosition !== ghostPosition) {
        if(currentDirection === "left" || currentDirection === "right")
          ghost.body.reset(movingCoordinate,newPosition);
        else ghost.body.reset(newPosition,movingCoordinate);
      }
      this.changeGhostDirection(ghost,velocityX,velocityY);
    }
    else if (currentVelocity === 0) {
      this.changeGhostDirection(ghost,velocityX,velocityY);
    }
  }

changeGhostDirection(ghost,velocityX,velocityY) {
  ghost.setVelocityY(velocityY);
  ghost.setVelocityX(velocityX);
}

getOppositeDirection(direction) {
  switch(direction) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";  
    default:
      return "";
  }
}
getPerpendicularDirection(direction) {
  switch(direction) {
    case "up":
      return "right";
    case "down":
      return "left";
    case "left":
      return "up";
    case "right":
      return "down";  
    default:
      return "";
  }
}

isMovingInxDirection(direction) {
  let result =  (direction === "left" ||direction === "right" ) ? true : false;
  return result;
}


}

 const config = {
  type:Phaser.AUTO,
  width:464,
  height:560,
  parent:"container",
  backgroundColor:"#000000",
  physics:{
    default:"arcade",
    arcade:{
      gravity:{y:0},
      debug: false,
    },
  },
  scene: Pacman,
 };
 const game = new Phaser.Game(config);