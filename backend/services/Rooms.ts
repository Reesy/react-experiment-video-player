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
        // let room = this.getRoom(_roomID);


        return;
        // //Search this.rooms for room with room id and replace with video state
        // let room = this.rooms.find((room) => room.roomID === _roomID)

        // if (typeof(room) !== 'undefined')
        // {
        //     room.videoState = _videoState;
        // }

    }


    createRoom(roomID: string, roomName: string, video: Video, connections: string[]): Room
    {
        let newRoom: Room = {
            roomID: roomID,
            roomName: roomName,
            video: video,
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
    
    public joinRoom(_roomID: string, _connectionID: string): void
    {
        let room = this.getRoom(_roomID);
        room.connections.push(_connectionID);
    };
    
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