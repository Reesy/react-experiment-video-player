import { VideoState } from "./VideoState";



export interface RoomState {
    id: string;
    name: string
    videoState?: VideoState;
}