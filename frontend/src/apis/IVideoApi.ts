import { Room } from "../interfaces/Room";
import { Video} from "../interfaces/Video";

export interface IVideoApi
{
    getVideos(): Promise<Array<Video>>

    getRooms(): Promise<Array<Room>>

    getRoom(_roomID: string): Promise<Room>

    postRoom(_room: Room): Promise<Room>

    getRoomApiAddress(): string;

    getVideoApiAddress(): string

    getThumbnailApiAddress(): string
}
