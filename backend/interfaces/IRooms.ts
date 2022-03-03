
import { Room } from "./Room"
import { Video } from "./Video";

export interface IRooms
{

    addRoom(_room: Room): void
    
    getRooms(): Array<Room>

    getRoom(_roomID: string): Room

    createRoom(roomID: string,
               video: Video): Room

    updateRoomState(_roomID: string, _video: Video): void

}