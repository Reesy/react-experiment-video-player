"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var Library = require("./services/Library");
var path = require("path");
var app = express();
var ServedVideoLocation = 'videos';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var contentDirectory = path.join(__dirname, ServedVideoLocation);
app.use(express.static(contentDirectory));
var library = new Library.Library(contentDirectory, '');
var cachedLibrary = library.getLibrary();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/api/video/library', function (req, res) {
    console.log("Library api called from" + req.ip);
    res.send(cachedLibrary);
});
console.log("Listening on port 3050");
app.listen(3050);
