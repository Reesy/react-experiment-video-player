import { Video } from "../../sharedInterfaces/Video";
import { ILibrary } from "./interfaces/ILibrary";
import  fs  = require('fs');
import path = require('path');

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
        let localVideoItem: any = [];

        let subtitles: any = [];

        for(let fileName of filenames)
        {

            if(fileName.indexOf('.vtt') !== -1)
            {
                //Will add a builder later that works off iso and does this logic more cleanly
                let fullFilename = fileName.replace('.vtt', '');
                
                //create a new entry subtitle entry if one doesn't exist
                if(!subtitles[fullFilename])
                {   
                    subtitles[fullFilename] = [];
                }

                subtitles[fullFilename].push(fileName);
            }

        }

        for(let fileName of filenames)
        {

            if(fileName.indexOf('.vtt') === -1)
            {
                let videoEntry: Video =
                {
                    name: fileName,
                    resourceLocation: "/" + fileName
                }

                let fullFilename = fileName.replace('.mp4', '');
                fullFilename = fileName.replace('.m4v', '');
                if(subtitles[fullFilename])
                {
                    videoEntry.subtitles = subtitles[fullFilename];
                }
                
                localVideoItem.push(videoEntry);
                
            }
        }
        return localVideoItem;
    }

    private writeLibrary()
    {


    }
}