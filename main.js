
const weatherForm = document.querySelector(".weatherForm");
const apiKey = "your API key goes here";

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cityInput = document.getElementById("cityInput");
    const loader = document.querySelector(".loader");
    const weatherCard = document.querySelector(".card");

    const city = cityInput.value.trim();

    if (!city) {
        displayError("Please enter a valid city");
        return;
    }

    weatherCard.style.display = "none";
    loader.style.display = "block";

    try {
        const weatherData = await getWeatherData(city);

        displayWeatherInfo(weatherData);
    }
    catch (e) {
        console.error(e);
        displayError(e);
    }
    finally {
        loader.style.display = "none";
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }]
    } = data;

    const weatherCard = document.querySelector(".card");

    weatherCard.textContent = "";
    weatherCard.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const tempEmojiWrapper = document.createElement("div");
    const breakLine = document.createElement("hr");

    cityDisplay.textContent = city;

    const tempCelsius = (temp - 273.15).toFixed(0);
    tempDisplay.textContent = `${ (tempCelsius[0] === "-" ? "-" : "+") + tempCelsius }°`;

    humidityDisplay.textContent = `💧 ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");
    tempEmojiWrapper.classList.add("tempEmojiWrapper");
    breakLine.classList.add("breakLine");

    tempEmojiWrapper.appendChild(tempDisplay);
    tempEmojiWrapper.appendChild(weatherEmoji);

    weatherCard.appendChild(cityDisplay);
    weatherCard.appendChild(tempEmojiWrapper);
    weatherCard.appendChild(humidityDisplay);
    weatherCard.appendChild(breakLine);
    weatherCard.appendChild(descDisplay);
}

function getWeatherEmoji(weatherId) {

    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "🌩️";
        case (weatherId >= 300 && weatherId < 500):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "🌨️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId > 800 && weatherId < 815):
            return "☁️";
        default:
            return "☁️";
    }
}

function displayError(message) {
    const errorDisplay = document.createElement("p");
    const weatherCard = document.querySelector(".card");

    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    weatherCard.textContent = "";
    weatherCard.style.display = "flex";
    weatherCard.appendChild(errorDisplay);
}
