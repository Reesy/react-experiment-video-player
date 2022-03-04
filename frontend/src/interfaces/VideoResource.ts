
import { Subtitle } from "./Subtitle";


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
