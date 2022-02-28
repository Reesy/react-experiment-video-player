
import { Room } from "./Room"
import { Video } from "./Video";

export interface IRooms
{

    addRoom(_room: Room): void
    
    getRooms(): Array<Room>

    getRoom(_roomID: string): Room

    joinRoom(_roomID: string, _connectionID: string): void

    createRoom(roomID: string, 
               roomName: string,
               video: Video,
               connections: Array<string>): Room

    updateRoomState(_roomID: string, _video: Video): void

}