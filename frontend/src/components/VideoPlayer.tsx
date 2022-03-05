import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import "../styles/VideoPlayer.css"
import { playingState, VideoState } from '../interfaces/VideoState';
import { VideoResource } from '../interfaces/VideoResource';
import { IVideoApi } from '../apis/IVideoApi';
import { VideoApi } from '../apis/VideoApi';
import { SubtitlePicker } from './SubtitlePicker';
import { Subtitle } from '../interfaces/Subtitle';
import { VideoPlayerProps } from '../interfaces/VideoPlayerProps';
import { eventNames } from 'process';

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

        if (this.props.videoState !== nextProps.videoState)
        {
            let videoElement: any = document.getElementsByClassName('mainVideo')[0];

            if (typeof (videoElement) === "undefined")
            {
                //We have just received an initial state from the server, we have yet to render so we will just accept the state and render
                return true;
            };
            let currentVideoPosition = videoElement.currentTime;

            //This scenario is room join, therefore we want to just accept the state. 
            // if (currentVideoPosition === 0 && this.props.videoState.videoPosition !== 0)
            // {
            //     currentVideoPosition = this.props.videoState.videoPosition;
                

            //     if ( this.props.videoState.playingState === playingState.playing)
            //     {
            //         videoElement.play();
            //     }
            //     else
            //     {
            //         videoElement.pause();
            //     }
            // };

            //If incoming is 0 we assume its a callback from a new join and we want to exit

            //If there is more than a 2-3 second difference then we want to merge the nextProps state in. 

            if ( (currentVideoPosition !== 0) && (Math.abs(currentVideoPosition - nextProps.videoState.videoPosition) > 3) )
            {
                videoElement.currentTime = nextProps.videoState.videoPosition;

                //Maybe I also need to setCurrentVideo here too, just so the state of the app matches when there's a change.?
                console.log('CurrentVideoPosition: ' + currentVideoPosition + " NextProps.video.videoPosition: " + nextProps.videoState.videoPosition);
                console.log('math.floor currentVideoPosition: ' + Math.floor(currentVideoPosition) + " math.floor nextProps.video.videoPosition: " + Math.floor(nextProps.videoState.videoPosition));
            }


            //Modify this code. 



            // if (nextProps.videoState.playingState === playingState.playing)
            // {
            //     videoElement.play();
            // }
            // else
            // {
            //     videoElement.pause();
            // }

            console.log('There was a change of state triggered');
            return true;

        };
 
        return false;

    };

    constructor(props: VideoPlayerProps)
    {
        super(props);
        this.setPlayOrPause = this.setPlayOrPause.bind(this);
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
        let videoElement: any = {
            paused: true
        }

        if (typeof ( document.getElementsByClassName('mainVideo')[0]) !== "undefined")
        {
            videoElement = document.getElementsByClassName('mainVideo')[0];
        }










        
        let subtitleContent: JSX.Element = <div> No subtitles </div>;

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
            subtitleContent = <SubtitlePicker
                subtitles={this.props.videoResource.subtitles}
                selectSubtitle={this.selectSubtitle}
            />
        }


        let mainContent: JSX.Element = <div> <p> Assigning you to a room, awaiting video state. </p> </div>;

        if (typeof (this.props.videoResource.path) !== 'undefined') 
        {
            mainContent = 
            <div>
                <div className='videoPlayer'>
                    <div>
                        <video src={this.state.videoServerLocation + "/" + this.props.videoResource.path} className="mainVideo" onTimeUpdate={this.onVideoProgress}>
                            <track kind="subtitles" src="test.vtt" label="English" srcLang="en" default />
                            <track kind="subtitles" src="test2.vtt" label="Spanish" srcLang="es" />
                        </video>
                        <div id="video-controls" className="groupStyle" data-state="hidden">
                            <button id="playPause" type="button" onClick={this.setPlayOrPause} className={videoElement.paused === true ? "fa fa-play buttonStyle": "fa fa-pause buttonStyle" }></button>
                            <button id="subtitle" type="button" className="fa fa-language buttonStyle"></button>
                            <button id="fs" type="button" onClick={this.setFullScreen} data-state="go-fullscreen" className="fa fa-expand buttonStyle"></button>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <p>Video player: currentTime: {this.props.videoState.videoPosition}</p>
                    </div>
                </div>
                <div className='toolbar'>
                    {subtitleContent}
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

    private setPlayOrPause(event: any)
    {   
        let videoElement: any = document.getElementsByClassName('mainVideo')[0];

        if (videoElement.currentTime === 0 && this.props.videoState.videoPosition !== 0)
        {
            videoElement.currentTime = this.props.videoState.videoPosition;
        }
        if ( videoElement.paused )
        {
            videoElement.play();
        }
        else
        {
            videoElement.pause();
        }

        this.setState({ clicks: this.state.clicks + 1 });

        let _videoPosition = videoElement.currentTime;
        let _playingState: playingState = videoElement.paused === true ? playingState.paused : playingState.playing;
        
        let _videoState : VideoState = {
            videoPosition: _videoPosition,
            playingState: _playingState
        }

        this.props.updateVideoState(_videoState);

        if (this.props.connected === true)
        {
            this.props.triggerBroadcast();
        };

    
    };

    private onVideoProgress(event: any)
    {
        let _playingState: playingState = event.target.paused === true ? playingState.paused : playingState.playing;

        let _videoState : VideoState = {
            videoPosition: event.target.currentTime,
            playingState: _playingState
        }
        this.props.updateVideoState(_videoState);
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