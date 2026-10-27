const apiKey = "f7b1ce68e00874569cfab9cb4133f2e1";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const searchBox = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const card = document.getElementById("weatherCard");
const errorDiv = document.getElementById("errorDiv");
const weatherDiv = document.getElementById("weatherDiv");
const unitToggleBtn = document.getElementById("unitToggle");

// State Variables
let currentTempC = null;
let isCelsius = true;

// Custom Built-In Weather Icons SVG Registry
const weatherSVGs = {
    Clear: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#FFD700"/><g stroke="#FFD700" stroke-width="3" stroke-linecap="round"><line x1="32" y1="6" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="58"/><line x1="6" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="58" y2="32"/><line x1="13.6" y1="13.6" x2="17.8" y2="17.8"/><line x1="46.2" y1="46.2" x2="50.4" y2="50.4"/><line x1="13.6" y1="50.4" x2="17.8" y2="46.2"/><line x1="46.2" y1="17.8" x2="50.4" y2="13.6"/></g></svg>`,
    Clouds: `<svg viewBox="0 0 64 64"><path d="M46 48H18a12 12 0 0 1-2.1-23.8 15 15 0 0 1 29.4-4.2A11 11 0 0 1 46 48z" fill="#E2E8F0"/><path d="M40 42H20a8 8 0 0 1-1.4-15.8 10 10 0 0 1 19.6-2.8A7.5 7.5 0 0 1 40 42z" fill="#CBD5E1"/></svg>`,
    Rain: `<svg viewBox="0 0 64 64"><path d="M46 38H18a10 10 0 0 1-1.8-19.8 13 13 0 0 1 25.5-3.6A9.5 9.5 0 0 1 46 38z" fill="#94A3B8"/><g stroke="#38BDF8" stroke-width="3" stroke-linecap="round"><line x1="22" y1="44" x2="18" y2="52"/><line x1="32" y1="44" x2="28" y2="52"/><line x1="42" y1="44" x2="38" y2="52"/></g></svg>`,
    Drizzle: `<svg viewBox="0 0 64 64"><path d="M46 38H18a10 10 0 0 1-1.8-19.8 13 13 0 0 1 25.5-3.6A9.5 9.5 0 0 1 46 38z" fill="#CBD5E1"/><g stroke="#7DD3FC" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 4"><line x1="22" y1="44" x2="20" y2="50"/><line x1="32" y1="44" x2="30" y2="50"/><line x1="42" y1="44" x2="40" y2="50"/></g></svg>`,
    Mist: `<svg viewBox="0 0 64 64"><g stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"><line x1="16" y1="24" x2="48" y2="24"/><line x1="12" y1="32" x2="52" y2="32"/><line x1="20" y1="40" x2="44" y2="40"/></g></svg>`,
    Snow: `<svg viewBox="0 0 64 64"><path d="M46 36H18a10 10 0 0 1-1.8-19.8 13 13 0 0 1 25.5-3.6A9.5 9.5 0 0 1 46 36z" fill="#E2E8F0"/><g fill="#38BDF8"><circle cx="22" cy="46" r="2.5"/><circle cx="32" cy="48" r="2.5"/><circle cx="42" cy="46" r="2.5"/></g></svg>`
};

async function checkWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
        
        if (response.status === 404) {
            showError("Invalid city name. City not found.");
            return;
        }

        if (!response.ok) {
            showError("Unable to fetch weather details.");
            return;
        }

        const data = await response.json();

        // Populate Text Data
        document.getElementById("cityDisplay").innerText = data.name;
        currentTempC = data.main.temp;
        updateTemperatureDisplay();
        
        document.getElementById("humidityDisplay").innerText = `${data.main.humidity}%`;
        document.getElementById("windDisplay").innerText = `${Math.round(data.wind.speed * 3.6)} km/h`;
        document.getElementById("descDisplay").innerText = data.weather[0].description;

        // Reset Card Class Name
        card.className = "card";
        const mainCondition = data.weather[0].main;

        // Dynamic Gradient Classes & Icons
        const iconContainer = document.getElementById("weatherIconContainer");

        if (mainCondition === "Clouds") {
            card.classList.add("clouds");
            iconContainer.innerHTML = weatherSVGs.Clouds;
        } else if (mainCondition === "Clear") {
            card.classList.add("clear-day");
            iconContainer.innerHTML = weatherSVGs.Clear;
        } else if (mainCondition === "Rain") {
            card.classList.add("rain");
            iconContainer.innerHTML = weatherSVGs.Rain;
        } else if (mainCondition === "Drizzle") {
            card.classList.add("drizzle");
            iconContainer.innerHTML = weatherSVGs.Drizzle;
        } else if (["Mist", "Fog", "Haze"].includes(mainCondition)) {
            card.classList.add("mist");
            iconContainer.innerHTML = weatherSVGs.Mist;
        } else if (mainCondition === "Snow") {
            card.classList.add("snow");
            iconContainer.innerHTML = weatherSVGs.Snow;
        } else {
            card.classList.add("clear-day");
            iconContainer.innerHTML = weatherSVGs.Clear;
        }

        // Hide Errors & Trigger Refresh Animation
        errorDiv.style.display = "none";
        weatherDiv.style.display = "flex";
        weatherDiv.classList.remove("animated-fade");
        void weatherDiv.offsetWidth; // Trigger reflow
        weatherDiv.classList.add("animated-fade");

    } catch (error) {
        showError("Network error or request failed.");
    }
}

function showError(msg) {
    document.getElementById("errorMessage").innerText = msg;
    errorDiv.style.display = "block";
    weatherDiv.style.display = "none";
}

function updateTemperatureDisplay() {
    if (currentTempC === null) return;
    
    const tempValEl = document.getElementById("tempValue");
    const tempUnitEl = document.getElementById("tempUnit");

    if (isCelsius) {
        tempValEl.innerText = Math.round(currentTempC);
        tempUnitEl.innerText = "°C";
    } else {
        const tempF = (currentTempC * 9/5) + 32;
        tempValEl.innerText = Math.round(tempF);
        tempUnitEl.innerText = "°F";
    }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    if (searchBox.value.trim() !== "") {
        checkWeather(searchBox.value.trim());
    }
});

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchBox.value.trim() !== "") {
        checkWeather(searchBox.value.trim());
    }
});

unitToggleBtn.addEventListener("click", () => {
    isCelsius = !isCelsius;
    updateTemperatureDisplay();
});

// Initial Load
checkWeather("New York");