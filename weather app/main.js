const dailyForcastContainer = document.querySelector(".dailyForcastContainer");
const searchButton =document.getElementById("searchButton");
const searchBox =document.getElementById("search");

searchButton.addEventListener("click",function(){
  city = searchBox.value;
  getWeather(city);
  getWeatherForecast(city);
});

function getWeather(city) {
  const urlCurrent = `http://api.weatherapi.com/v1/current.json?key=563bbe88b0a6427c8fb100901231909&q=${city}`;

  fetch (urlCurrent).then (response=>{
    if(!response.ok) {
      showAlert("Invalid Location!");
      throw new Error (`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data=>{
    let weatherInfo = {};
    weatherInfo.currentTemperature =Math.round(data.current.temp_c);
    weatherInfo.precipitation =data.current.precip_mm+" mm";
    weatherInfo.humidity = data.current.humidity;
    weatherInfo.windSpeed = data.current.wind_kph;
    weatherInfo.conditionText = data.current.condition.text;
    weatherInfo.conditionIcon = "https:"+data.current.condition.icon;
    let date = new Date(data.current.last_updated);
    let hour = date.getHours();
    let minute = date.getMinutes();
    minute = (minute<10) ? "0"+minute : minute;
    let dayOfWeekNum = date.getDay();
    let daysOfWeekArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let dayOfWeekStr = daysOfWeekArray[dayOfWeekNum];
    dayOfWeekStr += " "+hour+":"+minute;
    weatherInfo.dayOfWeekStr =dayOfWeekStr;
    showDailyForcastDetails(weatherInfo,city);
  })
  .catch(error=>console.log(`There was a problem with fetch operation`+error.message));
}


function getWeatherForecast(city){
  const urlForecast =`http://api.weatherapi.com/v1/forecast.json?key=563bbe88b0a6427c8fb100901231909&q=${city}&days=7`;
  dailyForcastContainer.innerHTML="";
  fetch(urlForecast)
  .then (response=>{
    if(!response.ok){
      showAlert("Invalid Location!");
      throw new (`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data=>{
    data.forecast.forecastday.forEach(day=>{
      let weatherInfo ={};
      weatherInfo.currentTemperature = Math.round(day.day.avgtemp_c);
      weatherInfo.conditionIcon = "https:"+day.day.condition.icon;
      let date = new Date(day.date);
      let dayOfWeekNum = date.getDay();
      weatherInfo.precipitation = day.day.daily_chance_of_rain+"%";
      weatherInfo.windSpeed = day.day.maxwind_kph;
      weatherInfo.humidity =  day.day.avghumidity;
      weatherInfo.conditionText =  day.day.condition.text;
      weatherInfo.minTemp = Math.round(day.day.mintemp_c);
      weatherInfo.maxTemp = Math.round(day.day.maxtemp_c);
      let daysOfWeekArray =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      weatherInfo.dayOfWeekStr = daysOfWeekArray[dayOfWeekNum];
      let dailyForcastHtml = generateDailyForcastHTML(weatherInfo,city);
      dailyForcastContainer.appendChild(dailyForcastHtml);
    });
 })
 .catch(error=>console.log(`There was a problem with the fetch operation`+error.message));
}

function generateDailyForcastHTML(weatherInfo,city) {
  let div = document.createElement("div");
  div.className = "dailyForcast";

  let weekdayDiv = document.createElement("div");
  weekdayDiv.className = "weekday";
  weekdayDiv.textContent = weatherInfo.dayOfWeekStr.substring(0,3);
  div.appendChild(weekdayDiv);

  let imageDiv = document.createElement("div");
  let img = document.createElement("img");
  img.id = "currentIcon";
  img.src = weatherInfo.conditionIcon;
  imageDiv.appendChild(img);
  div.appendChild(imageDiv);
  
  let maxMinTempDiv = document.createElement("div");
  maxMinTempDiv.className = "maxMinTemp";

  let tempSpan1 = document.createElement("span");
  tempSpan1.className = "temp";
  tempSpan1.textContent = weatherInfo.maxTemp+"°";
  maxMinTempDiv.appendChild(tempSpan1);
  let tempSpan2 = document.createElement("span");
  tempSpan2.className = "temp";
  tempSpan2.textContent = weatherInfo.minTemp+"°";
  maxMinTempDiv.appendChild(tempSpan2);

  div.appendChild(maxMinTempDiv);
  div.addEventListener("click",function(){
    showDailyForcastDetails(weatherInfo,city);
  });
  return div;
}

function showDailyForcastDetails (weatherInfo,city) {
  dayTemperature.innerHTML = weatherInfo.currentTemperature;
  precipitation.innerHTML = weatherInfo.precipitation;
  humidity.innerHTML = weatherInfo.humidity+"%";
  wind.innerHTML = weatherInfo.windSpeed+" kph";
  condition.innerHTML = weatherInfo.conditionText;
  today.innerHTML = weatherInfo.dayOfWeekStr;
  cityName.innerHTML = city;
  document.getElementById("currentIcon").src = weatherInfo.conditionIcon;
}



































  function showAlert(message) {
    const alert= document.getElementById("alert");
    alert.innerHTML = message;
    alert.style.display="flex";

    setTimeout(function(){
         alert.style.display="none";
    },1000);
}