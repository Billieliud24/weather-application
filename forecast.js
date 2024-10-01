async function getCoordinates(cityName) {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;

    try {
        const response = await fetch(nominatimUrl);
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            fetchWeather(lat, lon, cityName); 
        } else {
            alert("coud not find city name.");
        }
    } catch (error) {
        alert("an error occured when u fetching geocoordinate.");
    }
}


function fetchWeather(lat, lon, cityName) {
    const fetchApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`;

    fetch(fetchApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            const dates = data.daily.time;
            const maxTemps = data.daily.temperature_2m_max;
            const minTemps = data.daily.temperature_2m_min;
            const precipitation = data.daily.precipitation_sum;
            const weatherCodes = data.daily.weathercode; 

            // Välj elementet där datan ska visas
            const forecastContainer = document.getElementById('forecast');
            
            forecastContainer.innerHTML = '';
            forecastContainer.innerHTML += `<h3>7-dagars prognos för ${cityName}</h3>`;

            // Loop genom datan och skapa en prognosvisning
            for (let i = 0; i < dates.length; i++) {
                // Bestäm vilken ikon som ska visas baserat på väderkoden
                let weatherIconSrc;
                switch (weatherCodes[i]) {
                    case 0: 
                        weatherIconSrc = "images/sol.png";
                        break;
                    case 51: 
                        weatherIconSrc = "images/drizzle.png";
                        break;
                    case 63: 
                        weatherIconSrc = "images/rainy.png";
                        break;
                    case 2: 
                        weatherIconSrc = "images/cloudy.png";
                        break;
                    case 71: 
                        weatherIconSrc = "images/snow.png"; 
                        break;
                    case 45:
                        weatherIconSrc="images/mist.png";
                        break;
                    default:
                            weatherIconSrc="images/unknown.png" ;
                }

                forecastContainer.innerHTML += `
                    <div>
                        <bold>Datum:</bold> ${dates[i]}<br>
                        <bold>Max Temp:</bold> ${maxTemps[i]}°C<br>
                        <bold>Min Temp:</bold> ${minTemps[i]}°C<br>
                        <bold>Perciptation:</bold> ${precipitation[i]} mm<br>
                        <img src="${weatherIconSrc}" alt="weather icon" width="50"><br>
                        <hr>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert("Ett fel uppstod vid hämtning av väderdata.");
        });
}

// add event listner for search btn
document.getElementById("searchButton").addEventListener("click", () => {
    const cityName = document.getElementById("cityInput").value.trim();
    if (cityName) {
        getCoordinates(cityName);
    } else {
        alert("Ange ett stadens namn.");
    }
});