var express = require("express");
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/video/library', function (req, res) {
    
    var response = 
    [
        {name: "Harry potter", resourcePath: "/resources/harryPotter"},
        {name: "The Matrix", resourcePath: "/resources/theMatrix"}
    ]
    res.send(response);
});

console.log("Listening on port 3050");
app.listen(3050);