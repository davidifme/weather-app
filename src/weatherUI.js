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

    async function displayWeather(location) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${weatherManager.getApiKey()}`;

        const response = await fetch(url);
        const weatherData = await response.json();
        setupDisplay(weatherManager.convertData(weatherData));
    }

    function setupDisplay(weatherData) {
        country.textContent = weatherData.address;
        location.textContent = weatherManager.getCurrentLocation();
        conditions.textContent = weatherData.conditions;
        description.textContent = weatherData.description;
        temp.textContent = weatherData.temp;
        feelslike.textContent = weatherData.feelslike;
        tempmax.textContent = weatherData.tempmax;
        tempmin.textContent = weatherData.tempmin;
        feelslikemax.textContent = weatherData.feelslikemax;
        feelslikemin.textContent = weatherData.feelslikemin;
        humidity.textContent = weatherData.humidity;
        windspeed.textContent = weatherData.windspeed;
        pressure.textContent = weatherData.pressure;
        visibility.textContent = weatherData.visibility;
        cloudcover.textContent = weatherData.cloudcover;
        snow.textContent = weatherData.snow;
        sunrise.textContent = weatherData.sunrise;
        sunset.textContent = weatherData.sunset;
    }

    return {
        displayWeather
    }
})();