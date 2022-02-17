import { IRooms } from "../interfaces/IRooms";
import { IVideoState } from "../interfaces/IVideoState";
import { Room } from "../interfaces/Room";


export class Rooms implements IRooms
{
    private rooms : Array<Room> = [];
    
    constructor()
    {

    }
    
    public updateRoomState(_roomID: string, _videoState: IVideoState): void
    {

        for (let room of this.rooms)
        {
            if (room.roomID === _roomID)
            {
                room.videoState = _videoState;
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


    createRoom(roomID: string, roomName: string, videoState: IVideoState, connections: string[]): Room
    {
        let newRoom: Room = {
            roomID: roomID,
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


        if (typeof(room) === "undefined")
        {
            return {} as Room;
        };  
       
        return room;
    }
    
}