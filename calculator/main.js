let isEqualClicked = false;
let isOperationClicked = false;
let displayValue = "";

function appendToDisplay(value) {
  if(isEqualClicked && !isNaN(value))
    displayValue="";
  isEqualClicked = false;

  if(["+","-","*","/"].includes(value) && displayValue !== "" && !["+","-","*","/"].includes(displayValue.slice(-1))|| (displayValue === "" && value=="-")|| (value=="-" && displayValue.slice(-1)!="-")){
    displayValue+= value;
    document.getElementById("display").value = displayValue;
  }
  if(value === "%" && !isNaN(displayValue.slice(-1)) && displayValue !== "") {
    displayValue+= value;
    document.getElementById("display").value = displayValue;
  }
  if(value === ".") {
    const isLastCharacterNumber = displayValue !== "" && !isNaN(displayValue.slice(-1));
    const parts = displayValue.split(".");
  const hasArithmeticOperator = parts.length > 1 && !parts[parts.length-1].match(/[+\-*/]/);
   if(isLastCharacterNumber && !hasArithmeticOperator) {
    displayValue+= value;
    document.getElementById("display").value = displayValue;
   }
  }
  if(!isNaN(value)) {
    const lastTwoChars = displayValue.slice(-2);
    const lastChar = displayValue.slice(-1);
    if(!["+0","-0","*0","/0"].includes(lastTwoChars) && !(displayValue === "0") && lastChar !="%") {
      displayValue+= value;
      document.getElementById("display").value = displayValue;
    }
  }
}

function clearDisplay() {
  displayValue = "";
  document.getElementById("display").value = "";
}

function backspace() {
  displayValue = displayValue.slice(0,-1);
  document.getElementById("display").value = displayValue;
}

function calculate() {
  try {
    if(/[+\-*\/]$/.test(displayValue) || displayValue.length === 0)
     return;
    displayValue = displayValue.replace(/%/g,'*0.01');
    let result = eval(displayValue).toFixed(10);
    result = parseFloat(result);
    document.getElementById("display").value = result;
    displayValue = result.toString();
    isEqualClicked = true;
  } catch(error) {
    document.getElementById("display").value = "Error";
    displayValue = "";
  }
}
























