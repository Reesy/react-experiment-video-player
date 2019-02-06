
import React from 'react';

class VideoPlayer extends React.Component<any, any> {

    constructor(props: any)
    {
	  super(props);
    }
    render() 
    {
      return (
		  <div> 
			  <video width="640" height="360" controls src={this.fullResourcePath(this.props.video.resourcePath)}>
			  </video> 
		  </div>
      );
	}

	private fullResourcePath(serverResource: string)
	{
		let fullPath = "http://localhost:3000" + serverResource;
		console.log("Full path is: " + fullPath);
		return fullPath
	}
	
}

export { VideoPlayer }