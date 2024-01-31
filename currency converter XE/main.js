const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const apiKey = "1k4rn26v6habcfh6756mfl8ep68";
const accountID = "bkdg15547547547";
let fromCurrency = "AED";
let toCurrency ="AED";
let toValue = 1;
let fromValue =1;
let exchangeRate = 1;

populateCurrencies();

async function populateCurrencies() {
  const url = `https://xecdapi.xe.com/v1/currencies.json/?obsolete=true`; 
  try{
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountID}:${apiKey}`) // Replace `accountID` and `apiKey` with your actual account ID and API key
      }
    });
    const data  = await response.json();
    const currencies = data.currencies;
    for (const currency in currencies) {
      const optionFrom = document.createElement("option");
      optionFrom.text = `${currencies[currency].iso} - ${currencies[currency].currency_name}`;
      optionFrom.value = currencies[currency].iso;
      selectFrom.add(optionFrom);
      const optionTo = document.createElement("option");
      optionTo.text = `${currencies[currency].iso} - ${currencies[currency].currency_name}`;
      optionTo.value = currencies[currency].iso;
      selectTo.add(optionTo);
    }
  }
  catch(error) {
    console.error(`Error: ${error}`);
  }
}

async function convertCurrency(fromCurrency, toCurrency, amount) {
  let isAmountZero = false;
  if(amount === "0" || amount === "") {
    amount = 1;
    isAmountZero = true;
  }
  const url = `https://xecdapi.xe.com/v1/convert_from.json/?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`; // Replace with your desired URL
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountID}:${apiKey}`) // Replace `accountID` and `apiKey` with your actual account ID and API key
      }
    });
    const data = await response.json();
    const convertedAmount = (isAmountZero) ? 0 : data.to[0];
    const rate = amount / data.to[0];
    return {convertedAmount: convertedAmount, rate: rate};
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
    toInput.value = fromInput.value === "" ? "" : result.convertedAmount.mid;
    exchangeRate =fromInput.value === "" ? result.convertedAmount.mid:fromInput.value/toInput.value;
  });
});

selectTo.addEventListener("change",function(event){
  toCurrency = selectTo.value;
  fromValue = fromInput.value === "" ? 1 : fromInput.value;
  convertCurrency(fromCurrency,toCurrency,fromValue)
  .then(result=>{
    toInput.value = fromInput.value === "" ? "" : result.convertedAmount.mid;
    exchangeRate =fromInput.value === "" ? result.convertedAmount.mid:fromInput.value/toInput.value;
  });
});


























