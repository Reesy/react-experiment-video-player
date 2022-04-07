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
    private pingQueue: Map<string, NodeJS.Timeout>;

    constructor(_wss: WebSocket.Server, _rooms: IRooms)
    {
        this.roomConnections = new Connections();
        this.rooms = _rooms;
        this.wss = _wss;
        this.init();
        this.pingQueue = new Map<string, NodeJS.Timeout>();
    };


    // Check if the WS has been decorated with a connectionID if not add one!
    private decorateWebSocket(ws: extendedWS)
    {
        if (typeof (ws.connectionID) === 'undefined')
        {
            ws.connectionID = uuidv4();
            console.log('Connection established for the first time, decorating connection with the following connectionID: ', ws.connectionID);
        };
    };



    public achnowledgePing(connectionID: string)
    {
        console.log('Acknowledging response of connectionID : ', connectionID);
        let currenthing: any = this.pingQueue.get(connectionID);
        clearTimeout(currenthing);

    };

    public checkConnections(ws: extendedWS)
    {

        console.log('Pinging client with connectionID : ', ws.connectionID);
        ws.send('ping');

        let websocketTimeout = setTimeout(() => 
        {
            console.log('Connection timed out ', ws.connectionID);
        }, 5000);


        if (!this.pingQueue.has(ws.connectionID))
        {
            this.pingQueue.set(ws.connectionID, websocketTimeout);
        }



        // function pong() {
        //     clearTimeout(tm);
        // }
        // websocket_conn.onopen = function () {
        //     setInterval(ping, 30000);
        // }
        // websocket_conn.onmessage = function (evt) {
        //     var msg = evt.data;
        //     if (msg == '__pong__') {
        //         pong();
        //         return;
        //     }
        //     //////-- other operation --//
        // }




        // // 

        // this.wss.clients.forEach((client: any) =>
        // {
        //     // //Send a ping to the client
        //     client.send("Ping");

        //     client.on('pong', () =>
        //     {
        //         console.log('> Pong received from client: ', client.connectionID);
        //     });


        //     // //Wait 10 seconds for a response
        //     // setTimeout(() =>
        //     // {
        //     //     // if (client.readyState === WebSocket.OPEN)
        //     //     // {
        //     //     //     console.log('Client ' + client.connectionID + ' is still connected');
        //     //     // }
        //     //     // else
        //     //     // {
        //     //     //     console.log('Client ' + client.connectionID + ' is not connected');
        //     //     // }
        //     // }, 10000);




        //     // //Check if a response has been received
        //     // client.on('pong', () =>
        //     // {
        //     //     console.log('> Pong received from client: ', client.connectionID);
        //     // });



        //     // //Check if the client has disconnected
        //     // client.on('close', () =>
        //     // {
        //     //     console.log('Client disconnected');
        //     //     this.roomConnections.removeConnection(client.connectionID);
        //     // }
        //     // );

        // });
    };

    init()
    {
        this.wss.on('connection', (ws: extendedWS) =>
        {
            this.decorateWebSocket(ws);


            setInterval(() => 
            {
                console.log('Calling checkConnections');
                this.checkConnections(ws);
            }, 3000);


            ws.on('message', (_message: string) =>
            {

                if (_message === 'pong')
                {
                    this.achnowledgePing(ws.connectionID);
                    return;
                };

                let message: any = JSON.parse(_message);

                switch (message.type)
                {
                    case 'createRoom':
                        this.createRoom(message.roomState, ws);
                        break;
                    case 'updateRoom':
                        this.onClientUpdate(message.roomState, ws);
                        break;
                    case 'joinRoom':
                        this.onJoinRoom(message.roomState.id, ws.connectionID);
                        break;
                    default:
                        console.log('> Unknown message type: ', message.type);
                        break;
                };

            });

            ws.on('close', () =>
            {
                console.log('connection closed');
            });

        });
    };

    createRoom = (data: RoomState, ws: extendedWS) =>
    {
        console.log('> room insertion called with : ', JSON.stringify(data, null, 2));
        this.rooms.addRoom(this.rooms.createRoom(data.id, data.name, data.path));
        this.roomConnections.createConnection(data.id, ws.connectionID);
    }

    onClientUpdate = (data: RoomState, ws: extendedWS) => 
    {
        console.log('> client update called with : ', JSON.stringify(data, null, 2));

        if (typeof (data.id) === 'undefined')
        {
            throw 'There was a failure onClientUpdate, roomID was undefined';
        };

        // //If current connection doesn't exist in connections, assume it's a join room event and add it.
        let _connections: Connection = this.roomConnections.getConnection(data.id);

        let doesRoomExist: boolean = _connections.connectionIDs.indexOf(ws.connectionID) !== -1;

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


