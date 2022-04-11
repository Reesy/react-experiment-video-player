import fs  = require('fs');
import path = require('path');
import { ILibrary } from "../interfaces/ILibrary";
import { Video } from "../interfaces/Video";
import { videoBuilder } from "../builders/videoBuilder";
import { Subtitle } from "../interfaces/Subtitle";
import { subtitleBuilder } from "../builders/subtitleBuilder";
let dice = require('fast-dice-coefficient');


const thumbnailConfidence: number = 0.5; 
export class Library implements ILibrary
{
    private videoItemCache: Array<Video>;
    private contentDirectory: string;
    private serverDirectory: string;
    private thumbnailDirectory: string;
    private thumbnailCache: Array<string>;

    constructor(__contentDirectory: string, 
                __serverDirectory: string,
                __thumbnailDirectory: string)
    {
        this.content = '';
        this.videoItemCache = [];
        this.thumbnailCache = [];
        this.contentDirectory = __contentDirectory;
        this.serverDirectory = __serverDirectory;
        this.thumbnailDirectory = __thumbnailDirectory;
        this.scanLibrary();
    }

    public getLibrary(): Array<Video>
    {
        return this.videoItemCache;
    }

    public scanLibrary()
    {

        if (!fs.existsSync(this.contentDirectory))
        {
            throw new Error('Invalid content directory');
        }

        let LibraryFolderContent = fs.readdirSync(this.contentDirectory);

        let thumnbailContent;
        if (typeof(this.thumbnailDirectory) !== 'undefined' && this.thumbnailDirectory !== null && this.thumbnailDirectory !== '')
        {
            if (fs.existsSync(this.thumbnailDirectory))
            {
                thumnbailContent = fs.readdirSync(this.thumbnailDirectory);
                this.thumbnailCache = thumnbailContent
            } 
            else
            {
                console.log('Provided thumbnail directory does not exist');
            };
        };

        this.videoItemCache = this.buildLibrary(LibraryFolderContent);
        
    }

    private buildLibrary(filenames: Array<string>): Array<Video>
    {
        let videoFileNames: Array<string> = [];

        let subtitleFileNames: Array<string> = [];

        let thumbnailFileNames: Array<string> = [];

        for(let fileName of filenames)
        {
            if(fileName.indexOf('.vtt') !== -1)
            {
                subtitleFileNames.push(fileName);
            }

            if(fileName.indexOf('.mp4') !== -1)
            {
                videoFileNames.push(fileName);
                thumbnailFileNames.push(this.searchForThumbnail(fileName));
            }

            if(fileName.indexOf('.m4v') !== -1)
            {
                videoFileNames.push(fileName);
                thumbnailFileNames.push(this.searchForThumbnail(fileName));
            }

            
        }
        let subtitles: Array<Subtitle> = []; 
        if(subtitleFileNames.length > 0)
        {
            subtitles = this.buildSubtitles(subtitleFileNames);
        };
        
        let videos = this.buildVideos(videoFileNames, subtitles, thumbnailFileNames);
        return videos;
    }



    private similarity(__firstString: string, __secondString: string): number
    {
       
        let firstString = __firstString.toLowerCase()
        let secondString = __secondString.toLowerCase()

        let firstStrippedFullStops = firstString.replace('.', '')
        let secondStrippedFullStops = secondString.replace('.', '')

        return dice(firstStrippedFullStops, secondStrippedFullStops);

    };

    private searchForThumbnail(__fileName: string ): string
    {

        let thumbnailFileName = ''; 

        let strippedMP4Extention = __fileName.replace('.mp4', '');
        let strippedM4VExtention = strippedMP4Extention.replace('.m4v', '');

        this.thumbnailCache.find((element) => {
            

            let extenstionStrippedFile = element.replace('.jpg', '');

            if (this.similarity(extenstionStrippedFile, strippedM4VExtention) > thumbnailConfidence)
            {
                thumbnailFileName = element;
                
                return true;
            }

        });

        return this.serverDirectory ? this.serverDirectory + '/' + thumbnailFileName : thumbnailFileName;
    };

    private buildSubtitles(__subtitleFiles: Array<string>): Array<Subtitle>
    {
        let subtitles: Array<Subtitle> = [];
        for(let subtitleFile of __subtitleFiles)
        {
            let subtitle = new subtitleBuilder(subtitleFile, this.serverDirectory).buildSubtitle();
            subtitles.push(subtitle);
        }

        return subtitles;
    }

    private buildVideos(__videoFiles: Array<string>, __subtitles: Array<Subtitle>, __thumbnails: Array<string>): Array<Video>
    {
        let videos: Array<Video> = [];

        let count = 0; //should probably change this to a loop. 
        for(let videoFile of __videoFiles)
        {
            let VideoBuilder: videoBuilder = new videoBuilder(videoFile, this.serverDirectory);
            let video = VideoBuilder.buildVideo(); 
            let videoName = video.name;
            let videoNameWithoutMP4Extention = videoName.replace('.mp4', '');
            let videoNameWithoutMP4AndM4VExtention= videoNameWithoutMP4Extention.replace('.m4v', '');

            if(__subtitles.length > 0)
            {
                let matchedSubtitles: Subtitle[] = __subtitles.filter(sub => sub.target === videoNameWithoutMP4AndM4VExtention);
                if(matchedSubtitles.length > 0)
                {
                    video.subtitles = matchedSubtitles;
                }
            }
            video.thumbnail = __thumbnails[count];
            count ++;
            videos.push(video);
        }

        return videos
    }  

}