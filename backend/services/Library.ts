import { VideoItem } from "../../sharedInterfaces/VideoItem";
import { ILibrary } from "./interfaces/ILibrary";
import  fs  = require('fs');
import path = require('path');

export class Library implements ILibrary
{
    
    private content: string;
    private videoItemCache: Array<VideoItem>;

    constructor()
    {
        this.content = '';
        this.videoItemCache = [];
        this.scanLibrary();
    }

    public getLibrary(): Array<VideoItem>
    {
        return this.videoItemCache;
    }

    public scanLibrary()
    {
        let contentDirectory = path.join(__dirname, '..', 'videos');
        let LibraryFolderContent = fs.readdirSync(contentDirectory);
        this.videoItemCache = this.buildLibrary(LibraryFolderContent);
    }

    private buildLibrary(filenames: Array<string>): Array<VideoItem>
    {
        let localVideoItem: any = [];

        for(let fileName of filenames)
        {
            let videoEntry: VideoItem =
            {
                name: fileName,
                resourceLocation: "/" + fileName
            }
            
            localVideoItem.push(videoEntry);
        
        }

        return localVideoItem;
    }

    private writeLibrary()
    {


    }
}