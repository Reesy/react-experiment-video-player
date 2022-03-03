import { IRooms } from "../interfaces/IRooms";
import { Room } from "../interfaces/Room";
import { Video } from "../interfaces/Video";


export class Rooms implements IRooms
{
    private rooms : Array<Room> = [];
    
    constructor()
    {

    }
    
    public updateRoomState(_roomID: string, _video: Video): void
    {

        for (let room of this.rooms)
        {
            if (room.roomID === _roomID)
            {
                room.video = _video;
                break;
            }
        }



        return;

    }


    public createRoom(roomID: string, video: Video): Room
    {
        let newRoom: Room = {
            roomID: roomID,
            video: video
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