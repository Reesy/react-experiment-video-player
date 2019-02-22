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

    /**
     * @private
     * @name buildVideoName
     * @description This will return the passed in video filename to the resulting video object. 
     */
    private buildVideoName(): string
    {
        return ''
    }

    /**
     * @private
     * @name buildVideoPath 
     * @description This will returns the path to the video file on the host server
     */
    private buildVideoPath(): string
    {
        return ''
    }

    /**
     * @private
     * @name buildBaseName 
     * @description This will return the base filename without any extensions to more easily map related subtitles
     */
    private buildBaseName(): string
    {
        return ''

    }

    /**
     * @private
     * @name buildVideoSubtitles
     * @description This will append the passed in subtitles array to the resulting video object
     */
    private buildVideoSubtitles(): Array<Subtitle> | void
    {
        return;
    }

}