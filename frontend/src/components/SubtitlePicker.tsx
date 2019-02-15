import React from 'react';

class SubtitlePicker extends React.Component<any, any> {

    constructor(props: any)
    {
	  super(props);
      this.handleSelection = this.handleSelection.bind(this);
    }

    render() 
    {   
        const subtitles : Array<string> = this.props.subtitles;
        let subtitleContent;
        if(this.state.subtitles.length < 1)
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
                        return <option key={subtitle}>{subtitle}</option>;
                    })}
                </select>	
            </div>
        }
        return (
            {subtitleContent}
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

export { SubtitlePicker }