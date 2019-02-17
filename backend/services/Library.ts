import fs  = require('fs');
import path = require('path');
import { ILibrary } from "./interfaces/ILibrary";
import { Video } from "../../sharedInterfaces/Video";
import { videoBuilder } from "../builders/videoBuilder";
import { Subtitle } from "../../sharedInterfaces/Subtitle";
import { subtitleBuilder } from "../builders/subtitleBuilder";

export class Library implements ILibrary
{
    
    private content: string;
    private videoItemCache: Array<Video>;

    constructor()
    {
        this.content = '';
        this.videoItemCache = [];
        this.scanLibrary();
    }

    public getLibrary(): Array<Video>
    {
        return this.videoItemCache;
    }

    public scanLibrary()
    {
        let contentDirectory = path.join(__dirname, '..', 'videos');
        let LibraryFolderContent = fs.readdirSync(contentDirectory);
        this.videoItemCache = this.buildLibrary(LibraryFolderContent);
    }

    private buildLibrary(filenames: Array<string>): Array<Video>
    {
        let videoFileNames: Array<string> = [];

        let subtitleFileNames: Array<string> = [];

        for(let fileName of filenames)
        {
            if(fileName.indexOf('.vtt') !== -1)
            {
                subtitleFileNames.push(fileName);
            }

            if(fileName.indexOf('.mp4') !== -1)
            {
                videoFileNames.push(fileName);
            }

            if(fileName.indexOf('.m4v') !== -1)
            {
                videoFileNames.push(fileName);
            }
        }
        let subtitles; 
        if(subtitleFileNames.length > 0)
        {
            subtitles = this.buildSubtitles(subtitleFileNames);
        }
        let videos = typeof(subtitles) !== 'undefined' ? this.buildVideos(videoFileNames, subtitles) : this.buildVideos(videoFileNames);
        return videos;
    }

    private buildSubtitles(fileNames: Array<string>): Array<Subtitle>
    {
        let subtitles: Array<Subtitle> = [];
        for(let fileName of fileNames)
        {
            let subtitle = new subtitleBuilder(fileName).buildSubtitle();
            subtitles.push(subtitle);
        }

        return subtitles;
    }

    private buildVideos(fileNames: Array<string>, subtitles?: Array<Subtitle>): Array<Video>
    {
        let videos: Array<Video> = [];
        for(let fileName of fileNames)
        {
            let video = new videoBuilder(fileName, subtitles).buildVideo();
            videos.push(video);
        }

        return videos
    }  
}