import { Connection } from "./IConnection";

export interface IConnections
{

    createConnection(roomID: string, connectionID: string): void;

    getConnection(roomID: string): Connection;

    addConnection(roomID: string, connectionID: string): void;

    getHost(roomID: string): string

}
