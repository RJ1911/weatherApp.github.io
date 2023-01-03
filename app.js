/*
    200 < code < 300 - thunderstorm
    300<- code -> 500 to 600 rain
    800 - clear sky , icon(day) = 01d , icon(night) = 01n
    600 - 622 - snow
    701 - 781 - mist ,fog ,....
    801 - few clouds , day = 02d , night = 02n
    804 - overcast clouds

*/




/*====================================Date======================================================== */
const dateElement = document.querySelector(".date");
const getCurrentDate = (timezoneOffset) => {
    const currentCityDate = new Date();

    const localTime = currentCityDate.getTime()
    const localOffset = currentCityDate.getTimezoneOffset() * 60000
    const utc = localTime + localOffset
    const city = utc + (1000 * timezoneOffset)
    const fetchedCityDate = new Date(city);

    const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const weekday = weekdays[fetchedCityDate.getDay()];
    const month = months[fetchedCityDate.getMonth()];
    const day = fetchedCityDate.getDate();
    let hours = fetchedCityDate.getHours();
    const minutes = String(fetchedCityDate.getMinutes()).padStart(2, '0');
    const ampm = hours <= 12 ? "AM" : "PM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    const date = `${weekday}   |   ${day} ${month}   |   ${hours}:${minutes} ${ampm}`;

    return date;
}

/*
    d = new Date()
localTime = d.getTime()
localOffset = d.getTimezoneOffset() * 60000
utc = localTime + localOffset
var atlanta = utc + (1000 * -14400)
nd = new Date(atlanta)

*/



/*============================================Form Input City Name==========================================================*/

const form = document.querySelector("form");
const input = document.querySelector("input");
const data_container = document.querySelector(".data-container");
const data_card = document.querySelector(".data-card");

const getWeather = async (city) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0047df6e414bf05f33930a8e660be34d&units=metric`);
    return response.json();

}

const getWeatherIcon = (id, icon) => {
    let imgName;
    // clear sky
    if (id == 800) {
        if (icon == "01d") // day
        {
            imgName = "clear_sky_day";
        }
        else if (icon == "01n") // night
        {
            imgName = "clear_sky_night";
        }
        else {
            imgName = "clear_sky_day";
        }
    }

    // few clouds 
    else if (id > 800 && id < 900) {
        if (icon == "02d") //day
        {
            imgName = "few_clouds_day";
        }
        else if (icon == "02n") // night
        {
            imgName = "few_clouds_night";
        }
        else {
            imgName = "clouds";
        }
    }

    // haze , fog , mist

    else if (id > 700 && id < 800) {
        imgName = "haze_fog_mist";
    }

    // rain

    else if (id >= 500 && id < 600) {
        imgName = "rain";
    }

    // snow
    else if (id >= 600 && id < 700) {
        imgName = "snow";
    }

    // thunderstorm
    else if (id >= 200 && id < 300) {
        imgName = "thunderstorm";
    }
    // error case
    else {
        imgName = "few_clouds_day"
    }

    return imgName;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    var city = input.value;
    if (!city) {
        data_container.innerHTML = `<font size=2 color = red>Please Enter a city name.</font>`;
        return;
    }
    data_container.innerHTML = `<div class="loaderContainer">
    <div class="loader">
    <span></span>
</div></div>`;

    getWeather(city).then((data) => {

        if (data.cod == 404) {
            setTimeout(() => {
                data_container.innerHTML = `<img style ="  width: 75px;
                height: 75px; margin-bottom: 40px;" class="sad_face" src="./weatherIcons/sad_face_white.png"/><h1> City Not Found!</h1>`;
            }, 1000);
            return;
        }
        else {

            const temp = data.main.temp;
            const humidity = data.main.humidity;
            const country = data.sys.country;
            const condition = data.weather[0].description;
            const conditionId = data.weather[0].id;
            const icon = data.weather[0].icon;

            const conditionImage = getWeatherIcon(conditionId, icon);
            // console.log(conditionId, conditionImage, data);

            const timezoneOffset = data.timezone;
            const date = getCurrentDate(timezoneOffset);
            city = data.name;


            const loading = setTimeout(() => {
                data_container.innerHTML = `
                <div class="data-items"><span class="city">${city}</span> , <span class="country">${country}</span></div>
                <img class="condition-image" src="./weatherIcons/${conditionImage}.png" alt="Weather Condition Image">
                <div class="data-items condition">${condition}</div>
                <div class="data-items">Temperature :&nbsp;&nbsp;<span class="temp-value">${temp} &deg;C</span></div>
                <div class="data-items">Humidity :&nbsp;&nbsp;<span class="humidity-value">${humidity}</span> &percnt;</div>
                <div class="data-items date">${date}</div>
                `;
            }, 2000);
        }

    })


})

//24:00&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;01&nbsp;&nbsp;JAN&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;SUN
