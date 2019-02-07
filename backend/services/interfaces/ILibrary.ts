import { VideoItem } from "../../../sharedInterfaces/VideoItem";

export interface ILibrary
{
    getLibrary(): Array<VideoItem>;

    scanLibrary(): void;

}