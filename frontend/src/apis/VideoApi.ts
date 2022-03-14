import { VideoResource } from "../interfaces/VideoResource";
import { IVideoApi } from "./IVideoApi";
import { request } from '../wrappers/request';
import { IRequest } from "../wrappers/IRequest";
import { IRequestOptions } from "../wrappers/IRequestOptions";
import { RoomResource } from "../interfaces/RoomResource";

export class VideoApi implements IVideoApi
{

    private APICaller: IRequest
    private getLibraryAPI = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/video/library` : '/api/video/library';
    private getRoomsAPI = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/rooms` : '/api/rooms';
    private resource_path: string = process.env.REACT_APP_RESOURCE_URL ? process.env.REACT_APP_RESOURCE_URL : "/";

    
    // private getRoomAPI = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/room` : '/api/room';

    constructor()
    {
        this.APICaller = new request();

        console.log("getLibraryAPI: " , this.getLibraryAPI);
        console.log("getRoomsAPI: " , this.getRoomsAPI);
        console.log("resource_path: " , this.resource_path);
        
    }
    
    public async getRooms(): Promise<RoomResource[]>
    {   
        const options: IRequestOptions = 
        {
            method: "GET"
        }
        const uri = this.getRoomsAPI;

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
        throw new Error("Method not implemented.");
    }

    public async getVideos(): Promise<Array<VideoResource>>
    {   
        const options: IRequestOptions = 
        {
            method: "GET"
        }
        const uri = this.getLibraryAPI;

        let serverResponse = await this.APICaller.get(uri, options);  
        let videoArray: Array<VideoResource> = serverResponse.data;
        return videoArray;
    }

    public getVideoApiAddress(): string
    {
        return this.resource_path;
    }

    public getThumbnailApiAddress(): string
    {
        return this.resource_path;
    }

}