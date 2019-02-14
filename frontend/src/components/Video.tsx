
import React from 'react';
import logo from '../logo.svg'
import { VideoPicker } from './VideoPicker';
import { VideoApi } from '../apis/VideoApi';
import { IVideoApi } from '../apis/IVideoApi';
import { VideoPlayer } from './VideoPlayer';
import { VideoItem } from "../../../sharedInterfaces/VideoItem";
import { SubtitlePicker } from './SubtitlePicker';

class Video extends React.Component<any, any> {

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
		let subtitleContent;
		if(this.state.isListAvailable) 
		{
			//Renders the list of available videos once received from the service

			if(this.state.subtitles.length < 1)
			{
				subtitleContent = <div></div>
			}
			else
			{
				subtitleContent =
				<SubtitlePicker
					subtitles={this.state.subtitles}
					onSelectChange={this.handleSubtitleSelection}
				/>
			}


			mainContent =  
			<div className='video'>

				<VideoPlayer
					video={this.state.currentVideo}
				/>
				
				<VideoPicker 
					library={this.state.videoLibrary}
					onSelectChange={this.handleVideoSelection}
				/>
				{subtitleContent}
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
	private handleVideoSelection(selection: any)
	{	
		let parsedVideoLibrary = this.state.videoLibrary;
		let _currentVideo: VideoItem = parsedVideoLibrary.find((video : VideoItem) => video.name === selection);
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

		if(VideoItem.subtitles)
		{
			this.setState({subtitles: VideoItem.subtitles});
		}
		else
		{
			this.setState({subtitles: []});
		}
	}
}

export { Video }