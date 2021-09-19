import './App.css';
import React from 'react';
import logo from './logo.svg'
import { VideoPicker } from './components/VideoPicker';
import { VideoApi } from './apis/VideoApi';
import { IVideoApi } from './apis/IVideoApi';
import { VideoPlayer } from './components/VideoPlayer';
import { Video } from "./interfaces/Video";
import { SubtitlePicker } from './components/SubtitlePicker';

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
			currentSubtitle: ""
		}
		this.handleVideoSelection = this.handleVideoSelection.bind(this);
		this.handleSubtitleSelection = this.handleSubtitleSelection.bind(this);
		this.getVideos = this.getVideos.bind(this);

		this.videoApi = new VideoApi();

	}

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

					<div>		 
						This is the current video: {this.state.currentVideo.name} 
					</div>
				
				</div>
				

			</div>
		}
		else
		{
			//Renders the react logo as a loading screen.
			mainContent = 
			<img src={logo} className="App-logo" alt="logo" />
		}

		return (
			<div className="App">
				{mainContent}
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
}

export default App