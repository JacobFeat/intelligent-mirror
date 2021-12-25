// voice recognition -------------------- 

const texts = document.querySelector(".voice__container--texts");

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new window.SpeechRecognition();
recognition.interimResults = true;
// recognition.lang = "en-US";
const text = document.querySelector(".text");
let p = document.createElement("p");

const newsTargetWords = {
  news: {
    words: ["wiadomości", "news"],
    fnc: newsChooser,
  },
  business: {
    words: ["biznes", "business"],
    fnc: () => fetchNews(rss.rssBBCBiznes),
  },
  world: {
    words: ["świat", "world"],
    fnc: () => fetchNews(rss.rssBBCŚwiat),
  },
  poland: {
    words: ["polska", "poland", "Polska", "Poland"],
    fnc: () => fetchNews(rss.rssBBCPolska),
  },
  tech: {
    words: ["technolog", "technology", "tech"],
    fnc: () => fetchNews(rss.rssBBCTechnologia),
  },  
  culture: {
    words: ["kultura", "culture"],
    fnc: () => fetchNews(rss.rssBBCKultura),
  },
  firstNews: {
    words: ['pierwsza wiadomość', 'pierwsza', 'pierwszą', 'first'],
    fnc: () => showCertainNews(0),
  },  
  secondNews: {
    words: ['druga wiadomość', 'druga', 'drugą', 'second'],
    fnc: () => showCertainNews(1),
  },  
  thirdNews: {
    words: ['trzecią wiadomość', 'trzecia', 'trzecią', 'third'],
    fnc: () => showCertainNews(2),
  },  
  fourthNews: {
    words: ['czwarta wiadomość', 'czwarta', 'czwartą', 'fourth'],
    fnc: () => showCertainNews(3),
  },  
  fifthNews: {
    words: ['piąta wiadomość', 'piąta', 'piątą', 'fifth'],
    fnc: () => showCertainNews(4),
  },
};

let prevWord = '';
recognition.addEventListener("result", (e) => {
  const htmlText = Array.from(e.results)
  .map((result) => result[0].transcript)
  .join("");

  if(prevWord === htmlText) return;  
  
  p.innerText = htmlText;
  texts.appendChild(p);
  
  console.log(htmlText);
  for (let category in newsTargetWords) {
    newsTargetWords[category].words.forEach((word) => {
      if (htmlText.toLowerCase().includes(word)) {
        newsTargetWords[category].fnc();
      }
    });
  }
  
  prevWord = htmlText;
  // console.log(htmlText);
  // if(e.results[0].isFinal){
  //     p = document.createElement('p');
  // }
});

recognition.addEventListener("end", (e) => {
  recognition.start();
});

recognition.start();

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
  rssBBCPolska: "https://www.polsatnews.pl/rss/polska.xml",
  rssBBCŚwiat: "https://www.polsatnews.pl/rss/swiat.xml",
  rssBBCBiznes: "https://www.polsatnews.pl/rss/biznes.xml",
  rssBBCTechnologia: "https://www.polsatnews.pl/rss/technologie.xml",
  rssBBCKultura: "https://www.polsatnews.pl/rss/kultura.xml",
  rssBBCSport: "https://www.polsatnews.pl/rss/sport.xml",
};
// const rss = {
//   rssBBCBusiness: "http://feeds.bbci.co.uk/news/business/rss.xml",
//   rssBBCWorld: "http://feeds.bbci.co.uk/news/world/rss.xml",
//   rssBBCPolitics: "http://feeds.bbci.co.uk/news/politics/rss.xml",
//   rssBBCHealth: "http://feeds.bbci.co.uk/news/health/rss.xml",
//   rssBBCTechnology: "http://feeds.bbci.co.uk/news/technology/rss.xml",
//   rssBBCSport: "http://feeds.bbci.co.uk/sport/football/rss.xml?edition=uk",
// }

// function fillRSSVoiceCommand(destinationObj) {
//   for (const key in rss) {
//     const shortenKey = key.slice(6);
//     destinationObj[shortenKey] = () => fetchNews();
//     console.log(destinationObj);
//   }
// }
// // "World News": () => fetchNews(rss.rssBBCWorld),

const msg = new SpeechSynthesisUtterance();
let voices = [];

