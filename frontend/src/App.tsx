import './App.css';
import React from 'react';
import  VideoPicker  from './components/VideoPicker';
import { VideoApi } from './apis/VideoApi';
import { IVideoApi } from './apis/IVideoApi';
import { VideoPlayer } from './components/VideoPlayer';
import { Video } from "./interfaces/Video";
import { Subtitle } from './interfaces/Subtitle';
import { SubtitlePicker } from './components/SubtitlePicker';
import  RoomPicker  from './components/RoomPicker';
import { Room } from './interfaces/Room';
import { v4 as uuidv4 } from 'uuid';

let websocket: WebSocket;

// temporary, will use react-router for this
enum appRoutes
{
    homePage,
    videoPage,
    roomPage
};

export enum pauseState
{
    paused = "paused",
    playing = "playing"
};

interface AppState
{
    currentVideo: Video,
    videoLibrary: Video[], //this might be wrong
    subtitles: Subtitle[],
    connected:  boolean,
    appRoutes: appRoutes,
    videoPosition: number
};

class App extends React.Component<any, AppState> {

    private videoApi: IVideoApi;

    private currentRoom: Room; 
    
    constructor(props: any)
    {
        super(props);
        this.state = {
            currentVideo: {
                playingState: pauseState.paused,
            } as Video,
            videoLibrary: [],
            subtitles: [],
            connected: false,
            appRoutes: appRoutes.homePage,
            videoPosition: 0
        }

        this.currentRoom = {
        } as Room;


        this.handleVideoSelection = this.handleVideoSelection.bind(this);
        this.handleSubtitleSelection = this.handleSubtitleSelection.bind(this);
        this.updatePlayState = this.updatePlayState.bind(this);
        this.createConnection = this.createConnection.bind(this);
        this.getVideos = this.getVideos.bind(this);
        this.joinRoom = this.joinRoom.bind(this);

        this.videoApi = new VideoApi();

    }

    destructor()
    {
        websocket.close();
    };

    componentWillMount()
    {
        this.getVideos();
    }
    render()
    {
        let roomContent;
        if (this.state.connected === true)
        {
            roomContent =
                <div>
                    <p>
                        <button
                            className="Main-button"
                            onClick={this.updatePlayState}>
                            Send pause update
                        </button>
                    </p>

                </div>
        }
        else
        {
            roomContent =
                <div>
                    <p>
                        <button
                            onClick={this.createConnection}>
                            Create Room
                        </button>
                    </p>
                </div>
        }

        let mainContent;
        if (this.state.appRoutes === appRoutes.homePage)
        {
            mainContent =
                <div>
                    <VideoPicker
                        videoApi={this.videoApi}
                        library={this.state.videoLibrary}
                        onSelectChange={this.handleVideoSelection}
                    />
                </div>

        }
        else if(this.state.appRoutes === appRoutes.roomPage)
        {
            mainContent = 
            <div>
                <RoomPicker
                    videoApi={this.videoApi}
                    roomSelection={this.joinRoom}
                />
            </div>
        }
        else
        {
            mainContent =
                <div>
                    <div className="videoPlayer">
                        <VideoPlayer
                            video={this.state.currentVideo}
                           // pauseState={this.state.pauseState}
                            updatePlayState={this.updatePlayState}
                        />
                    </div>
                    <div className='toolbar'>
                        <SubtitlePicker
                            subtitles={this.state.subtitles}
                            handleSubtitleSelection={this.handleSubtitleSelection}
                        />
                    </div>
                    {roomContent}
                </div>
        }

        return (
            <div className="App">
                <header>
                    <button
                        onClick={() =>
                        {
                            this.setState({
                                appRoutes: appRoutes.homePage

                            })
                        }}>
                        Home
                    </button>
                    <button
                        onClick={() =>
                        {
                            this.setState({
                                appRoutes: appRoutes.roomPage
                            })
                        }}>
                        Rooms
                    </button>
                </header>
                
                {mainContent}
                <div>
                    <p> Playback is {this.state.currentVideo.playingState} </p>
                </div>
            </div>
        );
    }

    /**
     * @method handleSelection()
     * @description: Once a video selection occurs this will update local state.
     * @param event: The HTML event that triggered this function
     */
    private handleVideoSelection(selection: Video)
    {
        this.setState({ appRoutes: appRoutes.videoPage });
        this.setCurrentVideo(selection);
    }


    /**
     * @method handleSelection()
     * @description: Once a video selection occurs this will update local state.
     * @param event: The HTML event that triggered this function
     */
    private handleSubtitleSelection(selection: any)
    {
        console.log('Maybe this will do something');
      //  this.setState({ currentSubtitle: selection });
    }

