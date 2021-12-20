const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const fs = require('fs');
// const xml2js = require('xml2js');
// const util = require('util');

// const parser = new xml2js.Parser();

// fs.readFile('https://www.polsatnews.pl/rss/polska.xml', (err, data) => {
// 	parser.parseString(data, (err, result) => {
// 		console.log(util.inspect(result, false, null, true));
// 	});
// });

const app = express();

app.use(express.static("public"));//display css and js
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
  origin: 'http://localhost:4000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
  });

app.get('/sample-api', (req, res) => {

});

app.listen(process.env.PORT || 8000, function(){
    console.log(`Server started on port `);
  });
 
  