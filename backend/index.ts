import express = require("express");
import bodyParser = require('body-parser');
import * as WebSocket from 'ws';
import Library = require('./services/Library');
import path = require('path');
import { Rooms } from "./services/Rooms";
import { IRooms } from "./interfaces/IRooms";
import { RoomResource } from "./interfaces/RoomResource";
import { RoomState } from "./interfaces/RoomState";
import { v4 as uuidv4 } from 'uuid';
import { Connections } from "./services/Connections";
import { IConnections } from "./interfaces/Connections";
import { Connection } from "./interfaces/IConnection";
import { config } from "./config";

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

let library = new Library.Library(contentDirectory, config.serving_path, thumbnailDirectory);
let cachedLibrary = library.getLibrary();

let rooms: IRooms = new Rooms();
let roomConnections: IConnections= new Connections();

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

 
    let room: RoomResource = rooms.createRoom(request.roomID, request.videoState);
    
    roomConnections.createConnection(request.roomID, request.connectionID);
    
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


let insertNewRoom = (data: RoomState, ws: extendedWS) => {
    console.log('> room insertion called with : ', JSON.stringify(data, null, 2));
    rooms.addRoom(rooms.createRoom(data.id, data.name));
    roomConnections.createConnection(data.id, ws.connectionID);
}

let onClientUpdate = (data: RoomState, ws: extendedWS) => 
{
    console.log('> client update called with : ', JSON.stringify(data, null, 2));
    
    if (typeof(data.id) === 'undefined')
    {
        throw 'There was a failure onClientUpdate, roomID was undefined';
    };

    // if (typeof(data.room) === 'undefined')
    // {
    //     throw 'There was a failure onClientUpdate, video was undefined';
    // };

    // let room: Room = rooms.getRoom(data.roomID);
    // room.resynch = false; //This prevents a feedback loop, will need to do this better by distinguishing between sockets.

    // //If current connection doesn't exist in connections, assume it's a join room event and add it.
    let _connections: Connection = roomConnections.getConnection(data.id);

    let doesRoomExist: boolean =  _connections.connectionIDs.indexOf(ws.connectionID) !== -1;
    // if (presentRoom)

    
    // _connections.connectionIDs.indexOf(ws.connectionID) === -1
    
    if (doesRoomExist === false)
    {
      //  room.connections.push(ws.connectionID);
        roomConnections.addConnection(data.id, ws.connectionID);
    }

    
    // else
    // {
    //     // video.playingState = currentlyPlaying;
    //     // video.videoPosition = data.video.videoPosition;
    //    if (data.video)
    //    {    
    //        //We only really wish to update these properties.
    //         room.video.videoPosition = data.video.videoPosition;
    //         room.video.playingState = data.video.playingState;  
    //         rooms.updateRoomState(data.roomID, data.video);
    //    };
        
    // };

    broadcastRoomToOtherClients(data, ws);
  
};

//If re-synch required,
//send message to host (first element)    (will need to ping each client to make sure the host is still connected, pop off connections if gone)
let onJoinRoom = (_roomID: string, _connectionID: string) =>
{
    console.log('> Joining room called with roomID: ', _roomID, ' and connectionID', _connectionID);
    roomConnections.addConnection(_roomID, _connectionID);

    resynch(_roomID); // mutated.
};

let resynch = (_roomID: string) => 
{
    let hostConnection: string = roomConnections.getHost(_roomID);
    console.log('>> Resynch request sent to host: ', hostConnection);
    //Find a better way to type this 
    wss.clients.forEach((client: any) =>
    {
        if (client.connectionID === hostConnection)
        {
            client.send("Resynch");
        }
    });

};

//Todo: See if this is necessary.

//This will broadcast a message to all clients apart from the calling client. 
let broadcastRoomToOtherClients = (room: RoomState, ws: extendedWS) =>
{   
    console.log('>> broadcast room called with. : ', JSON.stringify(room, null, 2));
    wss.clients.forEach((client: any) =>
    {
        let connectedClients: Connection = roomConnections.getConnection(room.id);
        let connectedClientIDs: string[] = connectedClients.connectionIDs;
        //TODO: There may need to be an extra check in here to avoid sending an update state to the same client (although this might be better) 
        if (connectedClientIDs.includes(client.connectionID) && ws.connectionID !== client.connectionID)
        {   
         //   console.log("The room is:", JSON.stringify(room))
            //We only broadcast the pause state for now, it might be that we also broadcast back the video position,
            //Then on the client side we take that value and if it goes over a range we skip video position. 
            
            console.log('Sending message from ' + ws.connectionID + ' to ' + client.connectionID);
            client.send(JSON.stringify(room));
        }
    });
};


wss.on('connection', (ws: extendedWS) =>
{

    // Check if the WS has been decorated with a connectionID if not add one!
    if (typeof (ws.connectionID) === 'undefined')
    {
        ws.connectionID = uuidv4();
        console.log('Connection established for the first time, decorating connection with the following connectionID: ',  ws.connectionID);
    };


    ws.on('message', (message) =>
    {
        console.log('---------------------------------------------')

        let data: RoomState = JSON.parse(message.toString());
        

        //Check that the data is correct

        if (typeof(data.name) === "undefined")
        {
            console.log('A socket message was sent with a wrong type: ');
            console.log(JSON.stringify(data, null, 2));

            return; //Maybe this should be a throw event. 

        }

         //If no room exists, create one 

        if (typeof (rooms.getRoom(data.id).id) === 'undefined')
        {
           
            insertNewRoom(data, ws);
            return;
        }
        
        let connections: Connection = roomConnections.getConnection(data.id);

        //When we do not find the websocket in the rooms connections property. 
        
        if (connections.connectionIDs.indexOf(ws.connectionID) === -1)
        // if (rooms.getRoom(data.roomID).connections.indexOf(ws.connectionID) === -1)
        {
            
            //Join room event, resynch the room.
            onJoinRoom(data.id, ws.connectionID);

            return; 
        }
        

        //video position or pause/playing update
        //broadcast to all clients except the sender. 
        // (compare room with message to check for diff)
        onClientUpdate(data, ws);

    });

    ws.on('close', () =>
    {
        console.log('connection closed');
    });

    console.log('connection open');
    // ws.send('hello');
});

console.log('Awaiting connections');