function sortTable(n,th) {
  const table = document.getElementById("myTable");
  const direction = table.dataset.sortDirection || "asc";
  const sortedRows = Array.from(table.rows)
  .slice(1)
  .sort((rowA,rowB)=>{
    const comparison = rowA.cells[n].innerText > rowB.cells[n].innerText ? 1 : -1;
    return direction === "asc" ? comparison : -comparison;
  });
  sortedRows.forEach(row => table.appendChild(row));
  table.dataset.sortDirection = direction === "asc" ? "desc" : "asc";
  Array.from(table.getElementsByTagName("th")).forEach(header=>{
    header.innerText = header.innerText.replace(" ▼","").replace(" ▲","");
  });
  th.innerText += direction === "asc" ? " ▼" : " ▲";
}



