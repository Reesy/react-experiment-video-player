import './styles/App.css';
import React from 'react';
import VideoPicker  from './components/VideoPicker';
import RoomPicker from './components/RoomPicker';
import { VideoPlayer } from './components/VideoPlayer';
import { VideoResource } from './interfaces/VideoResource';
import { RoomResource } from './interfaces/RoomResource';
import { VideoApi } from './apis/VideoApi';
import { IVideoApi } from './apis/IVideoApi';

enum page
{
    home,
    video,
    room
};

interface AppState
{
    page: page;
    videoResource: VideoResource;
    roomResource: RoomResource
    roomID: string, 
    connected: boolean;
};


interface AppProps
{

};

class App extends React.Component<AppProps, AppState>
{
    private videoApi: IVideoApi;
    
    constructor(props: AppProps)
    {
        super(props);
        this.selectVideo = this.selectVideo.bind(this);
        this.videoApi = new VideoApi();
        this.state = {
            page: page.home,
            videoResource: {} as VideoResource,
            roomResource: {} as RoomResource,
            roomID: undefined!,
            connected: false
        };
    }

    public shouldComponentUpdate(nextProps: AppProps, nextState: AppState)
    {   
        return true;
    };
   
    render()
    {

        let videoContent: JSX.Element = <VideoPlayer videoResource={this.state.videoResource}
                                                    roomID={this.state.roomID}
                                                     />

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
        
        if (typeof(this.state.videoResource.name) !== "undefined")
        {
            temporaryLog = <div> 
                             <p>Video Name: {this.state.videoResource.name} </p>
            
                        
                             <p>Video path {this.state.videoResource.path} </p>
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
    private selectVideo = (videoResource: VideoResource) =>
    {
        this.setState({videoResource: videoResource});
        this.setState({page: page.video});
    };

  
    private joinRoom = (_roomResource: RoomResource) =>
    {
        this.videoApi.getVideos()
            .then((videoResources: VideoResource[]) =>
            {
                videoResources.forEach((videoResource: VideoResource) => 
                {
                    if (_roomResource.name === videoResource.name)
                    {
                        this.setState({videoResource: videoResource});
                        this.setState({roomID: _roomResource.id});
                        this.setState({page: page.video});
                    };
                });
        })
        .catch((error: any) => {
            throw error;
        });





    //     this.setState({roomID: _roomResource.id});
        
    //     //Todo: Once we add a new service to the backend to pair roomIds with videoIDs we need to grab the resource from the API, for now its passed in. 
    //     let selectedVideoResource: VideoResource =
    //     {
    //         name: _roomResource.name,
    //         path: _roomResource.path
    //     };

    //     let message = 
    //     {
    //         type: "joinRoom",
    //         roomState: _roomResource
    //     };

    //     this.setState({videoResource: selectedVideoResource});
    //     // this.addSocketListener(this.roomSocketHandler);
    //    // this.SocketAPI.send(JSON.stringify(message));
    //  //   this.setState({connected: true});
       //  this.setState({page: page.video});
    };




    headerContent: React.ReactNode = (
        <header>
            <button
                onClick={() =>
                {
                    this.setState({
                        page: page.home
                    });
                    this.setState({videoResource: {} as VideoResource})
                    this.setState({roomResource: {} as RoomResource})
                }}>
                Home
            </button>
            <button
                onClick={() =>
                {
                    this.setState({
                        page: page.room
                    });
                    this.setState({videoResource: {} as VideoResource})
                    this.setState({roomResource: {} as RoomResource})
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
               selectRoom={this.joinRoom}
            />
        </div>
    );
};


export default App;