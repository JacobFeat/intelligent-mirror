const hourMinutesWrapper = document.querySelector(".hour-minutes");
const secondsWrapper = document.querySelector(".seconds");
const dateWrapper = document.querySelector(".date-wrapper");

const setCity = "Kraków";
const API_KEY_WEATHER = "a08ce44da6046f557c9d46c248879ec5";

turnOn();
let intervalTurnOn = setInterval(turnOn, 200000);

let data = [];
let dataArr = [];

const rss = {
  rssBBCBusiness: "http://feeds.bbci.co.uk/news/business/rss.xml",
  rssBBCWorld: "http://feeds.bbci.co.uk/news/world/rss.xml",
  rssBBCPolitics: "http://feeds.bbci.co.uk/news/politics/rss.xml",
  rssBBCHealth: "http://feeds.bbci.co.uk/news/health/rss.xml",
  rssBBCTechnology: "http://feeds.bbci.co.uk/news/technology/rss.xml",
  rssBBCSport: "http://feeds.bbci.co.uk/sport/football/rss.xml?edition=uk",
}

// function fillRSSVoiceCommand(destinationObj) {
//   for (const key in rss) {
//     const shortenKey = key.slice(6);
//     destinationObj[shortenKey] = () => fetchNews();
//     console.log(destinationObj);
//   }
// }
// // "World News": () => fetchNews(rss.rssBBCWorld),

const newsPicker = document.querySelector(".news-picker");

newsPicker.addEventListener("click", chooseNews);

const msg = new SpeechSynthesisUtterance();
let voices = [];

function populateVoices(){
  voices = this.getVoices().filter(item => {
    return item.lang.includes("en");
  });
  // console.log(voices);
  msg.voice = voices[5]; 
}

speechSynthesis.addEventListener('voiceschanged', populateVoices);

let degreeOutside = document.querySelectorAll('.degree')[0];
let degreeInside = document.querySelectorAll('.degree')[1];
let pressure = document.querySelector('.pressure');
degreeOutside.addEventListener('click', () => readWeather(degreeOutside));
degreeInside.addEventListener('click', () => readWeather(degreeInside));
pressure.addEventListener('click', () => readWeather(pressure));

function newsChooser(){
  const newsCategories = [];
  for(let key in rss){
    const newsCategory = key.slice(6);
    newsCategories.push(newsCategory);
  }
  msg.text = `What kind of news do you want to listen to?`;
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
  setTimeout(()=> {
    msg.text = '';
    newsCategories.forEach(news => msg.text += ',' + news + "?");
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
  },3500)
}


