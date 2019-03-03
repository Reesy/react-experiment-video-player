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
    private contentDirectory: string;

    constructor(__contentDirectory: string)
    {
        this.content = '';
        this.videoItemCache = [];
        this.contentDirectory = __contentDirectory;
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

    private buildSubtitles(__subtitleFiles: Array<string>): Array<Subtitle>
    {
        let subtitles: Array<Subtitle> = [];
        for(let subtitleFile of __subtitleFiles)
        {
            let subtitle = new subtitleBuilder(subtitleFile, this.contentDirectory).buildSubtitle();
            subtitles.push(subtitle);
        }

        return subtitles;
    }

    private buildVideos(__videoFiles: Array<string>, __subtitles?: Array<Subtitle>): Array<Video>
    {
        let videos: Array<Video> = [];
        for(let videoFile of __videoFiles)
        {
            let VideoBuilder: videoBuilder = new videoBuilder(videoFile, this.contentDirectory);
            let video = VideoBuilder.buildVideo(); 

            if(__subtitles)
            {
                let matchedSubtitles: Subtitle[] = __subtitles.filter(sub => sub.target === video.baseName);
                if(matchedSubtitles.length > 0)
                {
                    console.log(matchedSubtitles);
                    video.subtitles = matchedSubtitles;
                }
            }
            
            videos.push(video);
        }

        return videos
    }  
}