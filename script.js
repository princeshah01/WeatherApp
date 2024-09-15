let Searchinput = document.querySelector(".Search-input");
let temperature = document.querySelector(".temp");
let description = document.querySelector(".description");
let Icon = document.querySelector(".weather-icon");
let locationBtn =  document.querySelector(".location-button");
let hourlydiv = document.querySelector(".hourly-weather .weather-list");

let API_KEY = "e02e3a44948d4439b5772044241509";
const setupWeatherRequest = (cityName)=>{
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;

    getweatherdetails(API_URL);

}
Searchinput.addEventListener("keyup", (e) => {
    const cityName = Searchinput.value.trim();

    if (e.key == "Enter" && cityName) {
        // console.log(cityName);
        setupWeatherRequest(cityName);
    }
});



const displayHourlyForecast =(hourlyData)=>{
    const currentHour = new Date().setMinutes(0,0,0);
    const next24hours = currentHour + 24 *60*60*1000;

    const next24HoursData = hourlyData.filter(({time})=>{
        const forecasttime = new Date(time).getTime();
        return forecasttime >= currentHour && forecasttime <= next24hours;
    })
    // console.log(next24HoursData);
    hourlydiv.innerHTML = next24HoursData.map(item =>{
        let temp = Math.floor(item.temp_c);
        let time = item.time.split(" ")[1].substring(0,5);

        const weathericon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(item.condition.code));

        return ` 
            <li class="weather-item">
              <p class="time">${time}</p>
              <img src="./icons/${weathericon}.svg" alt="" class="weather-icon" />
              <p class="temperature">${temp} &deg;</p>
            </li>`;
    }).join("");
    // console.log(hourlyWeatherHtml);
}


const weatherCodes = {
    clear: [1000],
    clouds: [1003, 1006, 1009],
    mist: [1030, 1135, 1147],
    rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
    moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
    snow: [1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
    thunder: [1087, 1279, 1282],
    thunder_rain: [1273, 1276]
}




const getweatherdetails = async (API_URL) => {
    document.body.classList.remove("show-no-results");

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // console.log(data);
        let temp = Math.floor(data.current.temp_c);
        temperature.innerHTML = `${temp} <span>&deg;C</span>`;

        let desc = data.current.condition.text;
        description.innerText = desc;

        const weathericon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current.condition.code));
        Icon.setAttribute("src", `./icons/${weathericon}.svg`);
        // console.log(weathericon);
        const combinedHourlydata = [...data.forecast.forecastday[0].hour,...data.forecast.forecastday[1].hour] ;
        // console.log(combinedHourlydata);

        displayHourlyForecast(combinedHourlydata);
        Searchinput.value = data.location.name ;
    } catch (error) {
        document.body.classList.add("show-no-results");
    }
}
locationBtn.addEventListener("click",()=>{
    navigator.geolocation.getCurrentPosition(position=>{
        // console.log(position);
        const {latitude , longitude } = position.coords ;
        const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;

        getweatherdetails(API_URL);
    },error=>{
alert("location access  denied . please permission allow kare agar feature use karna tho...warna rehne de !!  ")
    })
})

setupWeatherRequest("Rajbiraj");