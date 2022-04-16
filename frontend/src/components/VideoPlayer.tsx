import 'font-awesome/css/font-awesome.min.css';
import "../styles/VideoPlayer.css"
import React, { SyntheticEvent } from 'react';
import { playingState, VideoState } from '../interfaces/VideoState';
import { IVideoApi } from '../apis/IVideoApi';
import { VideoApi } from '../apis/VideoApi';
import { Subtitle } from '../interfaces/Subtitle';
import { VideoPlayerProps } from '../interfaces/VideoPlayerProps';
import { ISocketAPI } from '../apis/ISocketAPI';
import { RoomState } from '../interfaces/RoomState';
import { VideoResource } from '../interfaces/VideoResource';
import { RoomResource } from '../interfaces/RoomResource';
import { v4 as uuidv4 } from 'uuid';
import { SocketAPI } from '../apis/SocketAPI';

interface VideoPlayerState
{
    videoServerLocation: string //This will be the location of the server location, I.E localhost:3050/ but not the actual video path.
    currentSubtitle: Subtitle; //This will always be client dependent, the server doesn't care
    videoResource: VideoResource;
    roomResource: RoomResource
    roomID: string,
    connected: boolean;
}

class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {

    private videoApi: IVideoApi;
    private SocketAPI!: ISocketAPI;
    private lastBroadcastTime: number;

    constructor(props: VideoPlayerProps)
    {
        super(props);
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.selectSubtitle = this.selectSubtitle.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.sendUpdatedVideoState = this.sendUpdatedVideoState.bind(this);

        this.videoApi = new VideoApi();
        this.lastBroadcastTime = 0;
        let videoLocation: string = this.videoApi.getVideoApiAddress();

        let isConnected = typeof (this.props.roomID) !== 'undefined';

        this.state =
        {
            videoServerLocation: videoLocation,
            currentSubtitle: {} as Subtitle, // This will be set by the subtitle picker, we conditionally render if this object is empty or not. 
            connected: isConnected,
            roomResource: {} as RoomResource,
            roomID: this.props.roomID,
            videoResource: {} as VideoResource
        };

        if (isConnected)
        {

            let roomResource: RoomResource =
            {
                id: this.props.roomID,
                name: this.props.videoResource.name,
                path: this.props.videoResource.path,
            }

            let message =
            {
                type: "joinRoom",
                roomState: roomResource
            };

            this.addSocketListener(this.roomSocketHandler);
            this.SocketAPI.send(JSON.stringify(message));
        }

    };


    render() 
    {
        let subtitleContent: JSX.Element[] = [];
        let currentSubtitleDisplay: JSX.Element = <div> No subtitle selected </div>;
        let createRoomButton: JSX.Element = <button onClick={() => { this.createRoom() }}> Create Room</button>

        if (this.state.connected)
        {
            createRoomButton = <div> </div>
        }

        if (typeof (this.state.currentSubtitle) !== 'undefined')
        {
            currentSubtitleDisplay = <div> {this.state.currentSubtitle.name} </div>;
        }

        if (typeof (this.props.videoResource.subtitles) !== 'undefined')
        {
            subtitleContent = this.props.videoResource.subtitles.map((subtitle: Subtitle, index: number) =>
            {
                return (
                    <track key={index} kind="subtitles" src={this.state.videoServerLocation + subtitle.path} label={subtitle.name} srcLang="en" />
                )
            });

        };


        let mainContent: JSX.Element = <div> <p> Assigning you to a room, awaiting video state. </p> </div>;

        if (typeof (this.props.videoResource.path) !== 'undefined') 
        {
            mainContent =
                <div>
                    <div className='videoPlayer'>
                        <div>
                            <video src={this.state.videoServerLocation + this.props.videoResource.path} className="mainVideo"
                                // onTimeUpdate={this.onVideoProgress} 
                                onPause={this.onPause} onPlay={this.onPlay} crossOrigin="anonymous" controls>
                                {subtitleContent}
                            </video>
                        </div>
                    </div>
                    <div className='toolbar'>

                        {currentSubtitleDisplay}
                    </div>
                    {createRoomButton}
                </div>

        }
        return (
            <div>
                {mainContent}
            </div>
        );
    }

    private selectSubtitle(subtitle: Subtitle)
    {
        this.setState({ currentSubtitle: subtitle });
    };


    private onPlay(event: SyntheticEvent<HTMLVideoElement>)
    {

        if (this.state.connected === true)
        {
            let _currentTime = event.currentTarget.currentTime;

            console.log('On play called, currentTime: ' + _currentTime);

            let _videoState: VideoState = {
                videoPosition: _currentTime,
                playingState: playingState.playing
            };

            this.sendUpdatedVideoState(_videoState);
        };

    };

