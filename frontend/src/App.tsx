import './App.css';
import React from 'react';
import logo from './logo.svg'
import { VideoPicker } from './components/VideoPicker';
import { VideoApi } from './apis/VideoApi';
import { IVideoApi } from './apis/IVideoApi';
import { VideoPlayer } from './components/VideoPlayer';
import { Video } from "./interfaces/Video";
import { SubtitlePicker } from './components/SubtitlePicker';

let websocket: WebSocket;

class App extends React.Component<any, any> {

	private videoApi: IVideoApi;
	constructor(props: any)
	{
		super(props);
		this.state = {
			currentVideo: "",
			videoLibrary: [],
			isListAvailable: false,
			subtitles: [],
			currentSubtitle: "",
			isPaused: true,
			isGroupWatching: false,
            connected: false,
			pauseState: "paused",
		}
		this.handleVideoSelection = this.handleVideoSelection.bind(this);
		this.handleSubtitleSelection = this.handleSubtitleSelection.bind(this);
		this.handleVideoStateChange = this.handleVideoStateChange.bind(this);
		this.updatePlayState = this.updatePlayState.bind(this);
        this.createConnection = this.createConnection.bind(this);
		this.getVideos = this.getVideos.bind(this);

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
		
		let mainContent;
		if(this.state.isListAvailable) 
		{
			//Renders the list of available videos once received from the service
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

					<VideoPicker 
						library={this.state.videoLibrary}
						onSelectChange={this.handleVideoSelection}
					/>
					
					<SubtitlePicker
						subtitles={this.state.subtitles}
						onSelectChange={this.handleSubtitleSelection}
					/>
					

				</div>
				

			</div>
		}
		else
		{
			//Renders the react logo as a loading screen.
			mainContent = 
			<div>
			
				<img src={logo} className="App-logo" alt="logo" />
				<p> Attempting to retrieve videos, if this takes too long please contact the site owner.</p>
			</div>
		}
        
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
		return (
			<div className="App">
				{mainContent}
                {roomContent}
                <p> Playback is {this.state.pauseState} </p> 
			</div>
		);
	}
	
	/**
	 * @method handleSelection()
	 * @description: Once a video selection occurs this will update local state.
	 * @param event: The HTML event that triggered this function
	 */
	private handleVideoSelection(selection: any)
	{	
		let parsedVideoLibrary = this.state.videoLibrary;
		let _currentVideo: Video = parsedVideoLibrary.find((video : Video) => video.name === selection);
		this.setCurrentVideo(_currentVideo);
	}
	

	/**
	 * @method handleSelection()
	 * @description: Once a video selection occurs this will update local state.
	 * @param event: The HTML event that triggered this function
	 */
	private handleSubtitleSelection(selection: any)
	{	
		this.setState({currentSubtitle: selection});
	}

	/**
	 * @method getVideos()
	 * @description This will call out to an API to retrieve the names and location of available videos.
	 * @private
	 */
	private async getVideos()
	{
		let externalVideos: Array<Video> = await this.videoApi.getVideos();
		this.setState({videoLibrary: externalVideos});
		this.setCurrentVideo(externalVideos[0]);
		this.setState({isListAvailable: true});
	}

	/**
	 * @method setCurrentVideo
	 * @description This will set the api path on the current video
	 */
	private setCurrentVideo(_video: Video)
	{
		let completeApiPath = this.videoApi.getVideoApiAddress() + _video.path;

		let fullyAddressedVideoItem: Video = 
		{
			name: _video.name,
			baseName: _video.baseName,
			path: completeApiPath
		}
		this.setState({currentVideo: fullyAddressedVideoItem});

		if(_video.subtitles)
		{
			this.setState({subtitles: _video.subtitles});
		}
		else
		{
			this.setState({subtitles: []});
		}
	}

	private handleVideoStateChange(isPaused: boolean)
	{
		console.log("Function was fired");
	}

	
    private updatePlayState()
    {  
		if (this.state.connected === true)
		{
			websocket.send("Update");
		}
        
        if (this.state.pauseState === "paused")
        {
            this.setState({ pauseState: "playing" });
        }
        else if (this.state.pauseState === "playing")
        {
            this.setState({ pauseState: "paused" });
        };        
    };

    private createConnection()
    {
        console.log("Inside create connection");
        this.setState({ connected: true });
        websocket = new WebSocket('ws://localhost:7070');

        websocket.onopen = (event: Event) =>
        {
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