import { weatherUI } from "./weatherUI.js";

export const weatherManager = (function() {
    const apiKey = 'AD48NH6PM9BP79YQTJ7JG399N';
    let currentLocation;

    function getApiKey() {
        return apiKey;
    }

    function getCurrentLocation() {
        return currentLocation;
    }

    function convertData(data) {
        return {
            conditions: data.days[0].conditions,
            description: data.days[0].description,
            temp: data.days[0].temp,
            feelslike: data.days[0].feelslike,
            tempmax: data.days[0].tempmax,
            tempmin: data.days[0].tempmin,
            feelslikemax: data.days[0].feelslikemax,
            feelslikemin: data.days[0].feelslikemin,
            humidity: data.days[0].humidity,
            windspeed: data.days[0].windspeed,
            pressure: data.days[0].pressure,
            visibility: data.days[0].visibility,
            cloudcover: data.days[0].cloudcover,
            snow: data.days[0].snow,
            sunrise: data.days[0].sunrise,
            sunset: data.days[0].sunset
        }
    }

    function getLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        try {
                            const cityName = await getCityName(latitude, longitude);
                            currentLocation = cityName;
                            resolve(cityName);
                        } catch (error) {
                            console.error("Error getting city name:", error.message);
                            reject(error);
                        }
                    },
                    (error) => {
                        console.error("Error getting location:", error.message);
                        reject(error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }

    async function getCityName(lat, lon) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${apiKey}&contentType=json`;
    
        const response = await fetch(url);
        const cityData = await response.json();
        const cityName = cityData.resolvedAddress;
    
        return cityName;
    }

    async function init() {
        try {
            currentLocation = await getLocation();
            console.log(currentLocation);
            await weatherUI.displayWeather(currentLocation);
        } catch (error) {
            console.error("Error initializing weather display:", error.message);
        }
    }

    return {
        init,
        getApiKey,
        convertData,
        getCurrentLocation
    }
})();