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
import { IVideoState } from './interfaces/IVideoState';
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
    isListAvailable: boolean,
    subtitles: Subtitle[],
    currentSubtitle: string,
    isPaused: boolean,
    isGroupWatching: boolean,
    connected:  boolean,
    pauseState: pauseState,
    appRoutes: appRoutes
};

class App extends React.Component<any, AppState> {

    private videoApi: IVideoApi;

    private currentRoom: Room; 
    constructor(props: any)
    {
        super(props);
        this.state = {
            currentVideo: {} as Video,
            videoLibrary: [],
            isListAvailable: false,
            subtitles: [],
            currentSubtitle: "",
            isPaused: true,
            isGroupWatching: false,
            connected: false,
            pauseState: pauseState.paused,
            appRoutes: appRoutes.homePage
        }

        this.currentRoom = {
        } as Room;


        this.handleVideoSelection = this.handleVideoSelection.bind(this);
        this.handleSubtitleSelection = this.handleSubtitleSelection.bind(this);
        this.handleVideoStateChange = this.handleVideoStateChange.bind(this);
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
                            Connect
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
                            pauseState={this.state.pauseState}
                            connectedState={this.state.connected}
                            updatePlayState={this.updatePlayState}
                        />
                    </div>
                    <div className='toolbar'>
                        <SubtitlePicker
                            subtitles={this.state.subtitles}
                            onSelectChange={this.handleSubtitleSelection}
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
                    <p> Playback is {this.state.pauseState} </p>
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
        this.setState({ currentSubtitle: selection });
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
        this.setState({ isListAvailable: true });
    }

    /**
     * @method setCurrentVideo
     * @description This will set the api path on the current video
     */
    private setCurrentVideo(_video: Video)
    {


        //TODO: We have too many video objects, need to consolidate them into one object and add video position 
        //and maybe a time stamp to that object
        let completeApiPath = this.videoApi.getVideoApiAddress() + _video.path;

        let fullyAddressedVideoItem: Video =
        {
            name: _video.name,
            baseName: _video.baseName,
            path: completeApiPath
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

    private handleVideoStateChange(isPaused: boolean)
    {
        console.log("Function was fired");
    }


    private updatePlayState()
    {


        if (this.state.pauseState === "paused")
        {
                this.setState({ pauseState: pauseState.playing });
            
                if (this.state.connected === true)
                {
                    let newPlayingState: IVideoState =
                    {
                        videoPath: this.state.currentVideo.path,
                        playingState: pauseState.playing,
                        videoPosition: 0
                    };

                    this.currentRoom.videoState = newPlayingState;
        
                    websocket.send(JSON.stringify(this.currentRoom));
                }
        }
        else if (this.state.pauseState === "playing")
        {
                this.setState({ pauseState: pauseState.paused });
            
                if (this.state.connected === true)
                {
                    let newPlayingState: IVideoState =
                    {
                        videoPath: this.state.currentVideo.path,
                        playingState: pauseState.paused,
                        videoPosition: 0
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
            this.setState({ pauseState: event.data });
        };

    };

    private createConnection()
    {   

        this.setState({ connected: true });
        websocket = new WebSocket('ws://localhost:7070');

        websocket.onopen = (event: Event) =>
        {   
            let newPlayingState: IVideoState =
            {
                videoPath: this.state.currentVideo.path,
                playingState: this.state.pauseState,
                videoPosition: 0
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
            this.setState({ pauseState: event.data });
        };

    }
}

export default App