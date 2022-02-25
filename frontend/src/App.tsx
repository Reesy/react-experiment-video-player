import React from 'react';
import VideoPicker  from './components/VideoPicker';
import { Video } from './interfaces/Video';


enum page
{
    home,
    video,
    room
};

interface AppState
{
    page: page;
    currentVideo: Video
};


interface AppProps
{

};

class App extends React.Component<AppProps, AppState>
{
    constructor(props: AppProps)
    {
        super(props);
        this.selectVideo = this.selectVideo.bind(this);

        this.state = {
            page: page.home,
            currentVideo: {} as Video //This will be selected via the video picker. The state is here because we also make use of it in the video page.
        };
    }

    render()
    {
        let content = this.homeContent;
        switch (this.state.page)
        {
            case page.home:
                content = this.homeContent;
                break;
            case page.video:
                content = this.videoContent;
                break;
            case page.room:
                content = this.roomContent;
                break;
            default:
                content = this.homeContent
        };

        let temporaryLog : React.ReactNode = <div> Current Video is not set</div>;
        
        if (typeof(this.state.currentVideo.name) !== "undefined")
        {
            temporaryLog = <div> 
                             <p>Video Name: {this.state.currentVideo.name} </p>
                             <p>Video playing: {this.state.currentVideo.playingState} </p>
                             <p>Video path {this.state.currentVideo.path} </p>
                           </div>
        };


        return (
            <div className="App">

                {this.headerContent}
                {content}
                {temporaryLog}
            </div>

        );
    };


    //Callback from the video picker.
    private selectVideo = (video: Video) =>
    {
        this.setState({currentVideo: video});
    };




    headerContent: React.ReactNode = (
        <header>
            <button
                onClick={() =>
                {
                    this.setState({
                        page: page.home
                    });
                }}>
                Home
            </button>
            <button
                onClick={() =>
                {
                    this.setState({
                        page: page.room
                    });
                }}>
                Rooms
            </button>
        </header>
    );

    homeContent: React.ReactNode = (
        <div>
            <VideoPicker
                selectVideo={this.selectVideo}/>
        </div>
    );

    videoContent: React.ReactNode = (
        <div>
            <h1>Video</h1>
        </div>
    );

    roomContent: React.ReactNode = (
        <div>
            <h1>Room</h1>
        </div>
    );

}


export default App;