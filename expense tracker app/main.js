document.getElementById("expense-form").addEventListener("submit",function(e){
  e.preventDefault();
  const expenseName = document.getElementById("expense-name").value;
  const expenseAmount =parseFloat(document.getElementById("expense-amount").value);
  const expenseDate = document.getElementById("expense-date").value;

  if(expenseName && !isNaN(expenseAmount) && isValidDate(expenseDate)) {
    addExpense(expenseName,expenseAmount,expenseDate);
    clearForm();
  } else {
    if(!expenseName) {
      showTooltip("Expense name is required.",document.getElementById("expense-name"));
    }
    if(isNaN(expenseAmount)) {
      showTooltip("Please enter a valid amount.",document.getElementById("expense-amount"));
    }
    if(!isValidDate(expenseDate)) {
      showTooltip("Please enter a valid date.",document.getElementById("expense-date"));
    }
  }
});

function addExpense(name,amount,date) {
  const expenseList = document.getElementById("expense-list");
  const row = document.createElement("tr");
  const nameCell = document.createElement("td");
  nameCell.textContent = name;
  nameCell.addEventListener("click",function(){
    editCell(nameCell);
  });
  row.appendChild(nameCell);
  const amountCell = document.createElement("td");
  amountCell.textContent = `$${amount}`;
  amountCell.addEventListener("click",function(){
    editCell(amountCell);
  });
  row.appendChild(amountCell);
  const dateCell = document.createElement("td");
  dateCell.textContent = date;
  dateCell.addEventListener("click",function(){
    editCell(dateCell);
  });
  row.appendChild(dateCell);

  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click",function(){
    deleteExpense(row);
  });
  deleteCell.appendChild(deleteButton);
  row.appendChild(deleteCell);

  expenseList.appendChild(row);
  updateTotal(amount);
}

function editCell(cell) {
  if (cell.isEditing) return; // Prevent adding multiple listeners

  const oldValue = cell.textContent;
  cell.contentEditable = true;
  cell.focus();
  cell.isEditing = true;
  cell.addEventListener('blur', function handleBlur() {
      cell.contentEditable = false;
      const newValue = cell.textContent;
      if (cell.cellIndex === 1) { // Amount cell
          const oldAmount = parseFloat(oldValue.replace('$', ''));
          //const newAmount = parseFloat(newValue.replace('$', ''));
          const newAmount = (newValue.replace('$', ''));
          if (!isNaN(newAmount)) {
              updateTotal(newAmount - oldAmount);
              cell.textContent = `$${newAmount}`;
              removeTooltip(cell);
          } else {
              cell.textContent = oldValue;
              showTooltip('Please enter a valid amount.', cell);
          }
      } else if (cell.cellIndex === 2) { // Date cell
          if (isValidDate(newValue)) {
              cell.textContent = newValue;
              removeTooltip();
          } else {
            cell.textContent = oldValue;
          showTooltip('Please enter a valid date.', cell);
        }
      }
      cell.isEditing = false;
      cell.removeEventListener('blur', handleBlur);
  },{ once: true });
}

function deleteExpense(row) {
  const amountCell = row.cells[1];
  const amount = parseFloat(amountCell.textContent.replace("$",""));
  row.remove();
  updateTotal(-amount);
}

function updateTotal(amount) {
  const totalAmount = document.getElementById("total-amount");
  totalAmount.textContent = (parseFloat(totalAmount.textContent)+amount).toFixed(2);
}

function clearForm() {
  document.getElementById("expense-name").value = "";
  document.getElementById("expense-amount").value = "";
  document.getElementById("expense-date").value = "";
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function showTooltip(message,element) {
  let tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.innerHTML ='<i class="fa-solid fa-circle-exclamation"></i>'+message;
  document.body.appendChild(tooltip);
  const rect = element.getBoundingClientRect();
  tooltip.style.left = `${rect.left+window.scrollX}px`;
  tooltip.style.top = `${rect.bottom+window.scrollY + 5}px`;
  setTimeout(()=>{
    tooltip.remove();
  },3000);
}


function removeTooltip() {
  const tooltip = document.querySelector(".tooltip");
  if(tooltip) {
    tooltip.remove();
  }
}



















