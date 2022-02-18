import express = require("express");
import bodyParser = require('body-parser');
import * as WebSocket from 'ws';
import Library = require('./services/Library');
import path = require('path');
import { Rooms } from "./services/Rooms";
import { IRooms } from "./interfaces/IRooms";
import { Room } from "./interfaces/Room";
import { IVideoState, playingState } from "./interfaces/IVideoState";
import { v4 as uuidv4 } from 'uuid';


const app = express();
const ServedVideoLocation = '../videos'
const ServedThumbnailLocation = '../thumbnails'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let contentDirectory = path.join(__dirname, ServedVideoLocation);
let thumbnailDirectory = path.join(__dirname, ServedThumbnailLocation);
app.use(express.static(contentDirectory));
app.use(express.static(thumbnailDirectory));

let library = new Library.Library(contentDirectory, '', thumbnailDirectory);
let cachedLibrary = library.getLibrary();

let rooms: IRooms = new Rooms();


app.use((req, res, next) => 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/video/library', (req: express.Request, res: express.Response) =>
{
    console.log("Library api called from" + req.ip);
    res.send(cachedLibrary);
});

app.get('/api/video/scanLibrary', (req: express.Request, res: express.Response) =>
{
    library.scanLibrary();
    res.send("Beginning scan");
});


app.get('/api/rooms', (req: express.Request, res: express.Response) =>
{
    res.send(rooms.getRooms());
});

app.get('/api/room', (req: express.Request, res: express.Response) =>
{
    let roomID: any = req.query.roomID!;
    try 
    {
        let room = rooms.getRoom(roomID);
        res.send(room);
    }
    catch (error)
    {
        res.send(error);
    };

});

app.post('/api/room', (req: express.Request, res: express.Response) =>
{
    let request = req.body;

    let room: Room = rooms.createRoom(request.roomID, request.roomName, request.videoState, request.connections);

    rooms.addRoom(room);

    res.send(room);

});

console.log("Listening on port 3050");
app.listen(3050);

const wss: WebSocket.Server = new WebSocket.Server({ port: 7070 });

let isPaused = true;

interface extendedWS extends WebSocket
{
    connectionID: string;
}

wss.on('connection', (ws: extendedWS) =>
{

    // Check if the WS has been decorated with a connectionID if not add one!
    if (typeof (ws.connectionID) === 'undefined')
    {
        ws.connectionID = uuidv4();
    };


    ws.on('message', (message) =>
    {

        let data = JSON.parse(message.toString());

        if (typeof (data.roomID) !== 'undefined')
        {

            if (typeof (rooms.getRoom(data.roomID).roomID) === 'undefined')
            {

                let connections: Array<string> = [];
                connections.push(ws.connectionID);
                //search if a room exists. 
                rooms.addRoom(rooms.createRoom(data.roomID, data.roomName, data.videoState, connections));

            }
            else
            {
                let currentlyPlaying: playingState = isPaused === true ? playingState.paused : playingState.playing;

                let videoState: IVideoState = {
                    videoPath: data.videoState.videoPath,
                    playingState: currentlyPlaying,
                    videoPosition: 0
                }

                rooms.updateRoomState(data.roomID, videoState);

            }

        }


    });

    ws.on('close', () =>
    {
        console.log('connection closed');
    });

    console.log('connection open');
    // ws.send('hello');
});

console.log('Awaiting connections');


















// isPaused = !isPaused;
// wss.clients.forEach((client) =>
// {

//   if (client !== ws && client.readyState === WebSocket.OPEN) 
//   {


//     // read the room state and if client.connection exists in connections then send the message

//     let currentRooms: Array<Room> = rooms.getRooms();

//     currentRooms.forEach((room) =>
//     {
//       if (room.connections.includes(ws.connectionID))
//       {


//         let message = isPaused ? 'paused' : 'playing';
//         console.log('sending message to clients (that didnt trigger the event): ', message);
//         client.send(message);
//       }
//     });

//   };
// });