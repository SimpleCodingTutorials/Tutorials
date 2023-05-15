conversionFactors={
  meter:1,
  yard:1.09361,
  foot:3.28084,
  inch:39.3701,
  mile:0.000621371
}
function convertLength(value,unit) {

  let result={};
  let meters=value/conversionFactors[unit];
  for (let key in conversionFactors){
    if(unit!=conversionFactors[key])
      result[key]=meters*conversionFactors[key];
  }

  return result;
}
 
function convert(unit) {
  let value = document.getElementById(unit).value;
  let result = convertLength(value,unit);
  for (let key in conversionFactors) {
      if(key!=unit) {
        let rounded=result[key];
        rounded =(key!="mile")? result[key].toFixed(4) : rounded;
        rounded = (rounded == Math.round(rounded)) ? Math.round(rounded):rounded;
        document.getElementById(key).value=rounded;
      }
  }

}
function reset() {
  for (let key in conversionFactors) {
    document.getElementById(key).value="";
}
}

const numberInputs = document.querySelectorAll('input[type=number]');
numberInputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
        if (e.key === '-') {
            e.preventDefault();
        }
    });
});
    
        