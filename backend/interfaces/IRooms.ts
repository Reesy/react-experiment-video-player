
import { RoomResource } from "./RoomResource";

export interface IRooms
{

    addRoom(_room: RoomResource): void
    
    getRooms(): Array<RoomResource>

    getRoom(_roomID: string): RoomResource

    createRoom(roomID: string,
               roomName: string): RoomResource

}