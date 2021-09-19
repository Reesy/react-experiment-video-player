
export interface Subtitle
{
    /**
     * The display name of the subtitle
     */
    name: string;

    /**
     * The path to the resource on the server, this will be folder/filename
     */
    path: string;

    /**
     * The language that this subtitle represents such as 'English, 'English CC', 'Czech'
     */
    language: string;

    /**
     * The expected name of the video this subtitle belong too, excluding extension
     */
    target: string;
}