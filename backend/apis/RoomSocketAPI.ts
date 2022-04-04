import * as WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { IConnections } from '../interfaces/Connections';
import { Connections } from '../services/Connections';
import { RoomState } from '../interfaces/RoomState';
import { IRooms } from '../interfaces/IRooms';
import { Connection } from '../interfaces/IConnection';

interface extendedWS extends WebSocket
{
    connectionID: string;
}

export default class RoomSocketAPI 
{
    private wss: WebSocket.Server;
    private roomConnections: IConnections;
    private rooms: IRooms;

    constructor(_wss: WebSocket.Server, _rooms: IRooms)
    {   
        this.roomConnections = new Connections();
        this.rooms = _rooms;
        this.wss = _wss;
        this.init();
    };

    init()
    {

        this.wss.on('connection', (ws: extendedWS) =>
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
        
                if (typeof (this.rooms.getRoom(data.id).id) === 'undefined')
                {
                   
                    this.insertNewRoom(data, ws);
                    return;
                }
                
                let connections: Connection = this.roomConnections.getConnection(data.id);
        
                //When we do not find the websocket in the rooms connections property. 
                
                if (connections.connectionIDs.indexOf(ws.connectionID) === -1)
                // if (rooms.getRoom(data.roomID).connections.indexOf(ws.connectionID) === -1)
                {
                    
                    //Join room event, resynch the room.
                    this.onJoinRoom(data.id, ws.connectionID);
        
                    return; 
                }
                
        
                //video position or pause/playing update
                //broadcast to all clients except the sender. 
                // (compare room with message to check for diff)
                this.onClientUpdate(data, ws);
        
            });
        
            ws.on('close', () =>
            {
                console.log('connection closed');
            });
        
            console.log('connection open');
            // ws.send('hello');
        });



    }


    insertNewRoom = (data: RoomState, ws: extendedWS) => {
        console.log('> room insertion called with : ', JSON.stringify(data, null, 2));
        this.rooms.addRoom(this.rooms.createRoom(data.id, data.name, data.path));
        this.roomConnections.createConnection(data.id, ws.connectionID);
    }
    
    onClientUpdate = (data: RoomState, ws: extendedWS) => 
    {
        console.log('> client update called with : ', JSON.stringify(data, null, 2));
        
        if (typeof(data.id) === 'undefined')
        {
            throw 'There was a failure onClientUpdate, roomID was undefined';
        };

        // //If current connection doesn't exist in connections, assume it's a join room event and add it.
        let _connections: Connection = this.roomConnections.getConnection(data.id);
    
        let doesRoomExist: boolean =  _connections.connectionIDs.indexOf(ws.connectionID) !== -1;

        if (doesRoomExist === false)
        {
          //  room.connections.push(ws.connectionID);
            this.roomConnections.addConnection(data.id, ws.connectionID);
        }

        this.broadcastRoomToOtherClients(data, ws);
      
    };
    
    //If re-synch required,
    //send message to host (first element)    (will need to ping each client to make sure the host is still connected, pop off connections if gone)
    onJoinRoom = (_roomID: string, _connectionID: string) =>
    {
        console.log('> Joining room called with roomID: ', _roomID, ' and connectionID', _connectionID);
        this.roomConnections.addConnection(_roomID, _connectionID);
    
        this.resynch(_roomID); // mutated.
    };
    
    resynch = (_roomID: string) => 
    {
        let hostConnection: string = this.roomConnections.getHost(_roomID);
        console.log('>> Resynch request sent to host: ', hostConnection);
        //Find a better way to type this 
        this.wss.clients.forEach((client: any) =>
        {
            if (client.connectionID === hostConnection)
            {
                client.send("Resynch");
            }
        });
    
    };
    
    broadcastRoomToOtherClients = (room: RoomState, ws: extendedWS) =>
    {   
        console.log('>> broadcast room called with. : ', JSON.stringify(room, null, 2));
        this.wss.clients.forEach((client: any) =>
        {
            let connectedClients: Connection = this.roomConnections.getConnection(room.id);
            let connectedClientIDs: string[] = connectedClients.connectionIDs;
            //TODO: There may need to be an extra check in here to avoid sending an update state to the same client (although this might be better) 
            if (connectedClientIDs.includes(client.connectionID) && ws.connectionID !== client.connectionID)
            {   
                //We only broadcast the pause state for now, it might be that we also broadcast back the video position,
                //Then on the client side we take that value and if it goes over a range we skip video position. 
                
                console.log('Sending message from ' + ws.connectionID + ' to ' + client.connectionID);
                client.send(JSON.stringify(room));
            }
        });
    };
    

};


