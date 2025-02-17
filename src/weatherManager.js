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

    function setCurrentLocation(location) {
        currentLocation = location;
    }

    function convertData(data) {
        if (!data || !data.days || data.days.length === 0) {
            console.error("Invalid weather data:", data);
            return {};
        }

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
            sunset: data.days[0].sunset,
        }
    }

    async function getLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.watchPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.error(error);
                    reject(error);
                },
                { enableHighAccuracy: true }
            );
        });
    }

    async function getWeatherData() {
        const location = currentLocation;
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.latitude},${location.longitude}?key=${apiKey}`;
    
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Błąd pobierania danych");
            
            const data = await response.json();
            console.log("Weather data:", data); //debuging
            return data;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    async function getCityName() {
        try {
            const lat = currentLocation.latitude;
            const lon = currentLocation.longitude;
    
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
            const response = await fetch(url);
            const responseData = await response.json();
    
            const address = responseData.address;
            const city = address.city || address.town || address.village || 'City not found';
            return city;

        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    async function getCountryName() {
        try {
            const lat = currentLocation.latitude;
            const lon = currentLocation.longitude;
    
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
            const response = await fetch(url);
            const responseData = await response.json();
    
            const country = responseData.address.country || 'Country not found';
            return country;

        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    async function convertToCoordinates(name) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`;
            const response = await fetch(url);
            const responseData = await response.json();
    
            if (responseData && responseData.length > 0) {
                const { lat, lon } = responseData[0];
                currentLocation.latitude = lat;
                currentLocation.longitude = lon;
            } else {
                console.error('City not found.');
            }
        } catch (error) {
            console.error('Error:', error);
        }

    }

    async function init() {
        try {
            currentLocation = await getLocation();
            await weatherUI.displayWeather();
            weatherUI.initUI();
        } catch (error) {
            console.error("Error initializing weather display:", error.message);
        }
    }

    return {
        init,
        getApiKey,
        getWeatherData,
        convertData,
        getCurrentLocation,
        setCurrentLocation,
        getCountryName,
        getCityName,
        convertToCoordinates
    }
})();