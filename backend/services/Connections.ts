import { IConnections } from "../interfaces/Connections";
import { Connection } from "../interfaces/IConnection";
import { RoomResource } from "../interfaces/RoomResource";

export class Connections implements IConnections
{
    private rooms : Array<RoomResource> = [];
    private connections : Array<Connection> = [];

    private roomConnectionFlatMap : Map<string, string> = new Map<string, string>();
    
    public createConnection(roomID: string, connectionID: string): void
    {

        this.roomConnectionFlatMap.set(connectionID, roomID);

        if (this.connections.find(connection => connection.roomID === roomID))
        {
            console.log('Room already exists');
            return;
        }
        
        let newConnection: Connection = {
            roomID: roomID,
            connectionIDs: [connectionID]
        };

        this.connections.push(newConnection);
    };

    public getConnection(roomID: string): Connection
    {
        let _connection: Connection = this.connections.find(connection => connection.roomID === roomID)!;

        if ( typeof(_connection) === "undefined")
        {
            console.log('Room does not exist');
        };

        return _connection;
     
    }

    public getRoomID(connectionID: string): string
    {
        let roomID = this.roomConnectionFlatMap.get(connectionID);

        if (typeof(roomID) === "undefined")
        {
            return "";
        };

        return roomID;
    };


    public removeConnection(connectionID: string): void
    {
        let roomID = this.getRoomID(connectionID);

        if (roomID === "")
        {
            console.log('Room does not exist');
            return;
        }

        let _connection: Connection = this.connections.find(connection => connection.roomID === roomID)!;

        let index = _connection.connectionIDs.indexOf(connectionID);

        if (index === -1)

        {
            console.log('Connection does not exist');
            return;
        }

        _connection.connectionIDs.splice(index, 1);

        if (_connection.connectionIDs.length === 0)
        {
            this.connections.splice(this.connections.indexOf(_connection), 1);

           this.rooms.splice(this.rooms.indexOf(this.rooms.find(room => room.id === roomID)!), 1);

        }

        this.roomConnectionFlatMap.delete(connectionID);

        
    };

    public addConnection(roomID: string, connectionID: string): void 
    {
        this.roomConnectionFlatMap.set(connectionID, roomID);
        let connection: Connection = this.getConnection(roomID);

        if (typeof (connection.connectionIDs.find(connectionID => connectionID === connectionID)) === "undefined")
        {
            console.log('Connection has already been added');
            return;
        };

        connection.connectionIDs.push(connectionID);
    };

    public getHost(roomID: string): string
    {
        if (this.connections.length === 0)
        {
            console.log('No connections exist, this room should not exist');
            return '';
        }
        return this.getConnection(roomID).connectionIDs[0];
    };

    public createRoom(roomID: string, roomName: string, roomPath: string): RoomResource
    {
        let newRoom: RoomResource = {
            id: roomID,
            name: roomName,
            path: roomPath
        };
        
        return newRoom;
    };

    public addRoom(_room: RoomResource): void
    {
        this.rooms.push(_room);
    }
    
    public getRooms(): RoomResource[]
    {
        return this.rooms;
    }
    
    public getRoom(_roomID: string): RoomResource
    {   

        let room = this.rooms.find(room => room.id === _roomID);


        if (typeof(room) === "undefined")
        {
            return {} as RoomResource;
        };  
       
        return room;
    }
};