function readWeather(degree){
  if(degree === degreeInside){
    msg.text = `There are ${degree.innerText} in your room.`;
  } else if(degree === degreeOutside){
    msg.text = `There are ${degree.innerText} outside`;
  } else if(degree === pressure){
    msg.text = `There are ${degree.innerText}`;
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

function justRead(item){
  msg.text = item;
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

if (annyang) {
  
  const commands = {
    "First": () => showCertainNews(0),
    "One": () => showCertainNews(0),
    "Second": () => showCertainNews(1),
    "Third": () => showCertainNews(2),
    "Fourth": () => showCertainNews(3),
    "Fifth": () => showCertainNews(4),
    "The weather": () => readWeather(degreeOutside),
    "Temperature": () => readWeather(degreeInside),
    "News": () => fetchNews(newsChooser),
    "Business": () => fetchNews(rss.rssBBCBusiness),
    "World": () => fetchNews(rss.rssBBCWorld),
    "Politics": () => fetchNews(rss.rssBBCPolitics),
    "Health": () => fetchNews(rss.rssBBCHealth),
    "Technology": () => fetchNews(rss.rssBBCTechnology),
    "Sport": () => fetchNews(rss.rssBBCSport),
  };
  // fillRSSVoiceCommand(commands);


  function myname() {
    console.log("My name is Jakub!");
  }

  // Add Commands
  annyang.addCommands(commands);

  // Start listening
  annyang.start();
}

function showCertainNews(n){
  if(htmlNewsList.childElementCount){
    htmlNewsList.innerHTML = dataArr[n].description;
    justRead(dataArr[n].description);
  }
}

function chooseNews(e) {
  e.preventDefault();
  const choosenType = e.target.innerText;
  switch (choosenType) {
    case "Business":
      fetchNews(rssBBCBusiness);
      break;
    case "World":
      fetchNews(rssBBCWorld);
      break;
    default:
      return null;
  }
}

function fetchNews(url) {
  fetch(url)
    .then((res) => res.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/html"))
    .then((data) => {
      const items = data.querySelectorAll("item");
      data = [...items];
      dataArr = data.map((item) => {
        const title = item.querySelector("title").innerText;
        const preparedTitle = title.slice(9, title.length - 3) + ".";
        const description = item.querySelector("description").innerHTML;
        const preparedDescription = description.slice(11,description.length - 5);
        return {
          title: preparedTitle,
          description: preparedDescription,
        };
      });
      addNews(dataArr);
      speechSynthesis.cancel();
    });
}


// fetch("/sample-api")
  // .then(data => data)
  // .then(data => console.log(data))

const htmlNewsList = document.querySelector(".news-list");
let isExpanded = false;

function addNews(arr, amount = 5) {
  let html = ``;
  for (let i = 0; i < amount; i++) {
    html += `
    <li class="news-item">
    <h2>${arr[i].title}</h2>
    <p class="item-desc-hidden">${arr[i].description}<p>
    </li>
    `;
  }
  htmlNewsList.innerHTML = html;
  htmlNewsList.addEventListener("click", toggleNews);
}

function toggleNews(e) {
  if (e.target.parentElement.classList.contains("news-item")) {
    htmlNewsList.innerHTML = e.target.parentElement.children[1].innerText;
    justRead(htmlNewsList.innerHTML);
    isExpanded = true;
  }

  if (isExpanded && e.target.classList.contains("news-list")) {
    addNews(dataArr);
    speechSynthesis.cancel();
  }
}

function dateDiff(){
  // let date = new Date();
  // let day = date.getDate();
  // let year = date.getFullYear();
  // let monthNumber = date.getMonth();
  // console.log(`${year}-${monthNumber+1}-${day}`);
}
dateDiff();

function setDate() {
  let date = new Date();

  let hour = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let day = date.getDate();
  let year = date.getFullYear();
  let monthNumber = date.getMonth();
  // console.log(`${year}-${monthNumber+1}-${day}`);

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
  let weekday = date.toLocaleString('en-GB', { weekday: "long" });
  let month = date.toLocaleString('en-GB', { month: "long" });
  dateWrapper.innerHTML = `${weekday}, ${day} ${month} ${year}`;
  //   }

  hourMinutesWrapper.innerHTML = `${hour}:${minutes}`;
  secondsWrapper.innerHTML = `${seconds}`;

  setTimeout(setDate, 1000);
}

function setWeather() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${setCity}&appid=${API_KEY_WEATHER}`
  )
    .then((res) => res.json())
    .then(({ name, sys: { country }, main: { temp, pressure } }) => {
      let cityName = document.querySelector(".city-name");
      let degreeWrapper = document.querySelector(".out-weather .degree");
      let pressureWrapper = document.querySelector(".pressure");

      let currentCity = name;
      let currentCountry = country;
      let currentDegree = (temp - 273.15).toFixed(1);
      let currentPressure = pressure;

      cityName.innerHTML = `${setCity}, ${currentCountry}`;
      pressureWrapper.innerHTML = `${currentPressure} hPa`;
      degreeWrapper.innerHTML = `${currentDegree}°`;
    });

  fetch("degrees.txt")
    .then((res) => res.text())
    .then((data) => {
      let degreeWrapper = document.querySelector(".in-weather .degree");
      let currentInDegree = Number(data).toFixed(1);

      degreeWrapper.innerHTML = `${currentInDegree}°`;
    });

  setTimeout(setWeather, 100000);
}

function turnOn() {
  fetch("turnOn.txt")
    .then((res) => res.text())
    .then((data) => {
      if (data == "start") {
        setDate();
        setWeather();
      }
    });
}


     