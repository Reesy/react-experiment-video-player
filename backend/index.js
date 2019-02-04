"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('videos'));
app.get('/api/video/library', function (req, res) {
    //This will get replaced by a database and algorithm for searching directories and adding libraries
    var response = [
        { name: "Part 1", resourcePath: "/PART1.mp4" },
        { name: "Part 2", resourcePath: "/PART2.mp4" },
        { name: "Part 3", resourcePath: "/PART3.mp4" }
    ];
    res.send(response);
});
console.log("Listening on port 3050");
app.listen(3050);
