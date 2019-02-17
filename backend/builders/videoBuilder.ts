import { IvideoBuilder } from "./interfaces/IvideoBuilder";
import { Video } from "../../sharedInterfaces/Video";
import { Subtitle } from "../../sharedInterfaces/Subtitle";


export class videoBuilder implements IvideoBuilder
{
    private fileName: string;
    private subtitles: any;

    constructor(_fileName: string, subtitles?: Array<Subtitle>)
    {
        this.fileName = _fileName;
        if(subtitles){
            this.subtitles = subtitles;
        }
    }

    public buildVideo(): Video
    {
        let name = this.buildVideoName();
        let path = this.buildVideoPath();
        let baseName = this.buildBaseName();
        let subtitles = this.buildVideoSubtitles();
        let Video: Video = {
            name: name,
            path: path,
            baseName: baseName,
        }
        if(subtitles)
        {
            Video.subtitles = subtitles;
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

    private buildBaseName(): string
    {
        return ''

    }
    private buildVideoSubtitles(): Array<Subtitle> | void
    {
        return;
    }

}