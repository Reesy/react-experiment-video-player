
import React from 'react';
import logo from '../logo.svg'
import { VideoPicker } from './VideoPicker';
import { VideoApi } from '../apis/VideoApi';
import { IVideoApi } from '../apis/IVideoApi';

class Video extends React.Component<any, any> {

	private videoApi: IVideoApi;
	constructor(props: any)
	{
		super(props);
		this.state = {
			videoTitle: "No video picked",
			videoOptions: [""],
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
					This is the current video: {this.state.videoTitle} 
				</div>

				<VideoPicker 
					videos={this.state.videoOptions}
					onSelectChange={this.handleSelection}
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
	private handleSelection(videoTitle: string)
	{
		this.setState({videoTitle: videoTitle});
	}
	
	/**
	 * @method getVideos()
	 * @description This will call out to an API to retrieve the names and location of available videos.
	 * @private
	 */
	private async getVideos()
	{
		console.log("Calling get videos");
		let localVideoOptions = ['The Matrix', 'The Matrix 2', 'The Matrix 3'];
		let externalVideos = await this.videoApi.getVideos();
		console.log("The thing returned");
		this.setState({videoOptions: externalVideos})
		this.setState({isListAvailable: true})
	}
}

export { Video }