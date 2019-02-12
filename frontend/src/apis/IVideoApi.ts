import { VideoItem } from "../../../sharedInterfaces/VideoItem";

export interface IVideoApi
{
    getVideos(): Promise<Array<VideoItem>>

    getVideoApiAddress(): string
}
