const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const say = require('say')

// or, override the platform
// const Say = require('say').Say
// const say = new Say('darwin' || 'win32' || 'linux')

say.speak('co tam u was?');

const app = express();

app.use(express.static("public"));//display css and js
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
  });

app.get('/sample-api', (req, res) => {
    // // res.json({a: 1});
    // res.header("Content-Type",'application/json');
    // res.sendFile(path.join(__dirname, 'Temperatura.json'));
});

app.listen(process.env.PORT || 8000, function(){
    console.log(`Server started on port `);
  });
 
  