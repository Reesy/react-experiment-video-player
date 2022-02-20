import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

class VideoPlayer extends React.Component<any, any> {

    public buttonPlay: any;
    

    //I want the screen to re-render when props change
    public shouldComponentUpdate(nextProps: any, nextState: any) 
    {
        
        if (nextProps.pauseState !== this.props.pauseState) 
        {
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

        return false;
    };

    constructor(props: any)
    {
        super(props);
        this.playOrPause = this.playOrPause.bind(this);
    };
    
    render() 
    {
        let videoStyle = 
        {
            position: "absolute" as "absolute",
            background: "black",
            display: "flex",
            height: "360px",
            width: "640px",
            opacity: 0.5
        }

        let groupStyle: any = 
        {
            display: "flex",
            marginTop: "335px",
            background: "white",
            height: "25px",
            width: "640px",
            position: "relative" as "relative"
        }

        let buttonStyle = 
        {
            background: "none",
            border: "none",
            color: "grey",
            cursor: "pointer",
            fontSize: "20px"
        }
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
                <video src={this.props.video.path} className="mainVideo" style={videoStyle}>
                    <track kind="subtitles" src="test.vtt" label="English" srcLang="en" default />
                    <track kind="subtitles" src="test2.vtt" label="Spanish" srcLang="es" />
                </video>
                <div id="video-controls" className="controls" data-state="hidden" style={groupStyle}>
                    <button id="playPause" type="button" onClick={this.playOrPause} className={this.props.pauseState !== "paused" ? "fa fa-pause": "fa fa-play" } style={buttonStyle}></button>
                    <button id="subtitle" type="button" className="fa fa-language" style={buttonStyle}></button>
                    <button id="fs" type="button" onClick={this.setFullScreen} data-state="go-fullscreen" className="fa fa-expand" style={buttonStyle}></button>
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

    private playOrPause(event: any)
    {

        this.props.updatePlayState();

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