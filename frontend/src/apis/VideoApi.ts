import { IVideoApi } from "./IVideoApi";
import { request } from '../wrappers/request';
import { VideoItem } from "./VideoItem";
import { IRequest } from "../wrappers/IRequest";
import { IRequestOptions } from "../wrappers/IRequestOptions";


export class VideoApi implements IVideoApi
{

    private APICaller: IRequest
    
    constructor()
    {
        this.APICaller = new request();
    }

    async getVideos(): Promise<Array<VideoItem>>
    {   
        const options: IRequestOptions = 
        {
            method: "GET"
        }

        const uri = "http://localhost:3000/api/video/library"
        return await this.APICaller.get(uri, options);  
    }

}