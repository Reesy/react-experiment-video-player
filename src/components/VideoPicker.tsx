
import React from 'react';
import logo from '../logo.svg'
class VideoPicker extends React.Component<any, any> {

    constructor(props: any)
    {
	  super(props);
	  this.state = {
        videoTitle: "No video picked",
        videoOptions: ["None yet received"],
        isListAvailable: false 
	 }
      this.handleSelection = this.handleSelection.bind(this);
      this.getVideos = this.getVideos.bind(this);
    }

    componentWillMount()
    {
       //Artificial timeout to represent server communication
       setTimeout(() => this.getVideos(), 5000);
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
                <div>
                    <select name="VideoChoice">
                        {this.state.videoOptions.map((x: any) => 
                        {
                            return <option onClick={this.handleSelection}>{x}</option>;
                        })}
                    </select>	
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
	private handleSelection(event: any)
	{
		this.setState({videoTitle: event.target.value});
    }
    
    /**
     * @method getVideos()
     * @description This will call out to an API to retrieve the names and location of available videos.
     * @private
     */
	private getVideos()
	{
        let localVideoOptions = ['The Matrix', 'The Matrix 2', 'The Matrix 3'];
        this.setState({videoOptions: localVideoOptions})
        this.setState({isListAvailable: true})
	}
}

export { VideoPicker }