const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const say = require('say')

// or, override the platform
// const Say = require('say').Say
// const say = new Say('darwin' || 'win32' || 'linux')  

const app = express();

//display css and js
app.use(express.static("public"));
app.use(express.json());


app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
  });


app.post('/postVoice', (req, res) => {
  const data = req.body;
  // const voices = say.getInstalledVoices();
  // say.getInstalledVoices((err, voices) => console.log(voices))
  say.speak(data.read, 'Microsoft David Desktop');
  res.json({
    fnc: 'recognition.start()'
  })
});

app.listen(8000, function(){
    console.log(`Server started on port`);
  });
 
  