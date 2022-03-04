
export enum playingState
{
    paused = "paused",
    playing = "playing"
};

export interface VideoState
{
    /**
     *  Enum describing if the video is currently playing or not
     */
    playingState: playingState;

    /**
     *  Current time of the video
     */
    videoPosition: number;


}