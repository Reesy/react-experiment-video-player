import { VideoResource, VideoState } from "./Video";



export interface VideoPlayerProps 
{
    VideoResource: VideoResource;
    VideoState: VideoState;
    createRoom: (videoState: VideoState) => void;
    updateVideoState: (videoState: VideoState) => void;
};
