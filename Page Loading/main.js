const pageLoader = document.getElementById("gifLoader");
const pageDiv = document.getElementById("mainDiv");

window.onload = function () {
    setTimeout(pageLoad,3000);
}

function pageLoad() {
    pageLoader.style.visibility="hidden";
    pageLoader.style.opacity = 0;
    pageDiv.style.display = "inherit";
    setTimeout(hideLoader,1000);
}

function hideLoader() {
    pageLoader.style.display="none";
    pageDiv.style.visibility="visible";
    pageDiv.style.opacity =1;
}