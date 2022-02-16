import { IRooms } from "../interfaces/IRooms";
import { IVideoState } from "../interfaces/IVideoState";
import { Room } from "../interfaces/Room";


export class Rooms implements IRooms
{
    private rooms : Array<Room> = [];
    
    constructor()
    {

    }
    createRoom(roomID: string, socketIDs: string[], roomName: string, videoState: IVideoState, connections: string[]): Room
    {
        let newRoom: Room = {
            roomID: roomID,
            socketIDs: socketIDs,
            roomName: roomName,
            videoState: videoState,
            connections: connections
        };
        
        return newRoom;
    };

    public addRoom(_room: Room): void
    {
        this.rooms.push(_room);
    }
    
    public getRooms(): Room[]
    {
        return this.rooms;
    }
    
    public getRoom(_roomID: string): Room
    {   

        let room = this.rooms.find(room => room.roomID === _roomID);

        if (typeof(room) !== "undefined")
        {
            return room;
        };  
       
        throw new Error("Room not found");
    }
    
}