import { pauseState } from "../App";


export interface IVideoState
{

    videoPath: string

    playingState: pauseState;

    videoPosition: number;

}