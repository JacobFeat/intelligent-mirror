let mapFncActive = false;

const texts = document.querySelector(".voice__container--texts");

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new window.SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "en-US";
const text = document.querySelector(".text");
let p = document.createElement("p");

const newsTargetWords = {
  back: {
    words: ["wróć", "powrót", "back", "return"],
    fnc: () => addNews(dataArr),
  },
  news: {
    words: ["wiadomości", "news"],
    fnc: newsChooser,
  },
  business: {
    words: ["biznes", "business"],
    fnc: () => fetchNews(rss.rssBBCBusiness),
  },
  world: {
    words: ["świat", "world"],
    fnc: () => fetchNews(rss.rssBBCWorld),
  },
  politics: {
    words: ["polityka", "politic"],
    fnc: () => fetchNews(rss.rssBBCPolitics),
  },
  // poland: {
  //   words: ["polska", "poland", "Polska", "Poland"],
  //   fnc: () => fetchNews(rss.rssBBCPolska),
  // },
  tech: {
    words: ["technolog", "technology", "tech"],
    fnc: () => fetchNews(rss.rssBBCTechnology),
  },
  // culture: {
  //   words: ["kultura", "culture"],
  //   fnc: () => fetchNews(rss.rssBBC),
  // },
  sport: {
    words: ["sport", "sporty", "sports"],
    fnc: () => fetchNews(rss.rssBBCSport),
  },
  health: {
    words: ["zdrowi", "health"],
    fnc: () => fetchNews(rss.rssBBCHealth),
  },
  firstNews: {
    words: ["pierwsza wiadomość", "pierwszą", "pierwsz", "first", "one"],
    fnc: () => showCertainNews(0),
  },
  secondNews: {
    words: ["druga wiadomość", "druga", "drugą", "drugie", "second", "two"],
    fnc: () => showCertainNews(1),
  },
  thirdNews: {
    words: ["trzecia wiadomość", "trzecia", "trzecią", "trzecie", "third", "three"],
    fnc: () => showCertainNews(2),
  },
  fourthNews: {
    words: ["czwarta wiadomość", "czwarta", "czwartą", "czwarte", "fourth", "four"],
    fnc: () => showCertainNews(3),
  },
  fifthNews: {
    words: ["piąta wiadomość", "piąta", "piątą", "piąte", "fifth", "five"],
    fnc: () => showCertainNews(4),
  },
  weatherInside: {
    words: ["w domu", "w środku", "w pokoju", "w mieszkaniu", "inside", "room"],
    fnc: () => readWeather(degreeInside),
  },
  weatherOutside: {
    words: [
      "temperatura na polu",
      "temperatura na zewnątrz",
      "ile jest stopni na polu",
      "ile jest stopni na zewnątrz",
      "na polu",
      "na zewnątrz",
      "pogoda",
      "weather",
      "temperature outside",
    ],
    fnc: () => readWeather(degreeOutside),
  },
  // weatherChoice: {
  //   words: ['ile jest stopni', 'jaka jest temperatura', 'temperatura', 'stopni'],
  //   fnc: () => justRead("Na zewnątrz czy w domu?")
  // },
  pressure: {
    words: ["ciśnieni", 'pressure'],
    fnc: () => readWeather(pressure),
  },
  calendar: {
    words: ["kalendarz", "wydarzenia", "zaplanowane", "events", "calendar"],
    fnc: readCalendarEvents,
  },
  time: {
    words: ["godzina", "time"],
    fnc: () => readFromServer(hourMinutesWrapper.textContent),
  },
  maps: {
    words: ["mapa", "map", "maps", "droga"],
    fnc: () => chooseDestination(),
  },
};

let prevWord = "";
recognition.addEventListener("result", (e) => {
  const htmlText = Array.from(e.results)
    .map((result) => result[0].transcript)
    .join("");

  //protect from duplicate
  if (prevWord === htmlText) return;

  p.innerText = htmlText;
  texts.appendChild(p);

  // if (prevWord === "navigate to") {
  //   readFromServer("Where?");
  //   recognition.lang = "pl-PL";
  //   console.log(htmlText);
  //   initMap(htmlText);
  //   const mapContainer = document.querySelector("#map");
  //   mapContainer.classList.add("map-active");
  // }

  if(mapFncActive){
    console.log(htmlText);
    initMap(htmlText);
    const mapContainer = document.querySelector("#map");
    mapContainer.classList.add("map-active");
    mapFncActive = false;
  } else{
    recognition.lang = "en-US";
    for (let category in newsTargetWords) {
      newsTargetWords[category].words.forEach((word) => {
        if (htmlText.toLowerCase().includes(word)) {
          newsTargetWords[category].fnc();
        }
      });
    }
  }
  

  console.log(mapFncActive);
  prevWord = htmlText;
});

