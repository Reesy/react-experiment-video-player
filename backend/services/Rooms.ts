import { IRooms } from "../interfaces/IRooms";
import { Room } from "../interfaces/Room";

export class Rooms implements IRooms
{
    private rooms : Array<Room> = [];
    
    constructor()
    {

    }
    
    public createRoom(roomID: string, roomName: string): Room
    {
        let newRoom: Room = {
            roomID: roomID,
            roomName: roomName
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


        if (typeof(room) === "undefined")
        {
            return {} as Room;
        };  
       
        return room;
    }
    
}