import { Video } from "../interfaces/Video";
import { IVideoApi } from "./IVideoApi";
import { request } from '../wrappers/request';
import { IRequest } from "../wrappers/IRequest";
import { IRequestOptions } from "../wrappers/IRequestOptions";
import { Room } from "../interfaces/Room";


export class VideoApi implements IVideoApi
{

    private APICaller: IRequest
    
    constructor()
    {
        this.APICaller = new request();
    }
    
    public async getRooms(): Promise<Room[]>
    {   
        const options: IRequestOptions = 
        {
            method: "GET"
        }
        const uri = "http://localhost:3050/api/rooms";

        let serverResponse = await this.APICaller.get(uri, options);  
        let roomArray: Array<Room> = serverResponse.data;
        return roomArray;
      
    }

    public async getRoom(_roomID: string): Promise<Room>
    {
        throw new Error("Method not implemented.");
    }
    public async postRoom(_room: Room): Promise<Room>
    {
        throw new Error("Method not implemented.");
    }
    public getRoomApiAddress(): string
    {
        return "http://localhost:3050/";
    }

    public async getVideos(): Promise<Array<Video>>
    {   
        const options: IRequestOptions = 
        {
            method: "GET"
        }
        const uri = "http://localhost:3050/api/video/library"

        let serverResponse = await this.APICaller.get(uri, options);  
        let videoArray: Array<Video> = serverResponse.data;
        return videoArray;
    }

    public getVideoApiAddress(): string
    {
        return "http://localhost:3050/"
    }

    public getThumbnailApiAddress(): string
    {
        return "http://localhost:3050/"
    }

}