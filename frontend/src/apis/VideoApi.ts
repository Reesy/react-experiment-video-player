import { VideoResource } from "../interfaces/VideoResource";
import { IVideoApi } from "./IVideoApi";
import { request } from '../wrappers/request';
import { IRequest } from "../wrappers/IRequest";
import { IRequestOptions } from "../wrappers/IRequestOptions";
import { RoomResource } from "../interfaces/RoomResource";

export class VideoApi implements IVideoApi
{

    private APICaller: IRequest
    
    constructor()
    {
        this.APICaller = new request();
    }
    
    public async getRooms(): Promise<RoomResource[]>
    {   
        const options: IRequestOptions = 
        {
            method: "GET"
        }
        const uri = "http://localhost:3050/api/rooms";

        let serverResponse = await this.APICaller.get(uri, options);  
        let roomArray: Array<RoomResource> = serverResponse.data;
        return roomArray;
      
    }

    public async getRoom(_roomID: string): Promise<RoomResource>
    {
        throw new Error("Method not implemented.");
    }
    public async postRoom(_room: RoomResource): Promise<RoomResource>
    {
        throw new Error("Method not implemented.");
    }
    public getRoomApiAddress(): string
    {
        return "http://localhost:3050/";
    }

    public async getVideos(): Promise<Array<VideoResource>>
    {   
        const options: IRequestOptions = 
        {
            method: "GET"
        }
        const uri = "http://localhost:3050/api/video/library"

        let serverResponse = await this.APICaller.get(uri, options);  
        let videoArray: Array<VideoResource> = serverResponse.data;
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