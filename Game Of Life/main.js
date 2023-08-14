const numberOfRows =25;
const numberOfColumns = 60;
const speed = document.getElementById("speed");

let grid = new Array(numberOfRows);
for (let i=0;i<numberOfRows;i++) {
  grid[i] = new Array(numberOfColumns).fill(0);
}

function displayGrid(grid){
  let table = document.getElementById("grid");
  table.innerHTML="";
  for (let x=0;x<numberOfRows;x++){
    let row =document.createElement("tr");
    for (let y=0;y<numberOfColumns;y++){
      let cell = document.createElement("td");
      if(grid[x][y]===1) {
        cell.classList.add("alive");
      }
      cell.addEventListener("click",()=>{
        grid[x][y] = grid[x][y]===1 ? 0 : 1;
        displayGrid(grid);
      });
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

displayGrid(grid);

let intervalId;
document.getElementById("start").addEventListener("click",()=>{
  let animationSpeed = 1000 - speed.value;
  clearInterval(intervalId);
  intervalId = setInterval(()=>{
    grid = updateGrid(grid);
    displayGrid(grid);
  },animationSpeed);
});
function updateGrid(grid) {
  let newGrid = new Array(numberOfRows);
  for(let i=0;i<numberOfRows;i++) {
    newGrid[i] = new Array(numberOfColumns).fill(0);
  }
  for(let x=0;x<numberOfRows;x++){
    for (let y=0;y<numberOfColumns;y++) {
      let liveNeighbors = countLiveNeighbors(grid,x,y);
      if(grid[x][y]===1 && (liveNeighbors ===2 || liveNeighbors ===3)){
        newGrid[x][y] = 1;
      } else if(grid[x][y]===0 && liveNeighbors===3){
        newGrid[x][y] =1;
      }
    }
  }
  return newGrid;
}

function countLiveNeighbors(grid,x,y){
  let count = 0;
  for (let i=-1;i<=1;i++) {
    for(j=-1;j<=1;j++){
      if(i===0 && j===0) continue;
      let row  = (x+i+numberOfRows) % numberOfRows;
      let col = (y+j+numberOfColumns) % numberOfColumns;
      count+=grid[row][col];
    }
  }
  return count;
}

document.getElementById("stop").addEventListener("click",()=>{
  clearInterval(intervalId);
});

document.getElementById("reset").addEventListener("click",()=>{
  clearInterval(intervalId);
  for(let x=0;x<numberOfRows;x++){
    for(let y=0;y<numberOfColumns;y++){
      grid[x][y]=0;
    }
  }
  displayGrid(grid);
});

speed.addEventListener("change",()=>{
  clearInterval(intervalId);
  animationSpeed = 1000 - speed.value;
  intervalId = setInterval(()=>{
    grid = updateGrid(grid);
    displayGrid(grid);
  },animationSpeed);
});





























 