function populateVoices() {
  voices = this.getVoices().filter((item) => {
    return item.lang.includes("pl");
    // return item.lang.includes("en");
  });
  // console.log(voices);
  msg.voice = voices[1];
}

speechSynthesis.addEventListener("voiceschanged", populateVoices);

let degreeOutside = document.querySelectorAll(".degree")[0];
let degreeInside = document.querySelectorAll(".degree")[1];
let pressure = document.querySelector(".pressure");
degreeOutside.addEventListener("click", () => readWeather(degreeOutside));
degreeInside.addEventListener("click", () => readWeather(degreeInside));
pressure.addEventListener("click", () => readWeather(pressure));

function readCalendarEvents() {
  const events = document.querySelectorAll(".event-container");
  events.forEach((event) => {
    msg.text = event.innerText;
  });
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
  console.log(msg.text);
}

// setTimeout(() => {
//   readCalendarEvents();
// }, 2000)

function newsChooser() {
  msg.text = '';
  console.log('work');
  // msg.text = `What kind of news do you want to listen to?`;
  msg.text = "Jaką kategorię wiadomości chcesz usłyszeć?";
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);

  const newsCategories = [];
  for (let key in rss) {
    const newsCategory = key.slice(6);
    newsCategories.push(newsCategory);
  }
  setTimeout(() => {
    msg.text = "";
    newsCategories.forEach((news) => (msg.text += news + ", "));
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
  }, 3500);
}

function readWeather(degree) {
  if (degree === degreeInside) {
    msg.text = `W twoim pokoju jest ${degree.innerText}.`;
    // msg.text = `There are ${degree.innerText} in your room.`;
  } else if (degree === degreeOutside) {
    msg.text = `Na zewnątrz jest ${degree.innerText}.`;
    // msg.text = `There are ${degree.innerText} outside`;
  } else if (degree === pressure) {
    msg.text = `Ciśnienie wynosi ${degree.innerText}`;
    // msg.text = `There are ${degree.innerText}`;
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

function justRead(item) {
  msg.text = " ";
  msg.text = item;
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

// if (annyang) {

//   const commands = {
//     "The weather": () => readWeather(degreeOutside),
//     "Temperature": () => readWeather(degreeInside),
//     "News": newsChooser,
//     "Business": () => fetchNews(rss.rssBBCBusiness),
//     "World": () => fetchNews(rss.rssBBCWorld),
//     "Politics": () => fetchNews(rss.rssBBCPolitics),
//     "Health": () => fetchNews(rss.rssBBCHealth),
//     "Technology": () => fetchNews(rss.rssBBCTechnology),
//     "Sport": () => fetchNews(rss.rssBBCSport),
//     "First": () => showCertainNews(0),
//     "First news": () => showCertainNews(0),
//     "One": () => showCertainNews(0),
//     "Second": () => showCertainNews(1),
//     "Second news": () => showCertainNews(1),
//     "Third news": () => showCertainNews(2),
//     "Fourth news": () => showCertainNews(3),
//     "Fifth news": () => showCertainNews(4),
//   };
//   // fillRSSVoiceCommand(commands);

//   function myname() {
//     console.log("My name is Jakub!");
//   }

//   // Add Commands
//   annyang.addCommands(commands);

//   // Start listening
//   annyang.start();
// }

const calendarTitle = document.querySelector(".calendar__title");
calendarTitle.addEventListener("click", readCalendar);

function readCalendar() {
  const calendarEvents = document.querySelectorAll(".event-container");
  speechSynthesis.cancel();
  msg.text = " ";
  calendarEvents.forEach((event) => {
    msg.text += "," + event.textContent + ",";
  });
  speechSynthesis.speak(msg);
}

function showCertainNews(n) {
  if (htmlNewsList.childElementCount) {
    htmlNewsList.innerHTML = dataArr[n].description;
    justRead(dataArr[n].description);
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
        const preparedDescription = description.slice(
          11,
          description.length - 5
        );
        return {
          title: preparedTitle,
          description: preparedDescription,
        };
      });
      addNews(dataArr);
      speechSynthesis.cancel();
    });
}

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

function dateDiff() {
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
  let weekday = date.toLocaleString("en-GB", { weekday: "long" });
  let month = date.toLocaleString("en-GB", { month: "long" });
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
