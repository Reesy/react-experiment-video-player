import { IConnections } from "../interfaces/Connections";
import { Connection } from "../interfaces/IConnection";

export class Connections implements IConnections
{
    
    private connections : Array<Connection> = [];
    
    public createConnection(roomID: string, connectionID: string): void
    {

        if (this.connections.find(connection => connection.roomID === roomID))
        {
            throw 'Room already exists';
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
            throw 'Room does not exist';
        }

        return _connection;
     
    }

    public addConnection(roomID: string, connectionID: string): void 
    {

        let connection: Connection = this.getConnection(roomID);

        if (typeof (connection.connectionIDs.find(connectionID => connectionID === connectionID)) === "undefined")
        {
            throw 'Connection has already been added';
        };

        connection.connectionIDs.push(connectionID);
    };

    public getHost(roomID: string): string
    {
        if (this.connections.length === 0)
        {
            throw 'No connections exist, this room should not exist';
        }
        return this.getConnection(roomID).connectionIDs[0];
    };

    
};