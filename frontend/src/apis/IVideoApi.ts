import { RoomResource  } from "../interfaces/RoomResource";
import { VideoResource } from "../interfaces/VideoResource";

export interface IVideoApi
{
    getVideos(): Promise<Array<VideoResource>>

    getRooms(): Promise<Array<RoomResource>>

    getRoom(_roomID: string): Promise<RoomResource>

    postRoom(_room: RoomResource): Promise<RoomResource>

    getRoomApiAddress(): string;

    getVideoApiAddress(): string

    getThumbnailApiAddress(): string
}
