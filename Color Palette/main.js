const canvas = document.createElement("canvas");
const ctx= canvas.getContext("2d");
const myImage = document.getElementById("myImage");
const xMin = 0,xMax=255;
const yMin = 0,yMax=255;
const zMin = 0,zMax=255;

imageInput.addEventListener("change",function(){
    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        myImage.src = e.target.result;
        let image = new Image();
        image.src = myImage.src;
        image.addEventListener("load",function(){
            generateColorPalette(image);
        })
    }
    reader.readAsDataURL(file);
})

function generateColorPalette(img){
    let colors = getImageColors(img);
    const cubeSize = 110;
    let topDensityCubes = findTopDensityCubes(colors,cubeSize);
    const centersOfMass = topDensityCubes.map(([i,j,k])=>{
        const rMin = i*cubeSize+xMin;
        const rMax = rMin+cubeSize;
        const gMin = j*cubeSize+yMin;
        const gMax = gMin+cubeSize;
        const bMin = k*cubeSize+zMin;
        const bMax = bMin + cubeSize;
        const cubeColors = colors.filter(([r,g,b])=>
            r>=rMin && r<rMax &&
            g>=gMin && g<gMax &&
            b>=bMin && b<bMax
        );
        const sum = cubeColors.reduce(([rSum,gSum,bSum],[r,g,b])=>[
            rSum + r,
            gSum + g,
            bSum + b
        ],[0,0,0]);
        return sum.map(x=>x/cubeColors.length);
    });

    fillColorPalette(centersOfMass);
}

function findTopDensityCubes(colors,cubeSize,n=12){
    const xLength = Math.ceil((xMax-xMin)/cubeSize);
    const yLength = Math.ceil((yMax-yMin)/cubeSize);
    const zLength = Math.ceil((zMax-zMin)/cubeSize);
    const counts = new Array(xLength);
    for (let i=0;i<xLength;i++){
        counts[i] = new Array(xLength);
        for(let j=0;j<yLength;j++){
            counts[i][j] = new Array(zLength).fill(0);
        }
    }
    for (let p=0;p<colors.length;p++){
        const [r,g,b] = colors[p];
        const i= Math.floor((r-xMin)/cubeSize);
        const j= Math.floor((g-yMin)/cubeSize);
        const k= Math.floor((b-zMin)/cubeSize);

        counts[i][j][k]++;
    }
    let indicesAndCounts = [];
    for (let i=0;i<xLength;i++){
        for (let j=0;j<yLength;j++){
            for (let k=0;k<zLength;k++){
                indicesAndCounts.push({index:[i,j,k],count:counts[i][j][k]});
            }
        }
    }
    indicesAndCounts.sort((a,b)=>b.count-a.count);
    return indicesAndCounts.slice(0,n).map(x=>x.index);
}

function getImageColors(img){
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img,0,0);
    const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    const data = imageData.data;
    const imageColors = [];
    for (let i=0;i<data.length;i+=4){
        const r=data[i];
        const g=data[i+1];
        const b = data[i+2];
        imageColors.push([r,g,b]);
    }
    return imageColors;
}

function fillColorPalette(centersOfMass){
    let colorCount = centersOfMass.reduce((acc,rgb)=>acc+rgb.every(value=>isNaN(value)),0);

    for(let i=1;i<=centersOfMass.length;i++){
        let divId = "cluster"+i;
        let div = document.getElementById(divId);
        let color = centersOfMass[i-1];
        div.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;
        div.title = `rgb(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])})`;
        if(isNaN(color[0]))
            div.style.width = "0%";
        else
         div.style.width = (100/(12-colorCount))+"%";
    }
}




















