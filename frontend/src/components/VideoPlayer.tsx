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
          <video width="640" height="360" controls src={this.props.video.path}>
          </video> 
        </div>
      );
	}	
}

export { VideoPlayer }