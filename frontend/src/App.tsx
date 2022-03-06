import './styles/App.css';
import React from 'react';
import VideoPicker  from './components/VideoPicker';
import RoomPicker from './components/RoomPicker';
import { VideoPlayer } from './components/VideoPlayer';
import { playingState, VideoState } from './interfaces/VideoState';
import { VideoResource } from './interfaces/VideoResource';
import { RoomResource } from './interfaces/RoomResource';
import { ISocketAPI } from './apis/ISocketAPI';
import { SocketAPI } from './apis/SocketAPI';
import { v4 as uuidv4 } from 'uuid';
import { RoomState } from './interfaces/RoomState';

enum page
{
    home,
    video,
    room
};

interface AppState
{
    page: page;
    videoState: VideoState;
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

    private SocketAPI!: ISocketAPI;
    
    constructor(props: AppProps)
    {
        super(props);
        this.selectVideo = this.selectVideo.bind(this);
        this.selectRoom = this.selectRoom.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.updateVideoState = this.updateVideoState.bind(this);
        this.triggerBroadcast = this.triggerBroadcast.bind(this);

        this.state = {
            page: page.home,
            videoResource: {} as VideoResource,
            videoState: { 
                playingState: playingState.paused,
                videoPosition: 0
            },
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

        let videoContent: JSX.Element = <VideoPlayer videoState={this.state.videoState}
                                                     videoResource={this.state.videoResource}
                                                     createRoom={this.createRoom}
                                                     triggerBroadcast={this.triggerBroadcast}
                                                     updateVideoState={this.updateVideoState}
                                                     connected={this.state.connected}
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
                             <p>Video playing: {this.state.videoState.playingState} </p>
                             <p>Video position: {this.state.videoState.videoPosition} </p>
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

  
    private selectRoom = (_roomResource: RoomResource) =>
    {
        this.setState({roomID: _roomResource.id});
        this.addSocketListener(this.receiveJoinConfirmation);
        this.sendSocketData(JSON.stringify(_roomResource));
        this.setState({connected: true});
        this.setState({page: page.video});
    };

    private receiveJoinConfirmation = (data: any) =>
    {
        console.log(' --- Received join confirmation --- ');

        //We want to add a listener for the resynch that will occur on the server side. 
        this.addSocketListener(this.receiveRoomState);
        
        console.log(' --- Removing join confirmation listener --- ');
        //We no longer wish to listen for this response, remove the listener.
        this.SocketAPI.removeListener(this.receiveJoinConfirmation);

        let _receivedRoom: RoomState = JSON.parse(data);
        
        let _videoResource: VideoResource =
        {
            name: _receivedRoom.name,
            path: _receivedRoom.name
        };

        let _videoState: VideoState = _receivedRoom.videoState!; //Assume this is here for now?!

        this.setState({videoResource: _videoResource});
        this.setState({videoState: _videoState});

        this.setState({page: page.video});

    };


    private updateVideoState(_videoState: VideoState): void 
    {
        //Ensure the currentVideo matches the one passed in. 
        this.setState({videoState: _videoState});
    };


    private triggerBroadcast = () =>
    {   
        // //Check if there is a valid current room, return if not as there is no shared room session to broadcast too
        // if (typeof(this.state.room) === 'undefined' || typeof(this.state.currentRoom.roomID) === 'undefined')
        // {
        //     console.log('BroadcastVideoState called but no room was set for this client');
        //     return;
        // }
  
        // //TODO, check if this merge is ok and if a deep clone is needed instead kinda looks correct
        // //If there is merge the video state with the room state
        // let updatedRoom: Room = this.state.currentRoom;
        // updatedRoom.video = this.state.currentVideo;


        if ( typeof(this.state.roomID) === 'undefined')
        {
            throw 'No roomID set for the client, this should either be generated when the host client creates a room, or passed in from the room picker.'
        } 

        let _roomState: RoomState = {
            id: this.state.roomID,
            name: this.state.videoResource.name,
            videoState: this.state.videoState
        };

        //Todo, check if this is necessary when removing the change on the video picker.
        let _playingState: playingState = _roomState.videoState?.playingState === playingState.playing ? playingState.paused : playingState.playing;
        
        let _updatedRoomState: RoomState =
        {
            id: _roomState.id,
            name: _roomState.name,  
            videoState: {
                videoPosition: _roomState.videoState?.videoPosition!,
                playingState: _playingState
            }
        }
        console.log('Broadcasting video state: ', _updatedRoomState);

        this.sendSocketData(JSON.stringify(_updatedRoomState));
    };

    private receiveRoomState = (data: any) =>
    {
        if (data.toString() === "Resynch")
        {          
                let _roomState: RoomState = {
                    id: this.state.roomID,
                    name: this.state.videoResource.name,
                    videoState: this.state.videoState
                };

                //A new client has joined and this client has been designated the host, the server will grab the room state and if it's appropriate will send it to the new client.
                this.sendSocketData(JSON.stringify(_roomState));
                return; 
        }
       
        let _receivedRoom: RoomState = JSON.parse(data);

        // let _videoResource: VideoResource =
        // {
        //     name: _receivedRoom.name,
        //     path: _receivedRoom.name
        // };

         let _videoState: VideoState = _receivedRoom.videoState!; //Assume this is here for now?!

        // this.setState({videoResource: _videoResource});
        this.setState({videoState: _videoState});
            


        //TODO, in a pause/play event may need to reapply state here. 
        console.log('The room is: ', JSON.stringify(_receivedRoom));

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
    private createRoom = () =>
    {   
        this.setState({connected: true});
        
        //Apply a listener to the socket with a callback
        this.addSocketListener(this.receiveRoomState);

        //Send it through the socket 
        //This is a create room scenario so we wish to generate a roomID.

        //todo, move roomID creation to server. 
        let _roomID = uuidv4();
        let _roomState: RoomState = 
        {
            id: _roomID,
            name: this.state.videoResource.name, //Name of room matches video. 
            videoState: this.state.videoState
        };
        
        this.setState({roomID: _roomID});
        this.sendSocketData(JSON.stringify(_roomState));
       
        return;
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

                    this.setState({videoResource: {} as VideoResource})
                    this.setState({videoState: {} as VideoState })
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
                    this.setState({videoState: {} as VideoState })
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
                selectRoom={this.selectRoom}
            />
        </div>
    );
};


export default App;