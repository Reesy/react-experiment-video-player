
import { Room } from "./Room"

export interface IRooms
{

    addRoom(_room: Room): void
    
    getRooms(): Array<Room>

    getRoom(_roomID: string): Room

    createRoom(roomID: string,
               roomName: string): Room

}