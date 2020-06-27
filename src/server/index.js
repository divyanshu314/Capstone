var path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const app = express();

let projectData = {};

// BodyParser config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
app.use(express.static('dist'));

console.log(__dirname)

//Get route
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

//Post route
app.post('/voila', addInfo);
function addInfo(req, res) {
  projectData['depCity'] = req.body.depCity;
  projectData['arrCity'] = req.body.arrCity;
  projectData['depDate'] = req.body.depDate;
  projectData['weather'] = req.body.weather;
  projectData['summary'] = req.body.summary;
  projectData['daysLeft'] = req.body.daysLeft;
  res.send(projectData);
}


//Setup server
app.listen(8081, function () {
    console.log('Example app listening on port 8081!');
})

