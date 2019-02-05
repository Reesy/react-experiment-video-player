
import React from 'react';
import logo from '../logo.svg'
import { VideoPicker } from './VideoPicker';
import { VideoApi } from '../apis/VideoApi';
import { IVideoApi } from '../apis/IVideoApi';
import { VideoPlayer } from './VideoPlayer';

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
			<div>
				<div>		 
					This is the current video: {this.state.currentVideo.name} 
				</div>

				<VideoPicker 
					library={this.state.videoLibrary}
					onSelectChange={this.handleSelection}
				/>

				<VideoPlayer
					video={this.state.currentVideo}
				/>
				
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
		let _currentVideo = parsedVideoLibrary.find((video : any) => video.name === selection);
		this.setState({currentVideo: _currentVideo});
	}
	
	/**
	 * @method getVideos()
	 * @description This will call out to an API to retrieve the names and location of available videos.
	 * @private
	 */
	private async getVideos()
	{
		let externalVideos: any = await this.videoApi.getVideos();
		this.setState({videoLibrary: externalVideos})
		this.setState({currentVideo: externalVideos[0]})
		this.setState({isListAvailable: true})
	}
}

export { Video }