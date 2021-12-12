const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static("public"));//display css and js
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
  });

app.listen(process.env.PORT || 4000, function(){
    console.log(`Server started on port `);
  });
  