    private onPause(event: SyntheticEvent<HTMLVideoElement>)
    {

        if (this.state.connected === true)
        {
            let _currentTime = event.currentTarget.currentTime;

            console.log('On pause called, currentTime: ' + _currentTime);

            let _videoState: VideoState = {
                videoPosition: _currentTime,
                playingState: playingState.paused
            };

            this.sendUpdatedVideoState(_videoState);
        };

    };

    private createRoom = () =>
    {
        this.setState({ connected: true });

        //Apply a listener to the socket with a callback
        this.addSocketListener(this.roomSocketHandler);

        let _roomID = uuidv4();
        let _roomState: RoomState =
        {
            id: _roomID,
            name: this.props.videoResource.name, //Name of room matches video. 
            path: this.props.videoResource.path, //Path of room matches video.
            videoState: this.getVideoStateFromVideoElement()
        };

        let message =
        {
            type: "createRoom",
            roomState: _roomState
        };

        this.setState({ roomID: _roomID });
        this.SocketAPI.send(JSON.stringify(message));

        return;
    };

    private addSocketListener = (listener: Function) =>
    {
        if (typeof (this.SocketAPI) === 'undefined')
        {
            this.establishConnection();
        }
        this.SocketAPI.addListener(listener);
    };


    private establishConnection = () =>
    {
        console.log('Establishing connection');
        this.SocketAPI = new SocketAPI();
    };

    private sendResynchUpdate()
    {
        let _roomState: RoomState = {
            id: this.state.roomID,
            name: this.props.videoResource.name,
            path: this.props.videoResource.path,
            videoState: this.getVideoStateFromVideoElement()
        };

        let message =
        {
            type: "updateRoom",
            roomState: _roomState
        }

        this.SocketAPI.send(JSON.stringify(message));
    };

    private getVideoStateFromVideoElement(): VideoState
    {
        let videoElement: any;
        if (typeof (document.getElementsByClassName('mainVideo')[0]) === "undefined")
        {
            throw new Error('Video element not found');
        };

        videoElement = document.getElementsByClassName('mainVideo')[0];

        let _playingState: playingState = videoElement.paused === true ? playingState.paused : playingState.playing;

        let videoState: VideoState = {
            videoPosition: videoElement.currentTime,
            playingState: _playingState
        }

        return videoState;

    };

    private setVideoElementState(videoState: VideoState)
    {
        if (typeof (document.getElementsByClassName('mainVideo')[0]) === "undefined")
        {
            throw new Error('Video element not found');
        };
        let videoElement: any = document.getElementsByClassName('mainVideo')[0];

        videoElement.currentTime = videoState.videoPosition;

        if (videoState.playingState === playingState.playing)
        {
            videoElement.play();
        }
        else
        {
            videoElement.pause();
        };

    }

    private sendUpdatedVideoState = (_videoState: VideoState) =>
    {

        if (typeof (this.state.roomID) === 'undefined')
        {
            throw 'No roomID set for the client, this should either be generated when the host client creates a room, or passed in from the room picker.'
        }

        let _roomState: RoomState = {
            id: this.state.roomID,
            name: this.state.videoResource.name,
            path: this.state.videoResource.path,
            videoState: _videoState
        };

        let message =
        {
            type: "updateRoom",
            roomState: _roomState
        }

        console.log('Broadcasting video state: ', message);

        if ((this.lastBroadcastTime + 100 < Date.now()) || (this.lastBroadcastTime === 0))
        {
            this.SocketAPI.send(JSON.stringify(message));
            this.lastBroadcastTime = Date.now();
        }

        this.lastBroadcastTime = Date.now();
    };

    private receiveUpdate(_roomState: RoomState)
    {
        if (this.getVideoStateFromVideoElement() !== _roomState.videoState)
        {
            this.setVideoElementState(_roomState.videoState!);
        };

    };

    private roomSocketHandler = (data: any) =>
    {

        if (data.toString() === 'ping')
        {
            this.SocketAPI.send('pong');
            return;
        };

        if (data.toString() === "resynch")
        {
            this.sendResynchUpdate();
            return;
        };

        let message: any = JSON.parse(data);

        switch (message.type)
        {
            case 'update':
                this.receiveUpdate(message.roomState);
                break;
            default:
                console.log("Unknown message type");
                break;

        };

    };

};

export { VideoPlayer }