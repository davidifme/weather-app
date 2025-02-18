import { weatherManager } from "./weatherManager.js";
import snowGif from "/gifs/snow.gif";
import rainGif from "/gifs/rain.gif";
import hotGif from "/gifs/hot.gif";
import cloudsGif from "/gifs/clouds.gif";
import sunnyGif from "/gifs/sunny.gif";

export const weatherUI = (function() {
    const country = document.getElementById('country');
    const location = document.getElementById('localization');
    const conditions = document.getElementById('condition');
    const description = document.getElementById('description-text');
    const temp = document.getElementById('temperature');
    const feelslike = document.getElementById('fells-like-temperature');
    const tempmax = document.querySelector('.temperature-high');
    const tempmin = document.querySelector('.temperature-low');
    const feelslikemax = document.getElementById('fells-like-high');
    const feelslikemin = document.getElementById('fells-like-low');
    const humidity = document.getElementById('humidity');
    const windspeed = document.getElementById('windspeed');
    const pressure = document.getElementById('pressure');
    const visibility = document.getElementById('visibility');
    const cloudcover = document.getElementById('cloudcover');
    const snow = document.getElementById('snow');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');

    const celsiusBtn = document.getElementById('celsius-button');
    const fahrenheitBtn = document.getElementById('fahrenheit-button');

    const gif = document.getElementById('gif');

    let currentDegreeSetup = 'F';
    let currentWeatherState;

    function initUI() {
        setupSearchBar();
        setupButtons();
    }

    async function displayWeather() {
        const weatherData = await weatherManager.getWeatherData();
        const convertedWeatherData = weatherManager.convertData(weatherData)

        updateDisplayData(convertedWeatherData);
        displayGif(convertedWeatherData);
        changeColors(currentWeatherState);
    }

    async function updateDisplayData(weatherData) {
        const convertTemp = (temp) => {
            if (currentDegreeSetup === 'F') {
                return `${(temp * 9/5 + 32).toFixed(1)}°F`;
            } else if (currentDegreeSetup === 'C') {
                return `${temp.toFixed(1)}°C`;
            }
        };

        conditions.textContent = weatherData.conditions;
        description.textContent = weatherData.description;
        temp.textContent = convertTemp(weatherData.temp);
        feelslike.textContent = convertTemp(weatherData.feelslike);
        tempmax.textContent = `H:${convertTemp(weatherData.tempmax)}`;
        tempmin.textContent = `L:${convertTemp(weatherData.tempmin)}`;
        feelslikemax.textContent = `H:${convertTemp(weatherData.feelslikemax)}`;
        feelslikemin.textContent = `L:${convertTemp(weatherData.feelslikemin)}`;
        humidity.textContent = `${weatherData.humidity}%`;
        windspeed.textContent = `${weatherData.windspeed} km/h`;
        pressure.textContent = `${weatherData.pressure} hPa`;
        visibility.textContent = `${weatherData.visibility} km`;
        cloudcover.textContent = `${weatherData.cloudcover}%`;
        snow.textContent = `${weatherData.snow} mm`;
        sunrise.textContent = weatherData.sunrise;
        sunset.textContent = weatherData.sunset;

        const countryName = await weatherManager.getCountryName();
        country.textContent = countryName.toLowerCase();
        location.textContent = await weatherManager.getCityName();
    }

    function setupSearchBar() {
        const searchIcon = document.getElementById('search-icon');
        const searchBar = document.getElementById('search');
        const searchForm = document.querySelector('form');

        searchIcon.addEventListener('click', () => {
            searchBar.focus();
        });

        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await weatherManager.convertToCoordinates(searchBar.value);
            await displayWeather();
            searchBar.value = '';
        });
    }

    function displayGif(weatherData) {
        const temperature = weatherData.temp;
        const humidity = weatherData.humidity;
        const snow = weatherData.snow;
        const cloudCover = weatherData.cloudcover;
        
        if (snow > 0) {
            gif.src = snowGif;
            currentWeatherState = 'snow';
            return
        }

        if (humidity > 80) {
            gif.src = rainGif;
            currentWeatherState = 'rain';
            return
        }

        if (cloudCover > 30) {
            gif.src = cloudsGif;
            currentWeatherState = 'clouds';
            return
        } else if (cloudCover < 20) {
            gif.src = sunnyGif;
            currentWeatherState = 'sunny';
            return
        }

        if (temperature > 28) {
            gif.src = hotGif;
            currentWeatherState = 'hot';
            return
        }
    }

    function changeColors(weatherState) {
        const descriptionContainer = document.querySelector('.description-container');
        const infoContainers = document.querySelectorAll('.info-container > div');

        if (weatherState === 'snow') {
            descriptionContainer.style.backgroundColor = '#00BFFF';
            infoContainers.forEach(container => {
                container.style.backgroundColor = '#00BFFF';
            });
        } else if (weatherState === 'rain') {
            descriptionContainer.style.backgroundColor = '#1E3A5F';
            infoContainers.forEach(container => {
                container.style.backgroundColor = '#1E3A5F';
            });
        } else if (weatherState === 'clouds') {
            descriptionContainer.style.backgroundColor = '#D3D3D3';
            infoContainers.forEach(container => {
                container.style.backgroundColor = '#D3D3D3';
            });
        } else if (weatherState === 'sunny') {
            descriptionContainer.style.backgroundColor = '#FFD700';
            infoContainers.forEach(container => {
                container.style.backgroundColor = '#FFD700';
            });
        } else if (weatherState === 'hot') {
            descriptionContainer.style.backgroundColor = '#00BFFF';
            infoContainers.forEach(container => {
                container.style.backgroundColor = '#00BFFF';
            });
        } else {
            descriptionContainer.style.backgroundColor = '#A9A9A9';
            infoContainers.forEach(container => {
                container.style.backgroundColor = '#A9A9A9';
            });
        }
    }

    function setupButtons() {
        if (currentDegreeSetup === 'F') {
            celsiusBtn.disabled = false;
            fahrenheitBtn.disabled = true;
        } else if (currentDegreeSetup === 'C') {
            celsiusBtn.disabled = true;
            fahrenheitBtn.disabled = false;
        } else {
            console.error('Error: Unknown type of temperature degree.');
            return;
        }

        celsiusBtn.addEventListener('click', async (e) => {
            currentDegreeSetup = 'C';
            celsiusBtn.disabled = true;
            fahrenheitBtn.disabled = false;
            await displayWeather();
        });

        fahrenheitBtn.addEventListener('click', async (e) => {
            currentDegreeSetup = 'F';
            celsiusBtn.disabled = false;
            fahrenheitBtn.disabled = true;
            await displayWeather();
        });
    }

    return {
        displayWeather,
        initUI
    }
})();