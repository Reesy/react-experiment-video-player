import { Video } from "./Video";


export interface Room
{
    roomID: string;
    roomName: string;
    videoState: Video;
};