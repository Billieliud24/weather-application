document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#cityInput");
  const searchButton = document.querySelector("#searchButton");
  const weatherIcon = document.querySelector(".weather-icon");
  const apiUrl = "https://api.open-meteo.com/v1/forecast";
  const favoriteCities = document.getElementById("favoriteCities"); // TODO: Sebbe testar
  
  function storedCityToLocalStorage(cityName) {
    const cities = JSON.parse(localStorage.getItem("favoriteCities")) ||[];
    if (!cities.includes(cityName)) {
        cities.push(cityName);
      localStorage.setItem(
        "favoriteCities",
        JSON.stringify(cities)
      );
    } 
    diplayFavoriteCites();
  } 

  function diplayFavoriteCites(){
    const cities= JSON.parse(localStorage.getItem("favoriteCities")) || [];
    favoriteCities.innerHTML="";
    cities.forEach((city) => {
        const cityElement = document.createElement("span");
        cityElement.textContent = city;
        cityElement.classList.add("favorite-city");
        cityElement.style.cursor = "pointer";
        cityElement.style.display = "block";
        cityElement.addEventListener("click", () => fetchCoordinates(city)); 
        favoriteCities.appendChild(cityElement);
  
  });
}

  async function getWeather(lat, lon, cityName) {
    const url = `${apiUrl}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("fetch data;", data);

      if (data.current_weather) {
        displayWeather(data.current_weather, cityName);
        storedCityToLocalStorage(cityName);
        searchInput.value="";
      } else {
        showError("weather data not available for this city.");
      }
    } catch (error) {
        console.error("error ocured:",error)
      showError("An error occurred while fetching weather data.");
    }
  }

  function displayWeather(weatherData, cityName) {
    document.querySelector(".city").textContent = cityName;
    document.querySelector(".temp").textContent = `${Math.round(
      weatherData.temperature
    )}°C`;
    document.querySelector(
      ".wind"
    ).textContent = `${weatherData.windspeed} km/h`;
    document.querySelector(
      ".relative_humidity"
    ).textContent = `${weatherData.relative_humidity} %`;

    // hämtar data från weathercode
    const weatherCode = weatherData.weathercode;
    if (weatherCode >= 3) {
      weatherIcon.src = "images/cloudy.png";
    } else if (weatherCode == 61) {
      weatherIcon.src = "images/rainy.png";
    } else if (weatherCode == 51) {
      weatherIcon.src = "images/drizzle.png";
    } else if (weatherCode == 45) {
      weatherIcon.src = "images/mist.png";
    } else if (weatherCode == 71) {
      weatherIcon.src = "images/snow.png";
    } else if (weatherCode == 0) {
      weatherIcon.src = "images/sol.png";
    } else {
      weatherIcon.src = "images/unknown.png";
    }
  }
  function showError(message) {
    alert(message)
  }

  async function fetchCoordinates(cityName) {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      cityName
    )}`;

    try {
      const response = await fetch(nominatimUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        if(lat &&lon){
            getWeather(lat, lon, cityName);
           
        }else{
            showError("invalid coordinates")
        }
      
      } else {
        showError("City not found (404)");
      }
    } catch (error) {
      showError("An error occurred while fetching city coordinates.");
    }
  }

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const city = searchInput.value.trim();
      if (city) {
        fetchCoordinates(city);
      } else {
        showError("Please enter a city name.");
      }
    });
  } diplayFavoriteCites();
    
})
