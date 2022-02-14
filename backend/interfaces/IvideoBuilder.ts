import { Video } from "./Video";

export interface IvideoBuilder
{
    buildVideo(): Video

    buildThumbnail(): void
}