
// Client ID and API key from the Developer Console
var CLIENT_ID = "905938872654-e35m48a8iaqs5t5mdqe14a5nrptkm1sd.apps.googleusercontent.com";
var API_KEY = "AIzaSyBOj5fiHKU0FQcKay7bEPLMnv_7pserK-Q";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

/**
 *  On load, called to load the auth2 library and API client      library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        // Listen for sign-in state changes.
        gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      },
      function (error) {
        appendPre(JSON.stringify(error, null, 2));
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    // signoutButton.style.display = "block";
    listUpcomingEvents();
  } else {
    // authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message, date) {
  var pre = document.getElementById("content");
  // var textContent = document.createTextNode(message + "\n");
  const eventContainer = document.createElement('div');
  eventContainer.classList.add('event-container');
  const myTextContent = document.createElement("p");
  const myDate = document.createElement("p");
  myTextContent.innerHTML = message;
  myDate.innerHTML = date;
  myDate.classList.add('calendar__date');
  myTextContent.classList.add("calendar__event");
  pre.appendChild(eventContainer);
  eventContainer.appendChild(myTextContent);
  eventContainer.appendChild(myDate);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 7,
      orderBy: "startTime",
    })
    .then(function (response) {
      var events = response.result.items;
      // appendPre("Upcoming events:");

      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          
          const slicedWhen = when.replace("T", " ").slice(0, 16)
          let date = new Date();
          let day = date.getDate();
          let year = date.getFullYear();
          let monthNumber = date.getMonth()+1;
          // console.log(`${year}-${monthNumber + 1}-${day}`);
          let eventDay = Number(slicedWhen.slice(8,10));
          let eventMonth = Number(slicedWhen.slice(5,7));
          let eventYear = Number(slicedWhen.slice(0,4));

          let daysToOccur = ''
          if(eventYear > year){
            const monthToEnd = 12 - monthNumber;
            const monthDiff = monthToEnd + eventMonth;
            if(monthDiff < 2){
              daysToOccur = `za ${31 - day + eventDay} dni`;
            } else {
              daysToOccur = `za ${monthDiff} miesiące`;
            }  
            //           if(monthDiff < 2){
            //   daysToOccur = `in ${31 - day + eventDay} days`;
            // } else {
            //   daysToOccur = `in ${monthDiff} months`;
            // }
          }
          else if(eventMonth > monthNumber){
            daysToOccur = `za ${monthDiff} miesiące`;
          }          
          // else if(eventMonth > monthNumber){
          //   daysToOccur = `in ${monthDiff} months`;
          // }
          else{
            if(eventDay - day === 1){
              daysToOccur = 'Jutro'
            } else {
              daysToOccur = `za ${eventDay - day} dni`;
            }
          }          
          // else{
          //   if(eventDay - day === 1){
          //     daysToOccur = 'Tomorrow'
          //   } else {
          //     daysToOccur = `in ${eventDay - day} days`;
          //   }
          // }

          if (!when) {
            when = event.start.date;
          }
          appendPre(event.summary, daysToOccur);
        }
      } else {
        appendPre("No upcoming events found.");
      }
    });
}