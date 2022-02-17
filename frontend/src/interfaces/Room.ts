import { IVideoState } from "./IVideoState";


export interface Room
{
    roomID: string;
    roomName: string;
    videoState: IVideoState;
};