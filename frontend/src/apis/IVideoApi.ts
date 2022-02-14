import { Video} from "../interfaces/Video";

export interface IVideoApi
{
    getVideos(): Promise<Array<Video>>

    getVideoApiAddress(): string

    getThumbnailApiAddress(): string
}
