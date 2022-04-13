import * as WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { IConnections } from '../interfaces/Connections';
import { Connections } from '../services/Connections';
import { RoomState } from '../interfaces/RoomState';
import { Connection } from '../interfaces/IConnection';

type Timer = ReturnType<typeof setTimeout>
type Interval = ReturnType<typeof setInterval>

interface extendedWS extends WebSocket
{
    connectionID: string;
}


export default class RoomSocketAPI 
{
    private wss: WebSocket.Server;
    private roomConnections: IConnections;
    private responseTimers: Map<string, Timer>; //A timer for each connection, the passed in callback will be run if the timer elapses. 
    private pingIntervals : Map<string, Interval>; //An interval for each connection, the passed in callback will be run every X seconds.

    constructor(_wss: WebSocket.Server, _rooms: IConnections)
    {
        this.roomConnections = new Connections();
        this.roomConnections = _rooms;
        this.wss = _wss;
        this.init();
        this.responseTimers = new Map<string, Timer>();
        this.pingIntervals = new Map<string, Interval>();
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
        let responseTimer: Timer = this.responseTimers.get(connectionID)!;
        if (typeof(responseTimer) !== 'undefined')
        {
            clearTimeout(responseTimer);
        };

    };

    public keepAlive(ws: extendedWS)
    {
        console.log('Pinging client with connectionID : ', ws.connectionID);
        ws.send('ping');
        
        let websocketTimeout: Timer  = setTimeout(() => 
        {
   
            console.log('Connection timed out ', ws.connectionID);
            this.removeConnection(ws);

        }, 5000);

        this.responseTimers.set(ws.connectionID, websocketTimeout);
    };

    init()
    {
        this.wss.on('connection', (ws: extendedWS) =>
        {
            this.decorateWebSocket(ws);

            //For a new connection, set up a timer to ping the client to check if it's still alive. 
            let pingInterval: Interval = setInterval(() => 
            {
                this.keepAlive(ws);
            }, 15000);
            
            //Store the ping interval so when we find the connection is disconnected we can end the interval,
            //there wont be any point checking if we already know it's disconnected.
            this.pingIntervals.set(ws.connectionID, pingInterval);

            ws.on('message', (_message: string) =>
            {

                _message = _message.toString();

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

                console.log('connection closed: ', ws.connectionID);
                this.removeConnection(ws);
            });

        });
    };

    removeConnection = (ws: extendedWS) =>
    {
        let timedOutInterval: Interval = this.pingIntervals.get(ws.connectionID)!;
            
            
        clearInterval(timedOutInterval);

        //As the connection has timed out, we no longer need the interval to call this function to send a ping.
        this.pingIntervals.delete(ws.connectionID);

        //We can also remove this from the responseTimers map.
        this.responseTimers.delete(ws.connectionID);

        this.roomConnections.removeConnection(ws.connectionID);
    };

    createRoom = (data: RoomState, ws: extendedWS) =>
    {
        console.log('> room insertion called with : ', JSON.stringify(data, null, 2));
        this.roomConnections.addRoom(this.roomConnections.createRoom(data.id, data.name, data.path));
        this.roomConnections.createConnection(data.id, ws.connectionID);
    }

    onClientUpdate = (data: RoomState, ws: extendedWS) => 
    {
        console.log('> client update called with : ', JSON.stringify(data, null, 2));

        if (typeof (data.id) === 'undefined')
        {
            console.log('There was a failure onClientUpdate, roomID was undefined');
            return;
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