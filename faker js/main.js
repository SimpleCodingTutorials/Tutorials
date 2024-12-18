import {faker} from "https://esm.sh/@faker-js/faker";

const tableBody = document.getElementById("table-body");

function generateTableData() {
  for(let i=0; i<100; i++) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    const lastNameCell = document.createElement("td");
    const emailCell = document.createElement("td");
    const occupationCell = document.createElement("td");
    const experienceCell = document.createElement("td");

    nameCell.textContent = faker.name.firstName();
    lastNameCell.textContent = faker.name.lastName();
    emailCell.textContent = faker.internet.email();
    occupationCell.textContent = faker.name.jobTitle();
    experienceCell.textContent = `${faker.number.int({min:1, max:40})} years`;

    row.appendChild(nameCell);
    row.appendChild(lastNameCell);
    row.appendChild(emailCell);
    row.appendChild(occupationCell);
    row.appendChild(experienceCell);
    
    tableBody.appendChild(row);
  }
}

generateTableData();

























let currentPage = 1;
let rowsPerPage = 10;
let totalPages;
const pageNumbers = document.getElementById("pageNumbers");

function paginateTable() {
  let table = document.getElementById("myTable");
  let rows = Array.from(table.rows).slice(1);
  totalPages = Math.ceil(rows.length/rowsPerPage);

  rows.forEach(row=>row.style.display="none");

  let start = (currentPage - 1) * rowsPerPage;
  let end = start + rowsPerPage;
  rows.slice(start,end).forEach(row=>row.style.display = "");
  pageNumbers.innerHTML = "";
  createPageLink("<<",1);
  createPageLink("<",currentPage-1);

  let startPageNumber = currentPage < 5 ? 1 : (currentPage>totalPages-2?totalPages-4 : currentPage-2);
  let endPageNumber = currentPage<=totalPages -2 ? startPageNumber+4 : totalPages;
  for (let i=startPageNumber;i<=endPageNumber;i++) {
    createPageLink(i,i);
  }
  createPageLink(">",currentPage+1);
  createPageLink(">>",totalPages);

  setActivePageNumber();
  from.innerHTML = (currentPage-1)*rowsPerPage+1;
  to.innerHTML = currentPage === totalPages ? rows.length : (currentPage)*rowsPerPage;
  totalTableEntries.innerHTML = rows.length;

}

paginateTable();

function changePage(e,pageNumber) {
  if((pageNumber == 0)||(pageNumber==totalPages+1)) return;
  e.preventDefault();
  currentPage = pageNumber;
  pageNumberInput.value = "";
  paginateTable();
}

function setActivePageNumber() {
  document.querySelectorAll("#pageNumbers a").forEach(a=>{
    if(a.innerText == currentPage) {
      a.classList.add("active");
    }
  });
}

function createPageLink(linkText,pageNumber) {
  let pageLink = document.createElement("a");
  pageLink.href = "#";
  pageLink.innerHTML = linkText;
  pageLink.addEventListener("click",function(e){
    changePage(e,pageNumber);
  });
  pageNumbers.appendChild(pageLink);
}

goToPageButton.addEventListener("click",(e)=>{
  changePage(e,pageNumberInput.value);
});




















































