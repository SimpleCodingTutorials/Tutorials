import React, {useState,useRef,useEffect} from "react";
import "./App.css";

const WeatherApp = () => {
  const [city, setCity] = useState("Rome");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast,setForecast] = useState([]);
  const searchInputRef = useRef();
  const apiKey = "86c96c0df49e4763ab1181753242012";

  useEffect(()=>{
    if(city.trim()) {
      getWeather(city);
      getWeatherForecast(city);
      setCity(city);
    }
  },[city]);
const getWeather = async (city) => {
  const urlCurrent = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  try {
    const response = await fetch(urlCurrent);
    const data = await response.json();
    if(!data.location || data.location.name.toLowerCase() !== city.toLowerCase()){
      setCity("Invalid Location!");
      const weatherInfo = {
        currentTemperature: 0,
        precipitation: `0 mm`,
        humidity: `0%`,
        windSpeed: `0 kph`,
        conditionText: `None`,
        conditionIcon: `https:${data.current.condition.icon}`,
        dayOfWeekStr:`${new Date(data.current.last_updated).toLocaleString('en-US',{
          weekday: 'long', hour: '2-digit', minute: '2-digit'
        })}`,
      };
      setCurrentWeather(weatherInfo);
      return;
    }
    const weatherInfo = {
      currentTemperature: Math.round(data.current.temp_c),
      precipitation: `${data.current.precip_mm} mm`,
      humidity: `${data.current.humidity}%`,
      windSpeed: `${data.current.wind_kph} kph`,
      conditionText: data.current.condition.text,
      conditionIcon: `https:${data.current.condition.icon}`,
      dayOfWeekStr:`${new Date(data.current.last_updated).toLocaleString('en-US',{
        weekday: 'long', hour: '2-digit', minute: '2-digit'
      })}`,
    };
    setCurrentWeather(weatherInfo);
  } catch (error) {
    console.error(`There was a problem with me the fetch operation: ${error.message}`);
  }
};

const getWeatherForecast = async (city) => {
  const urlForecast = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;
  try {
    const response = await fetch(urlForecast);
    const data = await response.json();
    if(!data.location || data.location.name.toLowerCase() !== city.toLowerCase()) {
      setCity("Invalid Location!");
      const forecastData = data.forecast.forecastday.map((day)=> {
        return {
          dayOfWeekStr: new Date(day.date).toLocaleString('en-US', {weekday: 'long'}),
          conditionIcon: `https:${day.day.condition.icon}`,
          conditionText: 'None',
          maxTemp: 0,
          minTemp: 0,
          precipitation: `0 mm`,
          windSpeed: `0 kph`,
          humidity: `0%`,
        }
      });
      setForecast(forecastData);
      return;
    }
    const forecastData = data.forecast.forecastday.map((day)=> {
      return {
        dayOfWeekStr: new Date(day.date).toLocaleString('en-US', {weekday: 'long'}),
        conditionIcon: `https:${day.day.condition.icon}`,
        conditionText: `${day.day.condition.text}`,
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        precipitation: `${day.day.daily_chance_of_rain} mm`,
        windSpeed: `${day.day.maxwind_kph} kph`,
        humidity: `${day.day.avghumidity}%`,
      }
    });
    setForecast(forecastData);
  } catch (error) {
    console.log(`There was a problem with the fetch operation: ${error.message}`);
  }
};

   const handleSearch = (event) => {
    if(event.key === "Enter") {
      const city = searchInputRef.current.value;
      setCity(city);
    }
   };

   const showDailyForecastDetails = (weatherInfo,city) => {
    weatherInfo.currentTemperature = Math.round((weatherInfo.minTemp + weatherInfo.maxTemp)/2);
    setCity(city);
    setCurrentWeather(weatherInfo);
   };

   return (
    <div className="container">
      <div className="searchContainer">
        <input 
          id="search"
          type="search"
          ref = {searchInputRef}
          onKeyDown={handleSearch}
          placeholder="Search for cities"
        />
      </div>
      { currentWeather && (
        <div className="currentForecastContainer">
          <div>
            <div id="cityName">{city}</div>
            <div className="currentForecastDate">
            <div id="condition">{currentWeather.conditionText}</div>
            <div id="today">{currentWeather.dayOfWeekStr}</div>
            </div>
            <div className="currentForecast">
              <span id="dayTemperature">{currentWeather.currentTemperature}°</span>
            </div>
          </div>
          <div className="currentIconContainer">
            <img id="currentIcon" src={currentWeather.conditionIcon} alt="weather" />
          </div>
        </div>
      )}
      <div className="dailyForecastContainer">
        {forecast.map((day,index)=>(
          <div
           key={index}
           className={`dailyForecast ${index === forecast.length - 1 ? 'lastForecast' : ''}`}
           onClick={()=> showDailyForecastDetails(day,city)}
          >
          <div className="weekday">{day.dayOfWeekStr.substring(0,3)}
          </div>
          <div>
            <img id="currentIcon" src={day.conditionIcon} alt="weather" />
          </div>
          <div className="maxMinTemp">
             <span className="temp">{day.maxTemp}°</span>
             <span className="temp">{day.minTemp}°</span>
          </div>
          </div>
        ))}
      </div>
      <div className="airConditions">
        <div className="airConditionsLabel">Air Conditions</div>
        {currentWeather && <div className="currentConditions">
            <div> Precipitation
              <div>
                {currentWeather.precipitation}
              </div>
            </div>
            <div> Humidity
              <div>
                {currentWeather.humidity}
              </div>
            </div>
            <div> Wind
              <div>
                {currentWeather.windSpeed}
              </div>
            </div>
          </div>}
      </div>
    </div>
   );
};




























export default WeatherApp;
