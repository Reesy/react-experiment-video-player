import express = require("express");
import bodyParser = require('body-parser');
import * as WebSocket from 'ws';
import Library = require('./services/Library');
import path = require('path');
import { Rooms } from "./services/Rooms";
import { IRooms } from "./interfaces/IRooms";
import { config } from "./config";
import LibraryAPI from "./apis/LibraryAPI";
import RoomAPI from "./apis/RoomAPI";
import RoomSocketAPI from "./apis/RoomSocketAPI";

console.log(config.serving_path);

const app = express();
const ServedVideoLocation = '../videos'
const ServedThumbnailLocation = '../thumbnails'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let contentDirectory = path.join(__dirname, ServedVideoLocation);
let thumbnailDirectory = path.join(__dirname, ServedThumbnailLocation);

app.use('/' + config.serving_path, express.static(contentDirectory));
app.use('/' + config.serving_path, express.static(thumbnailDirectory));

app.use((req, res, next) => 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


let library = new Library.Library(contentDirectory, config.serving_path, thumbnailDirectory);
let libraryAPI = new LibraryAPI(app, library);

let rooms: IRooms = new Rooms();
let roomAPI = new RoomAPI(app, rooms);



console.log("Listening on port 3050");
app.listen(3050);

const wss: WebSocket.Server = new WebSocket.Server({ port: 7070 });

let roomSocketAPI = new RoomSocketAPI(wss, rooms);


console.log('Awaiting connections');