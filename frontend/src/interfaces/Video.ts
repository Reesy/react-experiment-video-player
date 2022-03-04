import { Subtitle } from "./Subtitle";


export enum playingState
{
    paused = "paused",
    playing = "playing"
};

export interface VideoResource
{
    /**
     * The display name of the video
     */
    name: string;

    /**
     * The path to the resource on the server, this will be folder/filename
     */
    path: string;

    /**
     *  The list of possible subtitles associated with a video
     */
    subtitles?: Array<Subtitle>;

    /**
     * The path to the thumbnail image
     */
    thumbnail?: string;

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