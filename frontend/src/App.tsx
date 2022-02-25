import './styles/App.css';
import React from 'react';
import VideoPicker  from './components/VideoPicker';
import { VideoPlayer } from './components/VideoPlayer';
import { Video } from './interfaces/Video';
import RoomPicker from './components/RoomPicker';
import { Room } from './interfaces/Room';


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
        this.selectRoom = this.selectRoom.bind(this);

        this.state = {
            page: page.home,
            currentVideo: {} as Video //This will be selected via the video picker. The state is here because we also make use of it in the video page.
        };
    }

    render()
    {

        let videoContent: JSX.Element = <VideoPlayer video={this.state.currentVideo}/>

        let content = this.homeContent;
        switch (this.state.page)
        {
            case page.home:
                content = this.homeContent;
                break;
            case page.video:
                content = videoContent;
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
        this.setState({page: page.video});
    };

    //Callback from room picker.
    private selectRoom = (room: Room) =>
    {
        this.selectVideo(room.video);
    };

    headerContent: React.ReactNode = (
        <header>
            <button
                onClick={() =>
                {
                    this.setState({
                        page: page.home
                    });

                    this.setState({currentVideo: {} as Video})
                }}>
                Home
            </button>
            <button
                onClick={() =>
                {
                    this.setState({
                        page: page.room
                    });

                    this.setState({currentVideo: {} as Video})
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

    roomContent: React.ReactNode = (
        <div>
            <RoomPicker
                selectRoom={this.selectRoom}
            />
        </div>
    );
};


export default App;