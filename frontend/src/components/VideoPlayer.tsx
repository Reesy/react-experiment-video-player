import React from 'react';

class VideoPlayer extends React.Component<any, any> {

    public buttonPlay: any;
    constructor(props: any)
    {
      super(props);
    }
    render() 
    {
        return (
            <div> 
                <video width="640" height="360" src={this.props.video.path} className="mainVideo">
                    <track kind="subtitles" src="test.vtt" label="English" srcLang="en" default />
                    <track kind="subtitles" src="test2.vtt" label="Spanish" srcLang="es" />
                </video>
                <div id="video-controls" className="controls" data-state="hidden">
                    <button id="play" type="button" data-state="play" onClick={this.play}>Play</button>
                    <button id="pause" type="button" data-state="play" onClick={this.pause}>Pause</button>
                    <button id="stop" type="button" data-state="stop">Stop</button>
                    <div className="progress">
                        <progress id="progress" value="0">
                            <span id="progress-bar"></span>
                        </progress>
                    </div>
                    <button id="mute" type="button" data-state="mute">Mute/Unmute</button>
                    <button id="volinc" type="button" data-state="volup">Vol+</button>
                    <button id="voldec" type="button" data-state="voldown">Vol-</button>
                    <button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button>
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