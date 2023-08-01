const searchForm = document.getElementById("searchForm");
const searchHistory = document.getElementById("searchHistoryList");
const weatherInfoList = document.getElementsByClassName("weatherInfo");

const apiKey = "a1d8f5e01059ffb75e7b36b3d1fd0f54";
let city = "";
let cityList = JSON.parse(localStorage.getItem("cityList")) || [];


// Listen for form submission
searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent page refresh
    city = document.getElementById("searchInput").value; // Get city from input
    cityList.push(city); // Add city to cityList
    localStorage.setItem("cityList", JSON.stringify(cityList)); // Store cityList in localStorage
    const historyLink = document.createElement("li"); // Create new list item for history
    historyLink.classList.add("historyLink"); // Add class to list item
    city = city.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "); // Format city name
    historyLink.innerHTML = `<h4 class="historyLink">${city}</h4>`; // Add city name to list item
    searchHistory.appendChild(historyLink); // Add list item to search history
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`; // API URL for forecast
    const apiUrlCurrent = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`; // API URL for current weather
    searchForm.reset(); // Reset form
    fetch(apiUrlCurrent) // Fetch current weather data
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            const weatherInfo = document.getElementById("currentWeather"); // Get current weather element
            const image = data.weather[0].icon; // Get weather icon
            const temperature = data.main.temp; // Get temperature
            const humidity = data.main.humidity; // Get humidity
            const windSpeed = data.wind.speed; // Get wind speed
            const weatherInfoBox = document.createElement("div"); // Create new weather info box
            weatherInfoBox.classList.add("weatherInfoBox"); // Add class to weather info box
            weatherInfoBox.innerHTML = `
                <h3>Current Weather</h3>
                <img src="http://openweathermap.org/img/w/${image}.png" alt="Weather Icon">
                <p>Temperature: ${temperature}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} MPH</p>
            `; // Add weather info to weather info box
            while (weatherInfo.firstChild) { // Remove any existing weather info
                weatherInfo.removeChild(weatherInfo.firstChild);
            }
            weatherInfo.appendChild(weatherInfoBox); // Add new weather info to current weather element
        });
    fetch(apiUrl) // Fetch forecast data
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            const cityName = data.city.name; // Get city name
            const countryName = data.city.country; // Get country name
            const weatherInfo = document.getElementById("weatherInfo"); // Get weather info element
            weatherInfo.innerHTML = `<h2>${cityName + " - " + countryName}</h2>`; // Add city and country name to weather info element
            let dates = [];
            for (let i = 0; i < data.list.length; i++) { // Loop through forecast data
                const date = data.list[i].dt_txt.split(" ")[0]; // Get date
                if (!dates.includes(date)) { // Check if date has already been added
                    dates.push(date); // Add date to dates array
                    const image = data.list[i].weather[0].icon; // Get weather icon
                    const temperature = data.list[i].main.temp; // Get temperature
                    const humidity = data.list[i].main.humidity; // Get humidity
                    const windSpeed = data.list[i].wind.speed; // Get wind speed

                    const weatherInfoBox = document.createElement("div"); // Create new weather info box
                    weatherInfoBox.classList.add("weatherInfoBox"); // Add class to weather info box
                    weatherInfoBox.innerHTML = `
                        <h3>Date: ${date.slice(6)}</h3>
                        <img src="http://openweathermap.org/img/w/${image}.png" alt="Weather Icon">
                        <p>Temperature: ${temperature}°F</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Wind Speed: ${windSpeed} MPH</p>
                    `; // Add weather info to weather info box
                    weatherInfo.appendChild(weatherInfoBox); // Add new weather info to weather info element
                }
                if (dates.length >= 5) { // Stop loop after 5 dates
                    break;
                }
            }
        });
});
//Search history functionality
searchHistory.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.classList.contains("historyLink")) {
        const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${event.target.textContent}&appid=${apiKey}&units=imperial`;
        const apiUrlCurrent = `http://api.openweathermap.org/data/2.5/weather?q=${event.target.textContent}&appid=${apiKey}&units=imperial`;
        console.log(apiUrl);
        fetch(apiUrlCurrent)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const weatherInfo = document.getElementById("currentWeather");
                const image = data.weather[0].icon;
                const temperature = data.main.temp;
                const humidity = data.main.humidity;
                const windSpeed = data.wind.speed;
                const weatherInfoBox = document.createElement("div");
                weatherInfoBox.classList.add("weatherInfoBox");
                weatherInfoBox.innerHTML = `
                    <h3>Current Weather</h3>
                    <img src="http://openweathermap.org/img/w/${image}.png" alt="Weather Icon">
                    <p>Temperature: ${temperature}°F</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} MPH</p>
                `;
                while (weatherInfo.firstChild) {
                    weatherInfo.removeChild(weatherInfo.firstChild);
                }
                weatherInfo.appendChild(weatherInfoBox);
            });
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                const cityName = data.city.name;
                const weatherInfo = document.getElementById("weatherInfo");
                weatherInfo.innerHTML = `<h2>${cityName}</h2>`;
                let dates = [];
                for (let i = 0; i < data.list.length; i++) {
                    const date = data.list[i].dt_txt.split(" ")[0];
                    if (!dates.includes(date)) {
                        dates.push(date);
                        const image = data.list[i].weather[0].icon;
                        const temperature = data.list[i].main.temp;
                        const humidity = data.list[i].main.humidity;
                        const windSpeed = data.list[i].wind.speed;

                        const weatherInfoBox = document.createElement("div");
                        weatherInfoBox.classList.add("weatherInfoBox");
                        weatherInfoBox.innerHTML = `
                            <h3>Date: ${date.slice(6)}</h3>
                            <img src="http://openweathermap.org/img/w/${image}.png" alt="Weather Icon">
                            <p>Temperature: ${temperature}°F</p>
                            <p>Humidity: ${humidity}%</p>
                            <p>Wind Speed: ${windSpeed} MPH</p>
                        `;
                        weatherInfo.appendChild(weatherInfoBox);
                    }
                    if (dates.length >= 5) {
                        break;
                    }
                }
            });
    }
});