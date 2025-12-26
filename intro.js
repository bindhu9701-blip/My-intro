      // Weather API setup
      const apiKey = "087b4ed8be7aab6efff24eaec6330ec6";
      const apiUrl =
        "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

      // Elements
      const searchInput = document.getElementById("weatherInput");
      const searchBtn = document.getElementById("searchBtn");
      const errorMsg = document.getElementById("errorMsg");
      const weatherDisplay = document.getElementById("weatherDisplay");
      const weatherIcon = document.getElementById("weatherIcon");
      const tempEl = document.getElementById("temp");
      const cityName = document.getElementById("cityName");
      const humidityEl = document.getElementById("humidity");
      const windEl = document.getElementById("wind");

      // Map setup - Default Chennai (IIT Madras)
      const map = L.map("weather-map").setView([13.0827, 80.2707], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      let weatherMarker;

      // Weather icons
      const icons = {
        Clouds: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
        Clear: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
        Rain: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
        Drizzle: "https://cdn-icons-png.flaticon.com/512/414/414974.png",
        Mist: "https://cdn-icons-png.flaticon.com/512/1197/1197102.png",
      };

      async function checkWeather(city) {
        try {
          const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
          const data = await response.json();

          if (data.cod !== 200) {
            errorMsg.style.display = "block";
            weatherDisplay.style.display = "none";
            return;
          }

          errorMsg.style.display = "none";
          weatherDisplay.style.display = "block";

          // Update weather data
          cityName.textContent = data.name;
          tempEl.textContent = `${Math.round(data.main.temp)}°C`;
          humidityEl.innerHTML = `${data.main.humidity}%`;
          windEl.innerHTML = `${data.wind.speed} km/h`;

          // Weather icon
          const weatherType = data.weather[0].main;
          weatherIcon.src = icons[weatherType] || icons.Clouds;

          // Update map
          map.setView([data.coord.lat, data.coord.lon], 12);
          if (weatherMarker) {
            weatherMarker
              .setLatLng([data.coord.lat, data.coord.lon])
              .setPopupContent(
                `${data.name}<br>${Math.round(data.main.temp)}°C`
              )
              .openPopup();
          } else {
            weatherMarker = L.marker([data.coord.lat, data.coord.lon])
              .addTo(map)
              .bindPopup(`${data.name}<br>${Math.round(data.main.temp)}°C`)
              .openPopup();
          }
        } catch (error) {
          errorMsg.style.display = "block";
          weatherDisplay.style.display = "none";
        }
      }

      // Event listeners
      searchBtn.onclick = () => checkWeather(searchInput.value.trim());
      searchInput.onkeypress = (e) => {
        if (e.key === "Enter" && searchInput.value.trim()) {
          checkWeather(searchInput.value.trim());
        }
      };

      // Load default weather for Chennai
      checkWeather("Kadapa");