import { Connection } from "./IConnection";
import { RoomResource } from "./RoomResource";

export interface IConnections
{

    createConnection(roomID: string, connectionID: string): void;

    getConnection(roomID: string): Connection;

    addConnection(roomID: string, connectionID: string): void;

    getRoomID(connectionID: string): string;
    
    removeConnection(connectionID: string): void;

    getHost(roomID: string): string

    addRoom(_room: RoomResource): void
    
    getRooms(): Array<RoomResource>

    getRoom(_roomID: string): RoomResource

    createRoom(roomID: string,
               roomName: string,
               roomPath: string): RoomResource

}
