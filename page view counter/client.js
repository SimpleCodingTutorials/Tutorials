let counterContainer = document.querySelector(".website-counter");
fetch("http://127.0.0.1:3000/count")
.then(response=>response.json())
.then(data=>{
    counterContainer.innerHTML = data.count;
});





















