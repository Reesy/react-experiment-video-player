import React from 'react';
import { Subtitle } from '../interfaces/Subtitle';


interface SubtitlePickerProps
{
    subtitles: Array<Subtitle>
    handleSubtitleSelection: (subtitle: Subtitle) => void;
}
class SubtitlePicker extends React.Component<SubtitlePickerProps, any> {

    constructor(props: any)
    {
	  super(props);
      this.handleSelection = this.handleSelection.bind(this);
    }

    render() 
    {   
        const subtitles : Array<Subtitle> = this.props.subtitles;
        let subtitleContent;
        if(this.props.subtitles.length < 1)
        {
            subtitleContent = 
            <div></div>
        }
        else
        {
            subtitleContent = 
            <div>           
                <select name="SubtitleChoice" onChange={this.handleSelection}>
                    {subtitles.map((subtitle: any) => 
                    {
                        return <option key={subtitle.name}>{subtitle.language}</option>;
                    })}
                </select>	
            </div>
        }
        return (
            <div>
               {subtitleContent}
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
		this.props.handleSubtitleSelection(event.target.value);
    }
    
 
}

export { SubtitlePicker }