recognition.addEventListener("end", continueSpeak);
// if (prevWord.toLowerCase().includes("trasa")) {
//   console.log(prevWord);
//   const destinationAddress = prevWord.slice(9);
//   initMap(destinationAddress);
//   const mapContainer = document.querySelector("#map");
//   mapContainer.classList.add("map-active");
// }

function continueSpeak(){
  recognition.start();
}

function chooseDestination(destination) {
  recognition.lang = "pl-PL";
  // recognition.removeEventListener("end", continueSpeak);
  recognition.stop();
  mapFncActive = true;
  readFromServer("Where would you like to go?");
  setTimeout(() => {
    recognition.start();
    // recognition.addEventListener("end", continueSpeak);
  }, 2000);
}

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

// const rss = {
//   rssBBCPolska: "https://www.polsatnews.pl/rss/polska.xml",
//   rssBBCŚwiat: "https://www.polsatnews.pl/rss/swiat.xml",
//   rssBBCBiznes: "https://www.polsatnews.pl/rss/biznes.xml",
//   rssBBCTechnologia: "https://www.polsatnews.pl/rss/technologie.xml",
//   rssBBCKultura: "https://www.polsatnews.pl/rss/kultura.xml",
//   rssBBCSport: "https://www.polsatnews.pl/rss/sport.xml",
// };
const rss = {
  rssBBCBusiness: "http://feeds.bbci.co.uk/news/business/rss.xml",
  rssBBCWorld: "http://feeds.bbci.co.uk/news/world/rss.xml",
  rssBBCPolitics: "http://feeds.bbci.co.uk/news/politics/rss.xml",
  rssBBCHealth: "http://feeds.bbci.co.uk/news/health/rss.xml",
  rssBBCTechnology: "http://feeds.bbci.co.uk/news/technology/rss.xml",
  rssBBCSport: "http://feeds.bbci.co.uk/sport/football/rss.xml?edition=uk",
};

// const msg = new SpeechSynthesisUtterance();
// let voices = [];

// function populateVoices() {
//   voices = this.getVoices().filter((item) => {
//     return item.lang.includes("pl");
//     // return item.lang.includes("en");
//   });
//   msg.voice = voices[1];
// }

// speechSynthesis.addEventListener("voiceschanged", populateVoices);

let degreeOutside = document.querySelectorAll(".degree")[0];
let degreeInside = document.querySelectorAll(".degree")[1];
let pressure = document.querySelector(".pressure");

function readCalendarEvents() {
  let text = "";
  const events = document.querySelectorAll(".event-container");
  events.forEach((event) => {
    text += `${event.childNodes[0].textContent} ${event.childNodes[1].textContent},\n`;
  });
  readFromServer(text);
  mapFncActive = false;
}

function readFromServer(text) {
  const str = { read: text };

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  fetch("/postVoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(str),
  })
    .then((res) => res.json())
    .catch((err) => console.error(`Error: ${err}`));
}

function newsChooser() {
  mapFncActive = false;
  let text = "";
  text = `What kind of news do you want to listen to?`;
  // msg.text = "Jaką kategorię wiadomości chcesz usłyszeć?";

  readFromServer(text);

  const newsCategories = [];
  for (let key in rss) {
    const newsCategory = key.slice(6);
    newsCategories.push(newsCategory);
  }
  setTimeout(() => {
    text = "";
    newsCategories.forEach((news) => (text += news + ", "));
    readFromServer(text);
  }, 3500);
}

function readWeather(degree) {
  mapFncActive = false;
  if (degree === degreeInside) {
    readFromServer(`There is ${degree.innerText} in your room.`);
    // msg.text = `There are ${degree.innerText} in your room.`;
  } else if (degree === degreeOutside) {
    readFromServer(`There are ${degree.innerText} degrees outside.`);
    // msg.text = `There are ${degree.innerText} outside`;
  } else if (degree === pressure) {
    readFromServer(`There is ${degree.innerText.slice(0, degree.innerText.length - 3)} hectopascals.`);
    // msg.text = `There are ${degree.innerText}`;
  }
}

