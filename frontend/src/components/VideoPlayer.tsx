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

        return (
            <div> 
                <video src={this.props.video.path} className="mainVideo" style={videoStyle}>
                    <track kind="subtitles" src="test.vtt" label="English" srcLang="en" default />
                    <track kind="subtitles" src="test2.vtt" label="Spanish" srcLang="es" />
                </video>
                <div id="video-controls" className="controls" data-state="hidden" style={groupStyle}>
                    <button id="playPause" type="button" onClick={this.playOrPause} className={this.props.pauseState !== "paused" ? "fa fa-play" : "fa fa-pause"} style={buttonStyle}></button>
                    <button id="subtitle" type="button" className="fa fa-language" style={buttonStyle}></button>
                    <button id="fs" type="button" onClick={this.setFullScreen} data-state="go-fullscreen" className="fa fa-expand" style={buttonStyle}></button>
                </div>
                <h1>
                {this.props.pauseState}
                </h1>
            </div>
      
        );
    }

    private playOrPause(event: any)
    {
        if (this.props.connectedState)
        {
            this.props.updatePlayState();
        };
        let videoElement: any = document.getElementsByClassName('mainVideo')[0];
        let playPauseButton: any = document.getElementById('playPause');
        if(videoElement.paused)
        {
            videoElement.play();
            playPauseButton.className = "fa fa-pause";
        }
        else
        {
            videoElement.pause();
            playPauseButton.className = "fa fa-play";
        }
     
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