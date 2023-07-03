const celsiusInput = document.getElementById("celsius");
const fahrenheitInput = document.getElementById("fahrenheit");
const kelvinInput = document.getElementById("kelvin");

celsiusInput.addEventListener("input",function(){
  const celsius = parseFloat(celsiusInput.value);
  const fahrenheit = celsius * (9/5) + 32;
  const kelvin = celsius+273.15;
  fahrenheitInput.value = fahrenheit;
  kelvinInput.value = kelvin;
});
fahrenheitInput.addEventListener("input",function(){
  const fahrenheit = parseFloat(fahrenheitInput.value);
  const celsius = (fahrenheit-32)*(5/9);
  const kelvin = celsius+273.15;
  celsiusInput.value=celsius;
  kelvinInput.value = kelvin;
});
kelvinInput.addEventListener("input",function(){
  const kelvin = parseFloat(kelvinInput.value);
  const celsius = kelvin-273.15;
  const fahrenheit = celsius*(9/5)+32;
  celsiusInput.value=celsius;
  fahrenheitInput.value = fahrenheit;
});


