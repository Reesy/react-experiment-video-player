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

        let _roomID = uuidv4();

        this.state = {
            page: page.home,
            videoResource: {} as VideoResource,
            videoState: { 
                playingState: playingState.paused,
                videoPosition: 0
            },
            roomResource: {} as RoomResource,
            roomID: _roomID,
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
        console.log('xXxXXXXXXXXXXXXFAFAFA --------- SELECT ROOM CALLED ---------- xXxXXXXXXXXXXXX');
       // console.log('The room is: ', JSON.stringify(room));
        // this.selectVideo(room.video);
        // this.setState({currentRoom: room}); //Maybe this isn't required? 


        //We want to listen for a response from the server
        //but we do NOT wish to update the video state, another listener will be added for that. 
        this.addSocketListener(this.receiveJoinConfirmation);
      //  this.SocketAPI.addListener(this.joinListener);

        //send room to server, it should fetch the state from the host and rebroadcast it, to here aswell. 
        //Instead of sending the entire state, maybe we just need to send the roomID.
       

        this.sendSocketData(JSON.stringify(_roomResource));

        this.setState({connected: true});
        this.setState({page: page.video});
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
       // this.sendSocketData("Resynch");

       //TODO TODO TODO TODO // This could be a problem
        

    
        // change this 
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
        //'{"id":"6e7042ae-f2d8-426d-ba47-af6516cc948f","name":"Hairspray.mp4","videoState":{"videoPosition":6.97519,"playingState":"paused"}}'
      
        // this.sendSocketData("confirm");
        // console.log('The room is: ', data);
        // this.selectVideo(_receivedRoom.video);

    };


    private updateVideoState(_videoState: VideoState): void 
    {
        //Ensure the currentVideo matches the one passed in. 
        this.setState({videoState: _videoState});
    };


    private triggerBroadcast = () =>
    {   

        console.log('Broadcasting video state: ', this.state.videoState);



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



        // //Stringify and Send it through the socket 


        // this.sendSocketData(JSON.stringify(updatedRoom));
    };


    // private receiveRoomState = (data: any) =>
    // {
    //     throw "This needs to be reimplemented"
    // }
    //This is added on create room, or after a response is returned from the server after room selection.
    private receiveRoomState = (data: any) =>
    {

        console.log(' --- Receive room state, this will blindly merge the video state. --- ');
        
        if (data.toString() === "Resynch")
        {
                //A new client has joined and this client has been designated the host, the server will grab the room state and if it's appropriate will send it to the new client.
                console.log('>> Resynch event called, room state from is mostly garbage, not applying new room state but sending current state back to the server for a rebroadcast. ')
                this.sendSocketData(JSON.stringify(this.createRoomState()));
                return; 
        }
       
       
        let _receivedRoom: RoomState = JSON.parse(data);

        
        // if (typeof(_receivedRoom.resynch) !== 'undefined' && _receivedRoom.resynch === true)
        // {
        //     //A new client has joined and this client has been designated the host, the server will grab the room state and if it's appropriate will send it to the new client.
        //     console.log('>> Resynch event called, room state from is mostly garbage, not applying new room state but sending current state back to the server for a rebroadcast. ')
        //     this.sendSocketData(JSON.stringify(this.state.currentRoom));
        //     return; 
        // }
        
        console.log('The room is: ', JSON.stringify(_receivedRoom));

     //   this.roo
        //this.selectVideo(_receivedRoom.video);

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

        let sockerParams: RoomState = this.createRoomState();

        this.sendSocketData(JSON.stringify(sockerParams));
       
        return;
    };



    private createRoomState(): RoomState
    {
 
        let _socketParams: RoomState = {
            id: this.state.roomID,
            name: this.state.videoResource.name,
            videoState: this.state.videoState
        };

        return _socketParams;
    };



    // private createRoom = (_videoState: VideoState) =>
    // {   
   
    //     //Generate an initial room object here using the video object 
    //     this.setState({videoState: _videoState}) // TODO check if correct

        

    //     let randomNumber = uuidv4();
    //     let newRoom: Room = {
    //         roomID: randomNumber.toString(),
    //         video: this.state.currentVideo
    //     };

    //     //Apply room state, this will only exist in two scenarios.
    //     //1. The user has selected a video and is now creating a room.
    //     //2. The user has selected a room and is now joining a room.
    //     this.setState({currentRoom: newRoom});
        
    //     //Apply a listener to the socket with a callback
    //     this.addSocketListener(this.receiveRoomState);

    //     //Send it through the socket 
    //     this.sendSocketData(JSON.stringify(newRoom));
    // };


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