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
        this.updateCurrentRoom = this.updateCurrentRoom.bind(this);

        this.state = {
            page: page.home,
            currentVideo: {} as Video, //This will be selected via the video picker. The state is here because we also make use of it in the video page.
            currentRoom: {} as Room    //Rooms are generated when the user initiates a room through clicking create room, or rooms are provided by the server and selected via the room picker. 
        };
    }

    public shouldComponentUpdate(nextProps: AppProps, nextState: AppState)
    {   
        return true;
    };
    render()
    {

        let videoContent: JSX.Element = <VideoPlayer video={this.state.currentVideo}
                                                     createRoom={this.createRoom}
                                                     updateCurrentRoom={this.updateCurrentRoom}
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
                             <p>Video position: {this.state.currentVideo.videoPosition} </p>
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

  
    private selectRoom = (room: Room) =>
    {
        console.log('xXxXXXXXXXXXXXXFAFAFA --------- SELECT ROOM CALLED ---------- xXxXXXXXXXXXXXX');
       // console.log('The room is: ', JSON.stringify(room));
        this.selectVideo(room.video);
        this.setState({currentRoom: room}); //Maybe this isn't required? 


        //We want to listen for a response from the server
        //but we do NOT wish to update the video state, another listener will be added for that. 
        this.addSocketListener(this.receiveJoinConfirmation);
      //  this.SocketAPI.addListener(this.joinListener);

        //send room to server, it should fetch the state from the host and rebroadcast it, to here aswell. 
        //Instead of sending the entire state, maybe we just need to send the roomID.
        this.sendSocketData(JSON.stringify(room));


        //maybe we should destruct the video object on ther room, all the server really needs is the roomID.
        //Do I also need to nuke the first listener?



    };

    private receiveJoinConfirmation = (data: any) =>
    {
        console.log(' --- Received join confirmation --- ');

        //We want to add a listener for the resynch that will occur on the server side. 
        this.addSocketListener(this.receiveRoomState);
        
        console.log(' --- Removing join confirmation listener --- ');
        //We no longer wish to listen for this response, remove the listener.
        this.SocketAPI.removeListener(this.receiveJoinConfirmation);

        //TODO
        //Is there any point in sending the room state here?
        //After we receive a confirm from the server we want to send off a request triggering a resynch.
        this.sendSocketData(JSON.stringify(this.state.currentRoom));

        console.log('The room is: ', data);
    //    this.selectVideo(_receivedRoom.video);

    };

    //This is added on create room, or after a response is returned from the server after room selection.
    private receiveRoomState = (data: any) =>
    {

        console.log(' --- Receive room state, this will blindly merge the video state. --- ');
        let _receivedRoom: Room = JSON.parse(data);

        
        if (typeof(_receivedRoom.resynch) !== 'undefined' && _receivedRoom.resynch === true)
        {
            //A new client has joined and this client has been designated the host, the server will grab the room state and if it's appropriate will send it to the new client.
            console.log('>> Resynch event called, room state from is mostly garbage, not applying new room state but sending current state back to the server for a rebroadcast. ')
            this.sendSocketData(JSON.stringify(this.state.currentRoom));
            return; 
        }
        
        console.log('The room is: ', JSON.stringify(_receivedRoom));
        this.selectVideo(_receivedRoom.video);

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

    private createRoom = (_video: Video) =>
    {   
   
        //Generate an initial room object here using the video object 
        this.setState({currentVideo: _video})

        

        let randomNumber = uuidv4();
        let newRoom: Room = {
            roomID: randomNumber.toString(),
            video: this.state.currentVideo
        };

        //Apply room state, this will only exist in two scenarios.
        //1. The user has selected a video and is now creating a room.
        //2. The user has selected a room and is now joining a room.
        this.setState({currentRoom: newRoom});
        
        //Apply a listener to the socket with a callback
        this.addSocketListener(this.receiveRoomState);

        //Send it through the socket 
        this.sendSocketData(JSON.stringify(newRoom));
    };


    private updateCurrentRoom = (video: Video) =>
    {   
        //Ensure the currentVideo matches the one passed in. 
        this.setState({currentVideo: video});

        //Check if there is a valid current room, return if not as there is no shared room session to broadcast too
        if (typeof(this.state.currentRoom) === 'undefined' || typeof(this.state.currentRoom.roomID) === 'undefined')
        {
            console.log('BroadcastVideoState called but no room was set for this client');
            return;
        }
  
        //TODO, check if this merge is ok and if a deep clone is needed instead kinda looks correct
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