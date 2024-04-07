const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const apiKey = "1f1mn26v6hbkppm689mfl8epo7";
let fromCurrency = "AED";
let toCurrency ="AED";
let toValue = 1;
let fromValue =1;
let exchangeRate = 1;

populateCurrencies();

async function populateCurrencies() {
  const url = `http://api.currencylayer.com/list?access_key=${apiKey}`;
  try{
    const response = await fetch(url);
    const data  = await response.json();
    const currencies = data.currencies;
    for (const currency in currencies) {
      const optionFrom = document.createElement("option");
      optionFrom.text = `${currency} - ${currencies[currency]}`;
      optionFrom.value = currency;
      selectFrom.add(optionFrom);
      const optionTo = document.createElement("option");
      optionTo.text = `${currency} - ${currencies[currency]}`;
      optionTo.value = currency;
      selectTo.add(optionTo);
    }
  }
  catch(error) {
    console.error(`Error: ${error}`);
  }
}

async function convertCurrency(fromCurrency,toCurrency,amount) {
  let isAmountZero = false;
  if(amount ==="0" || amount ==="") {
    amount =1;
    isAmountZero = true;
  }
  const url =`http://api.currencylayer.com/convert?access_key=${apiKey}&from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const convertedAmount = (isAmountZero) ? 0 : data.result;
    const rate = amount/data.result;
    return {convertedAmount:convertedAmount,rate:rate};
  }
  catch(error) {
    console.error(`Error: ${error}`);
  }
}

fromInput.addEventListener("input",(event)=>{ 
  fromValue = event.target.value;
  toInput.value = fromValue === "" ? "" : fromValue/exchangeRate;
});

toInput.addEventListener("input",(event)=>{ 
  toValue = event.target.value;
  fromInput.value = toValue === "" ? "" : toValue*exchangeRate;
});

selectFrom.addEventListener("change",function(event){
  fromCurrency = selectFrom.value;
  fromValue = fromInput.value === "" ? 1 : fromInput.value;
  convertCurrency(fromCurrency,toCurrency,fromValue)
  .then(result=>{
    toInput.value = fromInput.value == "" ? "" : result.convertedAmount;
    exchangeRate = result.rate;
  });
});

selectTo.addEventListener("change",function(event){
  toCurrency = selectTo.value;
  fromValue = fromInput.value === "" ? 1 : fromInput.value;
  convertCurrency(fromCurrency,toCurrency,fromValue)
  .then(result=>{
    toInput.value = fromInput.value == "" ? "" : result.convertedAmount;
    exchangeRate = result.rate;
  });
});


























