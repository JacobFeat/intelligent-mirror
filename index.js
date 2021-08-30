const hourMinutesWrapper = document.querySelector(".hour-minutes");
const secondsWrapper = document.querySelector(".seconds");
const dateWrapper = document.querySelector('.date-wrapper');

const setCity = "Kraków";

setDate();
setWeather();

function setDate() {
  let date = new Date();

  let hour = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let day = date.getDate();
  let year = date.getFullYear();


  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

//   if (minutes > 0) {
    let weekday = date.toLocaleString("default", { weekday: "long" });
    let month = date.toLocaleString("default", { month: "long" });
    dateWrapper.innerHTML = `${weekday}, ${day} ${month} ${year}`;
//   }

  hourMinutesWrapper.innerHTML = `${hour}:${minutes}`;
  secondsWrapper.innerHTML = `${seconds}`;

  setTimeout(setDate, 1000);
}

function setWeather(){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${setCity}&appid=7cf9c6d561a2141a8b09294a84ebad3e`)
    .then(res => res.json())
    .then(data => {

        let cityName = document.querySelector('.city-name');
        let degreeWrapper = document.querySelector('.out-weather .degree');
        let pressureWrapper = document.querySelector('.pressure');

        let currentCity = data.name;
        let currentCountry = data.sys.country;
        let currentDegree = (data.main.temp-273.15).toFixed(1);
        let currentPressure = data.main.pressure;
        

        cityName.innerHTML = `${currentCity}, ${currentCountry}`;
        pressureWrapper.innerHTML = `${currentPressure} hPa`;
        degreeWrapper.innerHTML = `${currentDegree}°`;
    });

    fetch("degrees.txt")
        .then(res => res.text())
        .then(data => {
            console.log(data);
        let degreeWrapper = document.querySelector('.in-weather .degree');
        let currentInDegree = data;

        degreeWrapper.innerHTML = `${currentInDegree}°`;

        })

        setTimeout(setWeather, 10000);
}





