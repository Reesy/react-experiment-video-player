
enum playingState
{
    paused = "paused",
    playing = "playing"
};

export interface IVideoState
{
    playingState: playingState;

    videoPosition: number;

}