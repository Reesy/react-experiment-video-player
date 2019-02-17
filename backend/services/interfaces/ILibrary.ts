import { Video } from "../../../sharedInterfaces/Video";

export interface ILibrary
{
    getLibrary(): Array<Video>;

    scanLibrary(): void;

}