import React from 'react';
import { Subtitle } from '../interfaces/Subtitle';


interface SubtitlePickerProps
{
    subtitles: Array<Subtitle>
    selectSubtitle: (subtitle: Subtitle) => void;
}

interface SubtitlePickerState
{
    // currentSubtitle: Subtitle;
}
class SubtitlePicker extends React.Component<SubtitlePickerProps, SubtitlePickerState> {

    constructor(props: SubtitlePickerProps)
    {
	  super(props);
      this.selectSubtitle = this.selectSubtitle.bind(this);
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
                <select name="SubtitleChoice" onChange={this.selectSubtitle}>
                    {subtitles.map((subtitle: Subtitle) => 
                    {
                        return <option key={subtitle.name}>{subtitle.language}</option>;
                    })}
                </select>	
                <p> There are {this.props.subtitles.length} subtitles </p>
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
	private selectSubtitle(event: any)
	{
        let selectedSubtitle: Subtitle = this.props.subtitles.find((subtitle: Subtitle) => {
            return subtitle.language === event.target.value;
        })!;
        
        if (typeof(selectedSubtitle) === 'undefined')
        {
            throw Error ("Subtitle not found");
        };

		this.props.selectSubtitle(selectedSubtitle);
    }
    
 
}

export { SubtitlePicker }