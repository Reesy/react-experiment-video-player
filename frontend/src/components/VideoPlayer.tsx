import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import "../styles/VideoPlayer.css"
import { Video } from '../interfaces/Video';
import { IVideoApi } from '../apis/IVideoApi';
import { VideoApi } from '../apis/VideoApi';

interface VideoPlayerProps 
{
    video: Video;
};

interface VideoPlayerState
{
    isPlaying: boolean;
    videoPosition: number;
    videoPath: string;
}

class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {

    private videoApi: IVideoApi;

    // //I want the screen to re-render when props change
    public shouldComponentUpdate(nextProps: VideoPlayerProps, nextState: VideoPlayerState) 
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
  
    };

    constructor(props: any)
    {
        super(props);
        this.setPlayOrPause = this.setPlayOrPause.bind(this);
        this.videoApi = new VideoApi();

        let videoPath: string = this.videoApi.getVideoApiAddress();
        
        this.state = {
            isPlaying: false,
            videoPosition: 0,
            videoPath: videoPath
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

        return (
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
      
        );
    }

    private setPlayOrPause(event: any)
    {
        this.setState({isPlaying: !this.state.isPlaying});
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