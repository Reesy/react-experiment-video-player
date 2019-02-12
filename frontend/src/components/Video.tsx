
import React from 'react';
import logo from '../logo.svg'
import { VideoPicker } from './VideoPicker';
import { VideoApi } from '../apis/VideoApi';
import { IVideoApi } from '../apis/IVideoApi';
import { VideoPlayer } from './VideoPlayer';
import { VideoItem } from "../../../sharedInterfaces/VideoItem";

class Video extends React.Component<any, any> {

	private videoApi: IVideoApi;
	constructor(props: any)
	{
		super(props);
		this.state = {
			currentVideo: "",
			videoLibrary: [],
			isListAvailable: false 
		}
		this.handleSelection = this.handleSelection.bind(this);
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
			<div className='video'>

				<VideoPlayer
					video={this.state.currentVideo}
				/>
				
				<VideoPicker 
					library={this.state.videoLibrary}
					onSelectChange={this.handleSelection}
				/>

				<div>		 
					This is the current video: {this.state.currentVideo.name} 
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
			<div>
				{mainContent}
			</div>
		);
	}
	
	/**
	 * @method handleSelection()
	 * @description: Once a video selection occurs this will update local state.
	 * @param event: The HTML event that triggered this function
	 */
	private handleSelection(selection: any)
	{	
		let parsedVideoLibrary = this.state.videoLibrary;
		let _currentVideo: VideoItem = parsedVideoLibrary.find((video : VideoItem) => video.name === selection);
		this.setCurrentVideo(_currentVideo);
	}
	
	/**
	 * @method getVideos()
	 * @description This will call out to an API to retrieve the names and location of available videos.
	 * @private
	 */
	private async getVideos()
	{
		let externalVideos: Array<VideoItem> = await this.videoApi.getVideos();
		this.setState({videoLibrary: externalVideos});
		this.setCurrentVideo(externalVideos[0]);
		this.setState({isListAvailable: true});
	}

	/**
	 * @method setCurrentVideo
	 * @description This will set the api path on the current video
	 */
	private setCurrentVideo(VideoItem: VideoItem)
	{
		let completeApiPath = this.videoApi.getVideoApiAddress() + VideoItem.resourceLocation;
		
		let fullyAddressedVideoItem: VideoItem = 
		{
			name: VideoItem.name,
			resourceLocation: completeApiPath
		}
		this.setState({currentVideo: fullyAddressedVideoItem});
	}
}

export { Video }