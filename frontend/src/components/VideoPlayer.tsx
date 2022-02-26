import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import "../styles/VideoPlayer.css"
import { Video } from '../interfaces/Video';
import { IVideoApi } from '../apis/IVideoApi';
import { VideoApi } from '../apis/VideoApi';
import { SubtitlePicker } from './SubtitlePicker';
import { Subtitle } from '../interfaces/Subtitle';

interface VideoPlayerProps 
{
    video: Video;
    createRoom: (video: Video) => void;
    broadcastVideoState: (video: Video) => void;
};

interface VideoPlayerState
{
    isPlaying: boolean;
    videoPosition: number;
    videoPath: string;
    connected: boolean;
    currentSubtitle: Subtitle;
}

class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {

    private videoApi: IVideoApi;

    // //I want the screen to re-render when props change
    public shouldComponentUpdate(nextProps: VideoPlayerProps, nextState: VideoPlayerState) 
    {


        // When a video prop is passed in, we'll check it against the video state and conditionally update.
        // If a parent socket returns a new video we will compare the video position and if they are too far outside of a range we will try to update this one to the latest video position.
        //if (nextProps.isPlaying !== this.props.video)

        if (nextState.isPlaying !== this.state.isPlaying)
        {
                    //Todo, make this call less.
            let videoElement: any = document.getElementsByClassName('mainVideo')[0];

            if(videoElement.paused)
            {
                videoElement.play();

            }
            else
            {
                videoElement.pause();
            }
            return true;
        }



        return false;
  
    };

    constructor(props: VideoPlayerProps)
    {
        super(props);
        this.setPlayOrPause = this.setPlayOrPause.bind(this);
        this.selectSubtitle = this.selectSubtitle.bind(this);

        this.videoApi = new VideoApi();

        let videoPath: string = this.videoApi.getVideoApiAddress();
        
        this.state = {
            isPlaying: false,
            videoPosition: 0,
            videoPath: videoPath,
            connected: false,
            currentSubtitle: {} as Subtitle // This will be set by the subtitle picker, we conditionally render if this object is empty or not. 
        };


    };
    
    render() 
    {

        //I want to get the current time from the video player:
        let videoElement: any = document.getElementsByClassName('mainVideo')[0];


        let currentTime = 999;
        let duration = 999;
        let percentage: number = 0;

        if (typeof(videoElement) !== 'undefined')
        {


            currentTime = videoElement.currentTime;
            duration = videoElement.duration;
            percentage = currentTime / duration;

        }
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
                        <video src={this.state.videoPath + "/" + this.props.video.path} className="mainVideo" >
                            <track kind="subtitles" src="test.vtt" label="English" srcLang="en" default />
                            <track kind="subtitles" src="test2.vtt" label="Spanish" srcLang="es" />
                        </video>
                        <div id="video-controls" className="groupStyle" data-state="hidden">
                            <button id="playPause" type="button" onClick={this.setPlayOrPause} className={this.state.isPlaying !== false ? "fa fa-pause buttonStyle": "fa fa-play buttonStyle" }></button>
                            <button id="subtitle" type="button" className="fa fa-language buttonStyle"></button>
                            <button id="fs" type="button" onClick={this.setFullScreen} data-state="go-fullscreen" className="fa fa-expand buttonStyle"></button>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <p>currentTime: {currentTime}</p>
                        <p>duration: {duration}</p>
                        <p>percentage: {percentage}</p>
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
        this.setState({isPlaying: !this.state.isPlaying});

        //Append video time to the object. 

        //generate a new video objects based on the props and pass that up to the parent. I may need to add an exclusion to the shouldComponentUpdate
        let updatedVideo: Video = this.props.video;

        let videoElement: any = document.getElementsByClassName('mainVideo')[0];

        let videoPosition = videoElement.currentTime;
        console.log('VideoPosition: ' + videoPosition);
        updatedVideo.videoPosition = videoPosition;
        this.props.broadcastVideoState(updatedVideo);
    };

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