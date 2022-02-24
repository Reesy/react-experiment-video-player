import express = require("express");
import bodyParser = require('body-parser');
import * as WebSocket from 'ws';
import Library = require('./services/Library');
import path = require('path');
import { Rooms } from "./services/Rooms";
import { IRooms } from "./interfaces/IRooms";
import { Room } from "./interfaces/Room";
import { Video } from "./interfaces/Video";
import { v4 as uuidv4 } from 'uuid';
import { playingState } from "./interfaces/Video";


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

        if (typeof (data.roomID) === 'undefined')
        {
            //Message isn't of the correct format and this should through an error.

            throw new Error("Message is not of the correct format");
        };


        if (typeof (rooms.getRoom(data.roomID).roomID) === 'undefined')
        {

            let connections: Array<string> = [];
            connections.push(ws.connectionID);
            //search if a room exists. 
            rooms.addRoom(rooms.createRoom(data.roomID, data.roomName, data.video, connections));

        }
        else
        {
           
            let room: Room = rooms.getRoom(data.roomID);
            
            let currentlyPlaying: playingState = room.video.playingState;
            //If current connection doesn't exist in connections, assume it's a join room event and add it.

            if (room.connections.indexOf(ws.connectionID) === -1)
            {
                room.connections.push(ws.connectionID);
            }
            else
            {
                currentlyPlaying =  room.video.playingState === playingState.playing ? playingState.paused : playingState.playing;
                
                let video: Video = room.video;

                video.playingState = currentlyPlaying;
    
                rooms.updateRoomState(data.roomID, video);
    

            };


            wss.clients.forEach((client: any) =>
            {
                
                //TODO: There may need to be an extra check in here to avoid sending an update state to the same client (although this might be better) 
                if (room.connections.includes(client.connectionID))
                {   
                    //We only broadcast the pause state for now, it might be that we also broadcast back the video position,
                    //Then on the client side we take that value and if it goes over a range we skip video position. 
                    console.log('Sending message from ' + ws.connectionID + ' to ' + client.connectionID);
                    client.send(currentlyPlaying);
                }
            });
        };


    });

    ws.on('close', () =>
    {
        console.log('connection closed');
    });

    console.log('connection open');
    // ws.send('hello');
});

console.log('Awaiting connections');