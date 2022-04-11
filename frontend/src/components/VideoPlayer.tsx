import React, { SyntheticEvent } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import "../styles/VideoPlayer.css"
import { playingState, VideoState } from '../interfaces/VideoState';
import { IVideoApi } from '../apis/IVideoApi';
import { VideoApi } from '../apis/VideoApi';
import { Subtitle } from '../interfaces/Subtitle';
import { VideoPlayerProps } from '../interfaces/VideoPlayerProps';

interface VideoPlayerState
{
    videoServerLocation: string //This will be the location of the server location, I.E localhost:3050/ but not the actual video path.
    currentSubtitle: Subtitle; //This will always be client dependent, the server doesn't care
    clicks: number;
}
 
class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {

    private videoApi: IVideoApi;

    
    public shouldComponentUpdate(nextProps: VideoPlayerProps, nextState: VideoPlayerState) 
    {   

        if (this.props.connected !== nextProps.connected)
        {
            return true;
        }
        if (this.state.clicks !== nextState.clicks)
        {
            //kind've a pass through/re-render (would be better if video state changes could be watched by react, will research later)
            return true; 
        }
        
        let videoElement: any = document.getElementsByClassName('mainVideo')[0];

        if (typeof (videoElement) === "undefined")
        {
            //We have just received an initial state from the server, we have yet to render so we will just accept the state and render
            return true;
        };
        let currentVideoPosition = videoElement.currentTime;

        if ( videoElement.paused === true && nextProps.videoState.playingState === playingState.playing)
        {
            videoElement.play();
        }

        if ( videoElement.paused === false && nextProps.videoState.playingState === playingState.paused)
        {
            videoElement.pause();
        }

        if (this.props.videoState !== nextProps.videoState)
        {
            if ( (Math.abs(currentVideoPosition - nextProps.videoState.videoPosition) > 3) )
            {
                videoElement.currentTime = nextProps.videoState.videoPosition;
                console.log('CurrentVideoPosition: ' + currentVideoPosition + " NextProps.video.videoPosition: " + nextProps.videoState.videoPosition);
                console.log('math.floor currentVideoPosition: ' + Math.floor(currentVideoPosition) + " math.floor nextProps.video.videoPosition: " + Math.floor(nextProps.videoState.videoPosition));
            }

            return true;
        };
        

        return false;

    };

    constructor(props: VideoPlayerProps)
    {
        super(props);
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.selectSubtitle = this.selectSubtitle.bind(this);
        this.onVideoProgress = this.onVideoProgress.bind(this);

        this.videoApi = new VideoApi();

        let videoLocation: string = this.videoApi.getVideoApiAddress();

        this.state =
        {
            videoServerLocation: videoLocation,
            currentSubtitle: {} as Subtitle, // This will be set by the subtitle picker, we conditionally render if this object is empty or not. 
            clicks: 0
        };

    };


    render() 
    {
        let videoElement: any;
        if (typeof ( document.getElementsByClassName('mainVideo')[0]) !== "undefined")
        {
            videoElement = document.getElementsByClassName('mainVideo')[0];
            
            if (videoElement.currentTime === 0 && this.props.videoState.videoPosition !== 0)
            {
                if ( this.props.videoState.playingState === playingState.playing)
                {
                    videoElement.play();
                }
                else
                {
                    videoElement.pause();
                }
            };
            
        
        }
        else 
        {
            videoElement = {
                paused: true
            }
    
        }



        let subtitleContent: JSX.Element[] = [];

        let currentSubtitleDisplay: JSX.Element = <div> No subtitle selected </div>;

        let createRoomButton: JSX.Element = <button onClick={() => { this.props.createRoom(this.props.videoState) }}> Create Room</button>


        if (this.props.connected)
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
                        <video src={this.state.videoServerLocation + this.props.videoResource.path} className="mainVideo" onTimeUpdate={this.onVideoProgress} onPause={this.onPause} onPlay={this.onPlay} crossOrigin="anonymous" controls>
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
      
        let _currentTime = event.currentTarget.currentTime;
        console.log('On play called, currentTime: ' + _currentTime);
        if (_currentTime === 0 && this.props.videoState.videoPosition !== 0)
        {
            _currentTime = this.props.videoState.videoPosition;
        }

        this.setState({ clicks: this.state.clicks + 1 });
        
        let _videoState : VideoState = {
            videoPosition: _currentTime,
            playingState: playingState.playing
        }

        this.props.updateVideoState(_videoState);

        if (this.props.connected === true)
        {
            this.props.triggerBroadcast(_videoState);
        };

    };

    private onPause(event: SyntheticEvent<HTMLVideoElement>)
    {
        let _currentTime = event.currentTarget.currentTime;
        console.log('On pause called, currentTime: ' + _currentTime);
        if (_currentTime === 0 && this.props.videoState.videoPosition !== 0)
        {
            _currentTime = this.props.videoState.videoPosition;
        }

        this.setState({ clicks: this.state.clicks + 1 });
        
        let _videoState : VideoState = {
            videoPosition: _currentTime,
            playingState: playingState.paused
        }

        this.props.updateVideoState(_videoState);

        if (this.props.connected === true)
        {
            this.props.triggerBroadcast(_videoState);
        };

    };

    private onVideoProgress(event: SyntheticEvent<HTMLVideoElement>)
    {
        let _playingState: playingState = event.currentTarget.paused === true ? playingState.paused : playingState.playing;

        let _videoState : VideoState = {
            videoPosition: event.currentTarget.currentTime,
            playingState: _playingState
        }

        this.props.updateVideoState(_videoState)
    };

    private setFullScreen(event: any)
    {
        let videoElement: any = document.getElementsByClassName('mainVideo')[0];
        if (videoElement.requestFullscreen)
        {
            videoElement.requestFullscreen();
        }
        else if (videoElement.mozRequestFullScreen)
        {
            videoElement.mozRequestFullScreen();
        }
    }

}

export { VideoPlayer }