import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from './weather.module.scss'


const App = () => {
  const [weather, setWeather] = useState('');
  useEffect(() => {
    async function getData() {
      const url = `https://api.weatherapi.com/v1/current.json?key=fbb146db5af74c31b4b131332220301&q=hyderabad&aqi=yes`;
      const req = await axios.get(url);
      const res = await req;

      let current = res.data.current;
      setWeather({
        temp: current.temp_c,
        sensible: current.feelslike_c,
        text: current.condition.text,
        city: res.data.location.name,
        state: res.data.location.region,
        wind: current.wind_kph,
        pressure: current.pressure_mb,
        humidity : current.humidity
      });
    }
    getData();
  }, [])

  // temp_c
  // condition.text --> clear
  // location.name , region

  // feelslike_c
  // humidity
  // "wind_kph
  //  pressure_mb


  return (
    <div className={styles.weatherCon}>
      <div className={styles.top}>
        <img src={'/rainy-day.png'} alt="" />
        <h1 className={styles.temp}>
          {weather.temp}°
        </h1>
        <span className={styles.location}>
          <h1>{weather?.text}</h1>
          <h2>{weather?.city},{weather?.state}</h2>
        </span>
      </div>
      <div className={styles.bottom}>
        <div className={styles.cell}>
          <h3>{weather.sensible}° C</h3>
          <p>Sensible</p>
        </div>
        <div className={styles.cell}>
          <h3>{weather.humidity}</h3>
          <p>Humidity</p>
        </div>
        <div className={styles.cell}>
          <h3>{weather.wind}</h3>
          <p>Wind</p>
        </div>
        <div className={styles.cell}>
          <h3>{weather.pressure} B</h3>
          <p>Pressure</p>
        </div>
      </div>
    </div>
  );
};

export default App;
