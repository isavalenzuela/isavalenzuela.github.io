/* Guardamos en estas variables las URL y Keys de las APIs que usaremos */

const API_CITY_URL = "https://api.api-ninjas.com/v1/city?name=";

const API_OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

const API_NINJA_KEY = "74kc+gJrG2vC0/APCOXQJQ==gTUfnnID3aE9ydwJ";

const API_OPENWEATHER_KEY = "1b988997ca12580c2b02f8c9c7cdfb58";

const ICON_WEATHER_BASE = "http://openweathermap.org/img/wn/[REPLACEICON]@2x.png";

/* OBTENER CIUDAD EN BASE AL INPUT.
Este método captura el input del usuario 
(más abajo se define la variable que lo almacena)
y lo envía mediante método GET a la API Ninjas City.
Parámetro: userInput -> captura el input en el HTML, mediante id.
Headers: Solicitado por la API para hacer la consulta.
Promesa: Realiza la consulta a la API en el get, devuelve el resultado
en el then.
*/
function getCityByUserInput(userInput) {
  const headers = {
    "X-Api-Key": API_NINJA_KEY,
  };
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_CITY_URL}${userInput}`, { headers })
      .then((response) => resolve(response.data));
  });
}

/** 
* OBTENER CIUDAD EN BASE A LATITUD Y LONGITUD DE LA CIUDAD
* Este método envía la consulta a la API Open Weather.
* Headers: Esta API no los solicita.
* Promesa:Realiza la consulta a la API en el get, devuelve el resultado
* en el then. A través del GET envía lat, lon, KEY, idioma y sistema de medida.
* @param {number} lat [latitud]
* @param {number} lon [longitud]
*/
function getWeatherByCity(lat, lon) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_OPENWEATHER_URL}lat=${lat}&lon=${lon}&appid=${API_OPENWEATHER_KEY}&lang=sp&units=metric`)
      .then((response) => resolve(response.data));
  });
}

/* FUNCION ASÍNCRONA: BUSCAR CIUDAD EN BASE AL INPUT
Esta función asíncrona
Parámetros: lat -> latitud, lon -> longitud.
*/

async function searchCityByInput() {
  //Se define variable userInput, obteniendo el valor en base a 
  const userInput = document.getElementById("city-input").value;
  let cityResponse = "";
  let weatherResponse = "";
  if (userInput.length <= 0) {
    alert("Ingresa una ciudad");
    return;
  }

  const app = document.getElementById("app");
  app.style.display = "none";

  const appOnLoading = document.getElementById("app--on-loading");
  appOnLoading.style.display = "flex";

  const lottiePlayer = document.getElementById("loading-img");
  lottiePlayer.style.display = "block";

  try {
  cityResponse = await getCityByUserInput(userInput);
  weatherResponse = await getWeatherByCity(cityResponse[0].latitude, cityResponse[0].longitude);
  } catch (e) {
    alert("La búsqueda no arrojó resultados");
    console.log(`Error en servicios ${e}`)
    window.location.href = "index.html"
    return;
  }


  sessionStorage.setItem("weatherResponse", JSON.stringify(weatherResponse));
  sessionStorage.setItem("cityName", cityResponse[0].name);
  window.location.href = "success_view.html";
}

function getWeatherFromStorage() {
  const weatherResponse = JSON.parse(sessionStorage.getItem("weatherResponse"));
  const cityName = sessionStorage.getItem("cityName");
  showWeatherData(weatherResponse, cityName);
  console.log(cityName);
  console.log(weatherResponse);
}

//esta función muestra los datos obtenidos en pantalla
function showWeatherData(weatherDataInput, cityName) {
  const citySpan = document.getElementById("city");
  citySpan.innerText = cityName;
  console.log(weatherDataInput)
  const iconURL = ICON_WEATHER_BASE.replace("[REPLACEICON]", weatherDataInput.weather[0].icon);
  document.getElementById("weather-icon").src = iconURL;

  const weatherDescSpan = document.getElementById("weather-icon-desc");
  weatherDescSpan.innerText = weatherDataInput.weather[0].description;

  const tempSpan = document.getElementById("temp");
  tempSpan.innerText = weatherDataInput.main.temp;

  const feelsLikeSpan = document.getElementById("feels_like");
  feelsLikeSpan.innerText = weatherDataInput.main.feels_like;

  const tempMinSpan = document.getElementById("temp_min")
  tempMinSpan.innerText = weatherDataInput.main.temp_min;

  const tempMaxSpan = document.getElementById("temp_max")
  tempMaxSpan.innerText = weatherDataInput.main.temp_max;
}
