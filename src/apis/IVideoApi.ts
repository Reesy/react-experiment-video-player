import { VideoItem } from "./VideoItem";

export interface IVideoApi
{
    getVideos(): Promise<Array<VideoItem>>
}
