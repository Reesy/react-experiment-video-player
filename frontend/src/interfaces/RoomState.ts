import { VideoState } from "./VideoState";



export interface RoomState {
    id: string;
    name: string
    path: string,
    videoState?: VideoState;
}