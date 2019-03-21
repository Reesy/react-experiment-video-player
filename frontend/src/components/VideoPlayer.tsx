import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

class VideoPlayer extends React.Component<any, any> {

    public buttonPlay: any;
    constructor(props: any)
    {
      super(props);
    }
    render() 
    {
        let playerStyle = 
        {
           // display: "flex"
           background: "white"
        }

        let videoStyle = 
        {
            display: "flex",
            width: "640px",
            height: "360px",
            background: "black"
        }

        let groupStyle = 
        {
            background: "white",
            display: "flex",
            alignItems: "flex-end",
            height: "25px",
            paddingBottom: "5px",
        }

        let buttonStyle = 
        {
            display: "flex",
            fontSize: "20px",
            color: "grey",
            border: "none", /* Remove borders */
            background: "none",
            cursor: "pointer"
        }

        {/* <div className="progress">
        <progress id="progress" value="90">
            <span id="progress-bar"></span>
        </progress>
    </div> */}
        return (
            <div style={playerStyle}> 
                {/* <div style={videoStyle}>

                </div> */}
                <video src={this.props.video.path} className="mainVideo" style={videoStyle}>
                    <track kind="subtitles" src="test.vtt" label="English" srcLang="en" default />
                    <track kind="subtitles" src="test2.vtt" label="Spanish" srcLang="es" />
                </video>
                <div id="video-controls" className="controls" data-state="hidden" style={groupStyle}>
                    <button id="play" type="button" data-state="play" onClick={this.play} className="fa fa-play" style={buttonStyle}></button>
                    <button id="pause" type="button" data-state="play" onClick={this.pause} className="fa fa-pause" style={buttonStyle}></button>
                    <button id="stop" type="button" data-state="stop" className="fa fa-stop" style={buttonStyle}></button>
                    <button id="fs" type="button" data-state="go-fullscreen" className="fa fa-expand" style={buttonStyle}></button>
                </div>
            </div>
        );
    }

    private play(event: any)
    {
        let buttonPlay: any = document.getElementsByClassName('mainVideo')[0];
        buttonPlay.play();
    }

    private pause(event: any)
    {
        let buttonPlay: any = document.getElementsByClassName('mainVideo')[0];
        buttonPlay.pause();
    }

    private stop(event: any)
    {

    }
}

export { VideoPlayer }