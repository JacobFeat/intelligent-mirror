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
  back: {
    words: ["wróć", 'powrót'],
    fnc: () => addNews(dataArr),
  },
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
  sport: {
    words: ["sport", "sporty", 'sports'],
    fnc: () => fetchNews(rss.rssBBCSport),
  },
  firstNews: {
    words: ['pierwsza wiadomość', 'pierwszą','pierwsz', 'first'],
    fnc: () => showCertainNews(0),
  },  
  secondNews: {
    words: ['druga wiadomość', 'druga', 'drugą', 'drugie', 'second'],
    fnc: () => showCertainNews(1),
  },  
  thirdNews: {
    words: ['trzecia wiadomość', 'trzecia', 'trzecią', 'trzecie', 'third'],
    fnc: () => showCertainNews(2),
  },  
  fourthNews: {
    words: ['czwarta wiadomość', 'czwarta', 'czwartą', 'czwarte', 'fourth',],
    fnc: () => showCertainNews(3),
  },  
  fifthNews: {
    words: ['piąta wiadomość', 'piąta', 'piątą', 'piąte', 'fifth'],
    fnc: () => showCertainNews(4),
  },
  weatherInside: {
    words: ['w domu', 'w środku', 'w pokoju', 'w mieszkaniu'],
    fnc: () => readWeather(degreeInside)
  },
  weatherOutside: {
    words: ['temperatura na polu', 'temperatura na zewnątrz' , 'ile jest stopni na polu', 'ile jest stopni na zewnątrz', 'na polu', 'na zewnątrz', 'pogoda'],
    fnc: () => readWeather(degreeOutside)
  },
  weatherChoice: {
    words: ['ile jest stopni', 'jaka jest temperatura', 'temperatura', 'stopni'],
    fnc: () => justRead("Na zewnątrz czy w domu?")
  },
  pressure: {
    words: ['ciśnieni'],
    fnc: () => readWeather(pressure)
  },
  whoIsThePrettiest: {
    words: ['najpiękniejszy', 'najpiękniejsza'],
    fnc: () => justRead("chyba Jakub Kita"),
  },
  calendar: {
    words: ['kalendarz', 'wydarzenia', 'zaplanowane'],
    fnc: readCalendarEvents,
  },
  time: {
    words: ['godzina', 'time'],
    fnc: () => justRead(hourMinutesWrapper.textContent)
  }
};

let prevWord = '';
recognition.addEventListener("result", (e) => {
  const htmlText = Array.from(e.results)
  .map((result) => result[0].transcript)
  .join("");

  //protect from duplicate 
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
});


recognition.addEventListener("end", (e) => {
  
  // console.log(`previous: ${prevWord}`);
  // if(prevWord.toLowerCase() === 'sport'){
    // recognition.stop();
  // }
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

function readCalendarEvents() {
  msg.text = '';
  speechSynthesis.cancel();
  const events = document.querySelectorAll(".event-container");
  events.forEach((event) => {
    msg.text += `${event.childNodes[0].textContent} ${event.childNodes[1].textContent},\n`;
  });
  speechSynthesis.speak(msg);
  console.log(msg.text);
}

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

  let weekday = date.toLocaleString("default", { weekday: "long" });
  let month = date.toLocaleString("default", { month: "long" });
  dateWrapper.innerHTML = `${weekday}, ${day} ${month} ${year}`;

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


//GOOGLE MAP
const libiaz = {
  lat: 50.104,
  lng: 19.316
};

const czyzynska = {
  lat: 50.070310,
  lng: 19.983940
};

const pk = {
  lat: 50.071000,
  lng: 19.944020
};

const krakow = {
  lat: 50.049683,
  lng: 19.944544
}

let map;

function initMap() {
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
    var request = {
      query: 'Warszawa',
      fields: ['name', 'geometry'],
    };
    const service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // const originPlace = results[0]
        console.log(results[0].geometry.location.lat());
      }
    });

    calcRoute(directionsService, directionsRenderer, czyzynska, pk, "DRIVING");

}


function calcRoute(directionsService, directionsRenderer, originPlace, destinationPlace, travelMode) {
  const request = {
    origin: originPlace,
    destination: destinationPlace,
    travelMode: travelMode,
  };
  directionsService.route(request, (result, status) => {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
      // const distanceField = document.querySelector('.distance-display');
      // const timeField = document.querySelector('.time-display');
      // distanceField.innerHTML = `Odległość: ${result.routes[0].legs[0].distance.text}`;
      // timeField.innerHTML = `Czas: ${result.routes[0].legs[0].duration.text}`;
      // distanceField.classList.toggle('distance-display-active');
    }
  });
}

