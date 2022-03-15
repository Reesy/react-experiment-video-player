import { IRooms } from "../interfaces/IRooms";
import { RoomResource } from "../interfaces/RoomResource";

export class Rooms implements IRooms
{
    private rooms : Array<RoomResource> = [];
    
    constructor()
    {

    }
    
    public createRoom(roomID: string, roomName: string, roomPath: string): RoomResource
    {
        let newRoom: RoomResource = {
            id: roomID,
            name: roomName,
            path: roomPath
        };
        
        return newRoom;
    };

    public addRoom(_room: RoomResource): void
    {
        this.rooms.push(_room);
    }
    
    public getRooms(): RoomResource[]
    {
        return this.rooms;
    }
    
    public getRoom(_roomID: string): RoomResource
    {   

        let room = this.rooms.find(room => room.id === _roomID);


        if (typeof(room) === "undefined")
        {
            return {} as RoomResource;
        };  
       
        return room;
    }
    
}