import { Video} from "../../../sharedInterfaces/Video";

export interface IVideoApi
{
    getVideos(): Promise<Array<Video>>

    getVideoApiAddress(): string
}
