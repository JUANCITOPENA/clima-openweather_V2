// Obtener elementos del DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');

// Variable de entorno en Vite
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Evento click en el botón de buscar
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        cityInput.value = ''; // Limpiar input
    }
});

// Evento para que funcione la tecla "Enter"
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
            cityInput.value = '';
        }
    }
});

// Función Fetch a OpenWeatherMap
async function getWeather(city) {
    try {
        // endpoint con unidades en Celsius (metric) y en español (lang=es)
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Ciudad no encontrada ❌');
        }

        const data = await response.json();
        renderWeatherCard(data);

    } catch (error) {
        alert(error.message);
    }
}

// Función para crear la tarjeta en el DOM
function renderWeatherCard(data) {
    // Crear el elemento div de la tarjeta
    const card = document.createElement('div');
    card.classList.add('weather-card', 'text-center', 'fade-in');

    // Mapeo simple de iconos de OpenWeather a FontAwesome / Emojis
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Contenido HTML de la tarjeta
    card.innerHTML = `
        <button class="close-btn" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
        <h3 class="mt-2">📍 ${data.name}, ${data.sys.country}</h3>
        <img src="${iconUrl}" alt="Icono del clima" class="weather-icon-img" style="width: 120px; filter: drop-shadow(0 0 10px #00f3ff);">
        <h2 class="temp">🌡️ ${Math.round(data.main.temp)}°C</h2>
        <p class="text-capitalize fs-5">☁️ ${data.weather[0].description}</p>
        <div class="d-flex justify-content-around mt-3 border-top border-info pt-3" style="border-color: rgba(0,243,255,0.3) !important;">
            <span>💧 Humedad: ${data.main.humidity}%</span>
            <span>💨 Viento: ${data.wind.speed} m/s</span>
        </div>
    `;

    // Funcionalidad del botón cerrar de esta tarjeta específica
    const closeBtn = card.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        card.remove();
    });

    // Agregar la tarjeta al principio del contenedor
    weatherContainer.prepend(card);
}