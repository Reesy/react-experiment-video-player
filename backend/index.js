"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var Library = require("./services/Library");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('videos'));
var library = new Library.Library();
var cachedLibrary = library.getLibrary();
app.get('/api/video/library', function (req, res) {
    res.send(cachedLibrary);
});
console.log("Listening on port 3050");
app.listen(3050);
