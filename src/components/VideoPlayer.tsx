
import React from 'react';

class VideoPlayer extends React.Component<any, any> {

    constructor(props: any)
    {
	  super(props);
	  this.state = {videoTitle: "No video picked" }
	  this.handleSelection = this.handleSelection.bind(this);
    }
    render() 
    {
      return (

		<div>
			<div>		 
				This is the current video: {this.state.videoTitle} 
		  	</div>

			<div>
				<select name="VideoChoice">
					<option onClick={this.handleSelection}>The Matrix</option>;
					<option onClick={this.handleSelection}>The Matrix 2</option>;
					<option onClick={this.handleSelection}>The Matrix 3</option>;
				</select>	
			</div>
		</div>
      );
	}
	
	private handleSelection(event: any)
	{
		this.setState({videoTitle: event.target.value});
	}
}

export { VideoPlayer }