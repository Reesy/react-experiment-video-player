import './styles/App.css';
import React from 'react';
import VideoPicker  from './components/VideoPicker';
import { VideoPlayer } from './components/VideoPlayer';
import { Video } from './interfaces/Video';
import RoomPicker from './components/RoomPicker';
import { Room } from './interfaces/Room';
import { ISocketAPI } from './apis/ISocketAPI';
import { SocketAPI } from './apis/SocketAPI';
import { v4 as uuidv4 } from 'uuid';

enum page
{
    home,
    video,
    room
};

interface AppState
{
    page: page;
    currentVideo: Video;
    currentRoom: Room;
};


interface AppProps
{

};

class App extends React.Component<AppProps, AppState>
{

    private SocketAPI!: ISocketAPI;
    
    constructor(props: AppProps)
    {
        super(props);
        this.selectVideo = this.selectVideo.bind(this);
        this.selectRoom = this.selectRoom.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.broadcastVideoState = this.broadcastVideoState.bind(this);

        this.state = {
            page: page.home,
            currentVideo: {} as Video, //This will be selected via the video picker. The state is here because we also make use of it in the video page.
            currentRoom: {} as Room    //Rooms are generated when the user initiates a room through clicking create room, or rooms are provided by the server and selected via the room picker. 
        };
    }

    render()
    {

        let videoContent: JSX.Element = <VideoPlayer video={this.state.currentVideo}
                                                     createRoom={this.createRoom}
                                                     broadcastVideoState={this.broadcastVideoState}
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

    private sendSocketData = (data: any) =>
    {
        if (typeof(this.SocketAPI) === 'undefined')
        {
            this.establishConnection();
        }
        
        this.SocketAPI.send(data);
    };

    private addSocketListener = (listener: Function) =>
    {
        if (typeof(this.SocketAPI) === 'undefined')
        {
            this.establishConnection();
        }

        this.SocketAPI.addListener(listener);
    
    };

    private roomListener = (data: any) =>
    {
        console.log('data received from socket', data);
    };

    private createRoom = (_video: Video) =>
    {   
   
        // this.currentRoom = newRoom;
        // websocket.send(JSON.stringify(newRoom));
        // console.log('Websocket opened');
        // {
        //     roomID: "2ec57289-dc91-4ca4-a6c9-dce02d378789",
        //     roomName: "Grease.mp4",
        //     video: {
        //       name: "Grease.mp4",
        //       baseName: "Grease",
        //       path: "http://localhost:3050/Grease.mp4",
        //       playingState: "paused",
        //       videoPosition: 0,
        //     },
        //   }

        //Generate an initial room object here using the video object 
        this.setState({currentVideo: _video})

        

        let randomNumber = uuidv4();
        let newRoom: Room = {
            roomID: randomNumber.toString(),
            roomName: this.state.currentVideo.name,
            video: this.state.currentVideo,
        };

        //Apply room state, this will only exist in two scenarios.
        //1. The user has selected a video and is now creating a room.
        //2. The user has selected a room and is now joining a room.
        this.setState({currentRoom: newRoom});
        
        //Apply a listener to the socket with a callback
        this.addSocketListener(this.roomListener);

        //Send it through the socket 
        this.sendSocketData(JSON.stringify(newRoom));
        //Apply a listener to the socket with a callback
        
        
        //Mutate video state through the callback 

        // console.log('Inside create room')
    }


    private broadcastVideoState = (video: Video) =>
    {   

        //Check if there is a valid current room, return if not as there is no shared room session to broadcast too
        if (typeof(this.state.currentRoom) === 'undefined')
        {
            return;
        }
        //Ensure the currentVideo matches the one passed in. 
        this.setState({currentVideo: video});

        //If there is merge the video state with the room state
        let updatedRoom: Room = this.state.currentRoom;
        updatedRoom.video = this.state.currentVideo;



        //Stringify and Send it through the socket 


        this.sendSocketData(JSON.stringify(updatedRoom));
    };

    private establishConnection = () =>
    {
        console.log('Establishing connection');
        this.SocketAPI = new SocketAPI();
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