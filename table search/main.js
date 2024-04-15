let currentPage = 1;
let rowsPerPage = 10;
let totalPages;
const pageNumbers = document.getElementById("pageNumbers");

let table = document.getElementById("myTable");
let rows = Array.from(table.rows).slice(1);
function paginateTable() {
  totalPages = Math.ceil(rows.length/rowsPerPage);
  let allRows =Array.from(table.rows).slice(1);
  allRows.forEach(row=>row.style.display="none");
  rows.forEach(row=>row.style.display="none");

  let start = (currentPage - 1) * rowsPerPage;
  let end = start + rowsPerPage;
  rows.slice(start,end).forEach(row=>row.style.display = "");
  pageNumbers.innerHTML = "";
  createPageLink("<<",1);
  createPageLink("<",currentPage-1);

  let startPageNumber = currentPage < 5 ? 1 : (currentPage>totalPages-2?totalPages-4 : currentPage-2);
 
  let endPageNumber =totalPages<5 ? totalPages : (currentPage<=totalPages -2 ? startPageNumber+4 : totalPages);

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

let clonedTable = table.cloneNode(true);

function exportTable() {
  if(formatSelect.value == 1)
    exportTableToExcel();
  if(formatSelect.value == 2)
    saveDocx(); 
  if(formatSelect.value == 3)
    downloadPDF();
}

function exportTableToExcel() {
  TableToExcel.convert(clonedTable,{
    name: "export.xlsx",
    sheet: {
      name: "Sheet 1"
    }
  });
}

function saveDocx() {
  let headers = Array.from(clonedTable.tHead.rows[0].cells);
  headers.forEach(header => {
    header.style.textAlign = "left";
    header.style.width = "150px";
  });
  let rows = Array.from(clonedTable.rows).slice(1);
  rows.forEach(row=>row.style.display = "");
  let content = clonedTable.outerHTML;
  let converted = htmlDocx.asBlob(content);
  saveAs(converted,"document.docx");
}

window.jsPDF = window.jspdf.jsPDF;

function downloadPDF() {
  let doc = new jsPDF("l","pt","a4");
  doc.autoTable({
    html: clonedTable,
    styles: {
      fillColor: [219,212,211]
    },
    alternateRowStyles: {
      fillColor:"#f1f1f1"
    },
    headStyles: {
      fillColor:"#3A3335"
    }
  });
  doc.save("table.pdf");
}

filterTableInput.addEventListener("input",function(event){
  let selectedOptionText = columnSelect.options[columnSelect.selectedIndex].text;
  filterTable(selectedOptionText,event.target.value);
});


function filterTable(columnName,value) {
  let allRows = Array.from(table.rows).slice(1);
  let columnIndex;
  Array.from(table.rows[0].cells).forEach((cell,index)=>{
    if(cell.innerText === columnName) {
      columnIndex = index;
    }
  });
  rows = allRows.filter(row => row.cells[columnIndex].innerText.toLowerCase().includes(value.toLowerCase()));

  currentPage =1;
  paginateTable();
  for(let i = clonedTable.rows.length-1;i>0;i--) {
    clonedTable.deleteRow(i);
  }
  rows.forEach((row,index)=>{
    let clonedRow = row.cloneNode(true);
    if(index%2 ===0) {
      row.style.backgroundColor = "whitesmoke";
    } else {
      row.style.backgroundColor = "#DBD4D3";
    }
    clonedTable.appendChild(clonedRow);
  });
}
















































