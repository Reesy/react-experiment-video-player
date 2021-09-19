import { Video } from "./Video";

export interface ILibrary
{
    getLibrary(): Array<Video>;

    scanLibrary(): void;

}