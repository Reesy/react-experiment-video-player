
export enum playingState
{
    paused = "paused",
    playing = "playing"
};

export interface IVideoState
{
    videoPath: string;

    playingState: playingState;

    videoPosition: number;

}