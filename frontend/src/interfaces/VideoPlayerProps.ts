import { VideoState } from "./VideoState";
import { VideoResource } from "./VideoResource"


export interface VideoPlayerProps 
{
    videoResource: VideoResource;
    videoState: VideoState;
    createRoom: (videoState: VideoState) => void;
    updateVideoState: (videoState: VideoState) => void;
};
