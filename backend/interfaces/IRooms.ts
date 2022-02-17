
import { IVideoState } from "./IVideoState";
import { Room } from "./Room"

export interface IRooms
{

    addRoom(_room: Room): void
    
    getRooms(): Array<Room>

    getRoom(_roomID: string): Room

    createRoom(roomID: string, 
               roomName: string,
               videoState: IVideoState,
               connections: Array<string>): Room

    updateRoomState(_roomID: string, _videoState: IVideoState): void

}