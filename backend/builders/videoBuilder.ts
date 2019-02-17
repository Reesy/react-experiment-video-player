import { IvideoBuilder } from "./interfaces/IvideoBuilder";
import { Video } from "../../sharedInterfaces/Video";
import { Subtitle } from "../../sharedInterfaces/Subtitle";


export class videoBuilder implements IvideoBuilder
{
    private fileName: string;
    

    constructor()
    {

    }

    public buildVideo(): Video
    {
        let Video: Video = {
            name: '',
            path: ''
        }
        return Video;
    }

    private buildVideoName(): string
    {
        return ''
    }

    private buildVideoPath(): string
    {
        return ''
    }

    private buildVideoSubtitles(): Array<Subtitle> | void
    {
        return;
    }

}