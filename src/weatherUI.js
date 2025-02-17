import { weatherManager } from "./weatherManager";

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

    function initUI() {
        setupSearchBar();
    }

    async function displayWeather() {
        const weatherData = await weatherManager.getWeatherData();
        updateDisplayData(weatherManager.convertData(weatherData));
    }

    async function updateDisplayData(weatherData) {
        conditions.textContent = weatherData.conditions;
        description.textContent = weatherData.description;
        temp.textContent = `${weatherData.temp}°`;
        feelslike.textContent = `${weatherData.feelslike}°`;
        tempmax.textContent = `${weatherData.tempmax}°`;
        tempmin.textContent = `${weatherData.tempmin}°`;
        feelslikemax.textContent = `${weatherData.feelslikemax}°`;
        feelslikemin.textContent = `${weatherData.feelslikemin}°`;
        humidity.textContent = `${weatherData.humidity}%`;
        windspeed.textContent = `${weatherData.windspeed} km/h`;
        pressure.textContent = `${weatherData.pressure} hPa`;
        visibility.textContent = `${weatherData.visibility} km`;
        cloudcover.textContent = `${weatherData.cloudcover}%`;
        snow.textContent = `${weatherData.snow} mm`;
        sunrise.textContent = weatherData.sunrise;
        sunset.textContent = weatherData.sunset;

        const countryName = await weatherManager.getCountryName()
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

    return {
        displayWeather,
        initUI
    }
})();