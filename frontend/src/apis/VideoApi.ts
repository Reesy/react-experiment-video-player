import { Video } from "../../../sharedInterfaces/Video";
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

        let serverResponseString = await this.APICaller.get(uri, options);  
        let parsedResponse: Array<Video> = JSON.parse(serverResponseString);
        return parsedResponse;
    }

    public getVideoApiAddress(): string
    {
        return "http://localhost:3050/"
    }
}