    /**
     * @method getVideos()
     * @description This will call out to an API to retrieve the names and location of available videos.
     * @private
     */
    private async getVideos()
    {
        let externalVideos: Array<Video> = await this.videoApi.getVideos();
        this.setState({ videoLibrary: externalVideos });
        this.setCurrentVideo(externalVideos[0]);
    }

    /**
     * @method setCurrentVideo
     * @description This will set the api path on the current video
     */
    private setCurrentVideo(_video: Video)
    {

        //TODO, maybe a time stamp on the object
        let completeApiPath = this.videoApi.getVideoApiAddress() + _video.path;

        if (typeof(_video.playingState) === 'undefined')
        {
            _video.playingState = pauseState.paused;
        }

        let fullyAddressedVideoItem: Video =
        {
            name: _video.name,
            baseName: _video.baseName,
            path: completeApiPath,
            playingState: _video.playingState,
            videoPosition: _video.videoPosition,
        }
        this.setState({ currentVideo: fullyAddressedVideoItem });

        if (_video.subtitles)
        {
            this.setState({ subtitles: _video.subtitles });
        }
        else
        {
            this.setState({ subtitles: [] });
        }
    }

    private updatePlayState()
    {


        if (this.state.currentVideo.playingState === "paused")
        {
                this.setState({ currentVideo: { playingState: "playing" } as Video }); // Probably a BUG here TODO
      
            
                if (this.state.connected === true)
                {
                    let newPlayingState: Video =
                    {
                        path: this.state.currentVideo.path,
                        playingState: this.state.currentVideo.playingState,
                        videoPosition: this.state.currentVideo.videoPosition,
                        name: this.state.currentVideo.name,
                        baseName: this.state.currentVideo.baseName,
                    };

                    this.currentRoom.videoState = newPlayingState;
        
                    websocket.send(JSON.stringify(this.currentRoom));
                }
        }
        else if (this.state.currentVideo.playingState === "playing")
        {   
                this.setState({ currentVideo: { playingState: "paused" } as Video }); // Probably a BUG here TODO
                
                if (this.state.connected === true)
                {
                    let newPlayingState: Video =
                    {
                        path: this.state.currentVideo.path,
                        playingState: this.state.currentVideo.playingState,
                        videoPosition: this.state.currentVideo.videoPosition,
                        name: this.state.currentVideo.name,
                        baseName: this.state.currentVideo.baseName
                    };

                    this.currentRoom.videoState = newPlayingState;
        
                    websocket.send(JSON.stringify(this.currentRoom));
        
                };
        };
    };

    //Todo: Extract socket code out of app entirely, there's some duplication here.
    private joinRoom(_room: Room)
    {
        //Connect to websocket
        this.setState({ connected: true });
        websocket = new WebSocket('ws://localhost:7070');

        websocket.onopen = (event: Event) =>
        {   

            this.currentRoom = _room;


            //set current video here, by finding the video in the library

            let _currentVideo : Video = this.state.videoLibrary.find(x => x.name === _room.roomName)!;


            if (typeof(_currentVideo) === "undefined")
            {
                throw new Error("Video not found, Library may have updated between page load and room join");
            };

            this.setCurrentVideo(_currentVideo);

            websocket.send(JSON.stringify(_room));
            this.setState({ appRoutes: appRoutes.videoPage });
            console.log('Joined room, websocket open.');
        };

        websocket.onclose = (event: CloseEvent) =>
        {
            console.log('Websocket closed');
        };

        websocket.onmessage = (event: MessageEvent) =>
        {
            console.log('Recieved: ', event.data);

            this.setState({ currentVideo: { playingState: event.data } as Video }); //This probably needs work too TODO
            // this.setState()
            // this.setState({ pauseState: event.data });
        };

    };

    private createConnection()
    {   

        this.setState({ connected: true });
        websocket = new WebSocket('ws://localhost:7070');

        websocket.onopen = (event: Event) =>
        {   
            let newPlayingState: Video =
            {
                path: this.state.currentVideo.path,
                playingState: this.state.currentVideo.playingState,
                videoPosition: this.state.videoPosition,
                name: this.state.currentVideo.name,
                baseName: this.state.currentVideo.baseName
            };
    
            let randomNumber = uuidv4();
            let newRoom: Room = {
                roomID: randomNumber.toString(),
                roomName: this.state.currentVideo.name,
                videoState: newPlayingState,
            }
            this.currentRoom = newRoom;
            websocket.send(JSON.stringify(newRoom));
            console.log('Websocket opened');

        };

        websocket.onclose = (event: CloseEvent) =>
        {
            console.log('Websocket closed');
        };

        websocket.onmessage = (event: MessageEvent) =>
        {
            console.log('Recieved: ', event.data);
            this.setState({ currentVideo: { playingState: event.data } as Video }); //This probably needs work too TODO
          //  this.setState({ pauseState: event.data });
        };

    }
}

export default App