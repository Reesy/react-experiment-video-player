
import React from 'react';
import { VideoItem } from '../../../sharedInterfaces/VideoItem';

class VideoPicker extends React.Component<any, any> {

    constructor(props: any)
    {
	  super(props);
      this.handleSelection = this.handleSelection.bind(this);
    }

    render() 
    {   
        const videos : Array<VideoItem> = this.props.library;
        return (
            <div>
                
                <select name="VideoChoice" onChange={this.handleSelection}>
                    {videos.map((x: any) => 
                    {
                        return <option key={x.name}>{x.name}</option>;
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
        console.log('selection occured');
		this.props.onSelectChange(event.target.value);
    }
    
 
}

export { VideoPicker }