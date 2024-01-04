const fromBase =document.getElementById("fromBase");
const toBase =document.getElementById("toBase");

fromBaseNumber.addEventListener("input",function(e){
  let inputValue = e.target.value;
  let selectedFromBase = fromBase.value;
  let selectedToBase = toBase.value;

  let isValid = isNumberValid(inputValue,selectedFromBase);
  if(!isValid) {
    inputValue = inputValue.slice(0,-1);
    e.target.value = inputValue;
  }
  if((inputValue==="" || (!isValid && inputValue.length ===0))) {
    toBaseNumber.value = "";
    return;
  }
  toBaseNumber.value = convertBase(inputValue,selectedFromBase,selectedToBase);
});

fromBase.addEventListener("change",function(){
  fromBaseNumber.value = "";
  toBaseNumber.value = "";
})
toBase.addEventListener("change",function(){
  fromBaseNumber.value = "";
  toBaseNumber.value = "";
})

function convertBase (value,fromBase,toBase) {
   let decimalValue = parseInt(value,fromBase);
   return decimalValue.toString(toBase);
}

function isNumberValid(value,fromBase) {
  if(value=="") return false;
  let validChars = "0123456789ABCDEF".substring(0,fromBase);
  for (let i=0; i<value.length;i++) {
    if(validChars.indexOf(value[i].toUpperCase())=== -1) {
      return false;
    }
  }
  return true;
}



