function showCertainNews(n) {
  mapFncActive = false;
  if (htmlNewsList.childElementCount) {
    htmlNewsList.innerHTML = dataArr[n].description;
    readFromServer(dataArr[n].description);
  }
}

function fetchNews(url) {
  mapFncActive = false;
  speechSynthesis.cancel();
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
        const preparedDescription = description.slice(11, description.length - 5);
        return {
          title: preparedTitle,
          description: preparedDescription,
        };
      });
      addNews(dataArr);
    });
}

const htmlNewsList = document.querySelector(".news-list");
let isExpanded = false;

function addNews(arr, amount = 5) {
  mapFncActive = false;
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
  speechSynthesis.cancel();
}

// function toggleNews(e) {
// if (e.target.parentElement.classList.contains("news-item")) {
//   htmlNewsList.innerHTML = e.target.parentElement.children[1].innerText;
//   justRead(htmlNewsList.innerHTML);
//   isExpanded = true;
// }
// if (isExpanded && e.target.classList.contains("news-list")) {
// addNews(dataArr);
// }
// }

function setDate() {
  let date = new Date();

  let hour = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let day = date.getDate();
  let year = date.getFullYear();
  let monthNumber = date.getMonth();

  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  let weekday = date.toLocaleString("en-US", { weekday: "long" });
  let month = date.toLocaleString("en-US", { month: "long" });
  dateWrapper.innerHTML = `${weekday}, ${day} ${month} ${year}`;

  hourMinutesWrapper.innerHTML = `${hour}:${minutes}`;
  secondsWrapper.innerHTML = `${seconds}`;

  setTimeout(setDate, 1000);
}

function setWeather() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${setCity}&appid=${API_KEY_WEATHER}`)
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

//GOOGLE MAP
const libiaz = {
  lat: 50.104,
  lng: 19.316,
};

const czyzynska = {
  lat: 50.07031,
  lng: 19.98394,
};

const pk = {
  lat: 50.071,
  lng: 19.94402,
};

const krakow = {
  lat: 50.049683,
  lng: 19.944544,
};

let map;

function initMap(destination) {
  map = new google.maps.Map(document.getElementById("map"), {
    // mapId: "c00655e134f4c556",
    mapId: "52abc03a2de896b5",
    // mapId: "b15f175e57145442",
    center: { lat: 50.061389, lng: 19.937222 },
    zoom: 14,
    zoomControl: false,
    disableDefaultUI: true,
  });
  //declare a object that we use get a result for our request
  const directionsService = new google.maps.DirectionsService();
  //declare a object that allow us to display route on the map
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  //PLACES API
  const options = {
    query: destination || "Warszawska 4 Kraków",
    // query: city,
    fields: ["name", "geometry"],
  };
  const service = new google.maps.places.PlacesService(map);

  let spokenPlaceLat, spokenPlaceLng, spokenPlaceCords;

  service.findPlaceFromQuery(options, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const originPlace = results[0];
      spokenPlaceLat = results[0].geometry.location.lat();
      spokenPlaceLng = results[0].geometry.location.lng();
      spokenPlaceCords = {
        lat: spokenPlaceLat,
        lng: spokenPlaceLng,
      };
      calcRoute(directionsService, directionsRenderer, czyzynska, spokenPlaceCords);
    }
  });
}

function calcRoute(directionsService, directionsRenderer, originPlace, destinationPlace, travelMode = "DRIVING") {
  const request = {
    origin: originPlace,
    destination: destinationPlace,
    travelMode: travelMode,
  };
  directionsService.route(request, (result, status) => {
    if (status == "OK") {
      directionsRenderer.setDirections(result);
      // const distanceField = document.querySelector('.distance-display');
      // const timeField = document.querySelector('.time-display');
      // distanceField.innerHTML = `Odległość: ${result.routes[0].legs[0].distance.text}`;
      // timeField.innerHTML = `Czas: ${result.routes[0].legs[0].duration.text}`;
      // distanceField.classList.toggle('distance-display-active');
    }
  });
}
