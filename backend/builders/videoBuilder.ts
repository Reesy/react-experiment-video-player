import { IvideoBuilder } from "../interfaces/IvideoBuilder";
import { Video } from "../interfaces/Video";
import { Subtitle } from "../interfaces/Subtitle";
import path = require('path');

export class videoBuilder implements IvideoBuilder
{
    private fileName: string;
    private directory: string;
    private subtitles: any;
    
    constructor(__fileName: string, __directory: string)
    {
        if(typeof(__fileName) === 'undefined' || __fileName === null || __fileName === '')
        {
            throw new Error('Invalid video filename');
        }
        this.fileName = __fileName;
        this.directory = __directory;
    }


    public buildVideo(): Video
    {
        let name = this.buildVideoName();
        let path = this.buildVideoPath();
        let baseName = this.buildBaseName();
        let Video: Video = {
            name: name,
            path: path,
            baseName: baseName,
        }
        if(this.subtitles)
        {
            Video.subtitles = this.subtitles;
        }
        return Video;
    }

    /**
     * @name buildVideoSubtitles
     * @description This will append the passed in subtitles array to the resulting video object
     */
    public buildVideoSubtitles(__subtitles: Array<Subtitle>): void
    {
        this.subtitles = __subtitles;
        return;
    }

    /**
     * @private
     * @name buildVideoName
     * @description This will return the passed in video filename to the resulting video object. 
     */
    private buildVideoName(): string
    {
        return this.fileName;
    }

    /**
     * @private
     * @name buildVideoPath 
     * @description This will returns the path to the video file on the host server
     */
    private buildVideoPath(): string
    {
        return path.join(this.directory, this.fileName);
    }

    /**
     * @private
     * @name buildBaseName 
     * @description This will return the base filename without any extensions to more easily map related subtitles
     */
    private buildBaseName(): string
    {
        let target = this.fileName.match(/[^.]*/);

        if(target === null)
        {
            throw 'Basename could not be resolved'
        }
        return target[0]

    }

}