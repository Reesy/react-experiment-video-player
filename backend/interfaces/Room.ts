import { Video } from "./Video";

export interface Room
{
    roomID: string;
    video: Video;
    resynch?: boolean;
};