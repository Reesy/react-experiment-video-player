import { IVideoState } from "./IVideoState";


export interface Room
{
    roomID: string;
    socketIDs: Array<string>;
    roomName: string;
    videoState: IVideoState;
    connections: Array<string>;
};