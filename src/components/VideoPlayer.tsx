
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
			  <p> PlaceHolder </p>
		  </div>
      );
	}
	
	private handleSelection(event: any)
	{
		this.setState({videoTitle: event.target.value});
	}
}

export { VideoPlayer }