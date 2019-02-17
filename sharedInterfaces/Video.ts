import { Subtitle } from "./Subtitle";

export interface Video
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
}