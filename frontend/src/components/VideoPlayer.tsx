import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import "../styles/VideoPlayer.css"
import { pauseState, Video } from '../interfaces/Video';
import { IVideoApi } from '../apis/IVideoApi';
import { VideoApi } from '../apis/VideoApi';
import { SubtitlePicker } from './SubtitlePicker';
import { Subtitle } from '../interfaces/Subtitle';

interface VideoPlayerProps 
{
    video: Video;
    createRoom: (video: Video) => void;
    updateCurrentRoom: (video: Video) => void;
};

interface VideoPlayerState
{
    video: Video;
    videoServerLocation: string //This will be the location of the server location, I.E localhost:3050/ but not the actual video path.
    currentSubtitle: Subtitle; //This will always be client dependent, the server doesn't care
}

class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {

    private videoApi: IVideoApi;

    // //I want the screen to re-render when props change
    public shouldComponentUpdate(nextProps: VideoPlayerProps, nextState: VideoPlayerState) 
    {   

        if (this.state.video.playingState !== nextProps.video.playingState)
        {
            let videoElement: any = document.getElementsByClassName('mainVideo')[0];





            
            // if (nextProps.video.playingState === pauseState.playing)
            // {
            //     videoElement.play();
            // }
            // else
            // {
            //     videoElement.pause();
            // }

            return true;
        }


        if (Math.floor(this.state.video.videoPosition) !== Math.floor(nextState.video.videoPosition))
        {
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

        let videoLocation : string = this.videoApi.getVideoApiAddress();
        
        this.state = {
            video: this.props.video,
            videoServerLocation: videoLocation,
            currentSubtitle: {} as Subtitle // This will be set by the subtitle picker, we conditionally render if this object is empty or not. 
        };


    };
    
    render() 
    {

        let subtitleContent: JSX.Element = <div> No subtitles </div>;

        let currentSubtitleDisplay: JSX.Element = <div> No subtitle selected </div>;
        
        if (typeof(this.state.currentSubtitle) !== 'undefined')
        {
            currentSubtitleDisplay = <div> {this.state.currentSubtitle.name} </div>;
        }
        
        if (typeof(this.props.video.subtitles) !== 'undefined')
        {
            subtitleContent = <SubtitlePicker 
                                    subtitles={this.props.video.subtitles} 
                                    selectSubtitle={this.selectSubtitle}    
                                />
        }
        return (
            <div>
                <div className='videoPlayer'>
                    <div> 
                        <video src={this.state.videoServerLocation + "/" + this.props.video.path} className="mainVideo" onTimeUpdate={this.onVideoProgress}>
                            <track kind="subtitles" src="test.vtt" label="English" srcLang="en" default />
                            <track kind="subtitles" src="test2.vtt" label="Spanish" srcLang="es" />
                        </video>
                        <div id="video-controls" className="groupStyle" data-state="hidden">
                            <button id="playPause" type="button" onClick={this.setPlayOrPause} className={this.state.video.playingState !== pauseState.paused ? "fa fa-pause buttonStyle": "fa fa-play buttonStyle" }></button>
                            <button id="subtitle" type="button" className="fa fa-language buttonStyle"></button>
                            <button id="fs" type="button" onClick={this.setFullScreen} data-state="go-fullscreen" className="fa fa-expand buttonStyle"></button>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <p>currentTime: {this.state.video.videoPosition}</p>
                        {/* <p>duration: {duration}</p>
                        <p>percentage: {percentage}</p> */}
                    </div>
                </div>
                <div className='toolbar'>
                    {subtitleContent}
                    {currentSubtitleDisplay}
                </div>

                <button onClick={() => { this.props.createRoom(this.props.video)}}> Create Room</button>
            </div>
        );
    }

    private selectSubtitle(subtitle: Subtitle)
    {
        this.setState({currentSubtitle: subtitle});
    };

    private setPlayOrPause(event: any)
    {

        let _newVideoChange: Video = JSON.parse(JSON.stringify(this.state.video));


        _newVideoChange.playingState = this.state.video.playingState === pauseState.paused ? pauseState.playing : pauseState.paused;


        this.setState({video: _newVideoChange});


        // this.setState({video: _newVideoChange});

        //Append video time to the object. 

        // //generate a new video objects based on the props and pass that up to the parent. I may need to add an exclusion to the shouldComponentUpdate
        // let updatedVideo: Video = this.props.video;

        // let videoElement: any = document.getElementsByClassName('mainVideo')[0];

        // let videoPosition = videoElement.currentTime;
        // console.log('VideoPosition: ' + videoPosition);
        // updatedVideo.videoPosition = videoPosition;
        this.props.updateCurrentRoom(_newVideoChange);
    };

    private onVideoProgress(event: any)
    {

        //This is NASTY maybe not needed.

        let _newVideoChange: Video = JSON.parse(JSON.stringify(this.state.video));
        _newVideoChange.videoPosition = event.target.currentTime;

        this.setState({video: _newVideoChange});

    }

    private setFullScreen(event: any)
    {
        let videoElement: any = document.getElementsByClassName('mainVideo')[0];
        if(videoElement.requestFullscreen)
        {
            videoElement.requestFullscreen();
        }
        else if(videoElement.mozRequestFullScreen)
        {
            videoElement.mozRequestFullScreen();
        }
    }

}

export { VideoPlayer }
