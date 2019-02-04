
import React from 'react';
import { VideoItem } from '../apis/VideoItem';

class VideoPicker extends React.Component<any, any> {

    constructor(props: any)
    {
	  super(props);
      this.handleSelection = this.handleSelection.bind(this);
    }

    render() 
    {   
        const videos : Array<VideoItem> = JSON.parse(this.props.library);
        return (
            <div>
                
                <select name="VideoChoice">
                    {videos.map((x: any) => 
                    {
                        return <option onClick={this.handleSelection}>{x.name}</option>;
                    })}
                </select>	
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
		this.props.onSelectChange(event.target.value);
    }
    
 
}

export { VideoPicker }