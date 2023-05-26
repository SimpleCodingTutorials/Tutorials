const slider = document.querySelector(".slider");

//This function switches the dark class on and off for all page elements
slider.addEventListener("click",function(){
    document.body.classList.toggle("dark");
    document.querySelector("h1").classList.toggle("dark");
    document.querySelector("h3").classList.toggle("dark");
    document.querySelector("nav").classList.toggle("dark");
    document.querySelector("header").classList.toggle("dark");
    document.querySelector("footer").classList.toggle("dark");
    const liElements = document.getElementsByTagName("li");
    toggleClass(liElements);
    const aElements = document.getElementsByTagName("a");
    toggleClass(aElements);
    slider.classList.toggle("dark");
})

//This function toggles the dark class for the specified elements on and off
function toggleClass(elements) {
    for (var i=0;i<elements.length;i++) {
        elements[i].classList.toggle("dark");
    }
}