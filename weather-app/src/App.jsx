import { useEffect, useState } from "react";
import searchIcon from "./assets/search.png";
import sunny from "./assets/sunny.png";
import cloudIcon from "./assets/cloudy.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rainy.avif";
import windIcon from "./assets/breezy.webp";
import snowIcon from "./assets/snow_flakes.jpg";
import humidityIcon from "./assets/humidity.jpeg";

import "./App.css";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  Latitude,
  Longitude,
  Humidity,
  Wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Image"></img>
      </div>
      <div className="temp">{temp}°C</div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>
      <div className="coord">
        <div className="lat">
          <span>Latitude </span>
          <span className="latSpan">{Latitude}</span>
        </div>
        <div className="long">
          <span>Longitude</span>
          <span className="longSpan">{Longitude}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity"></img>
          <div className="data">
            <div className="humidity-percent">{Humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind"></img>
          <div className="data2">
            <div className="wind-percent">{Wind} km/h</div>
          </div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
    </>
  );
};
function App() {
  const api_key = "de1d8e1c4426a32a2b0370d8b2ae2b05";
  const [icon, setIcon] = useState(sunny);
  const [temp, setTemp] = useState("0");
  const [city, setCity] = useState("Coimbatore");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [hum, setHum] = useState(85);
  const [wind, setWind] = useState(5);
  const [text, setText] = useState("Coimbatore");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const weatherIconMap = {
    "01d": sunny,
    "01n": sunny,
    "02d": sunny,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };
  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === "404") {
        console.error("No city found");
        setCityNotFound(true);
        setLoading(false);
      } else {
        setCity(data.name);
        setLat(data.coord.lat);
        setLong(data.coord.lon);
        setTemp(data.main.temp);
        setHum(data.main.humidity);
        setWind(data.wind.speed);
        setCountry(data.sys.country);
        const weatherIconCode = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || sunny);
        setCityNotFound(false);
      }
    } catch (error) {
      console.error("API is not fetched properly", error);
      setError("An error occured while fetching the data.");
    } finally {
      setLoading(false);
    }
  };
  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("key is pressed");
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);
  return (
    <>
      <div className="container">
        <div className="inner-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          ></input>
          <div className="search-icon">
            <img src={searchIcon} alt="search" onClick={() => search()}></img>
          </div>
        </div>
        {loading && <div className="Loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {cityNotFound && <div className="city-not-found"> City not found</div>}
        {!loading && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            Latitude={lat}
            Longitude={long}
            Humidity={hum}
            Wind={wind}
          ></WeatherDetails>
        )}
      </div>
    </>
  );
}

export default App;
