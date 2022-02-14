import { Video } from "../interfaces/Video";
import { IVideoApi } from "./IVideoApi";
import { request } from '../wrappers/request';
import { IRequest } from "../wrappers/IRequest";
import { IRequestOptions } from "../wrappers/IRequestOptions";


export class VideoApi implements IVideoApi
{

    private APICaller: IRequest
    
    constructor()
    {
        this.APICaller = new request();
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