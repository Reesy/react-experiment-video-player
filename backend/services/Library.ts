import { VideoItem } from "../../sharedInterfaces/VideoItem";
import { ILibrary } from "./interfaces/ILibrary";
import  fs  = require('fs');

export class Library implements ILibrary
{
    
    private content: string;
    private videoItemCache: Array<VideoItem>;

    constructor()
    {
        this.content = '';
        this.videoItemCache = [
            {
                name: '',
                resourceLocation: ''
            }];
        this.scanLibrary();
    }

    public getLibrary(): Array<VideoItem>
    {
        return this.videoItemCache;
    }

    public scanLibrary()
    {
        console.log(process.cwd());
        let LibraryFolderContent = fs.readdirSync('backend/videos');
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