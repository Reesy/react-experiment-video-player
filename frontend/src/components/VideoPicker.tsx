import * as React from "react";
import { Layout, Layouts, Responsive as ResponsiveGridLayout, WidthProvider } from "react-grid-layout";
import { Video } from "../interfaces/Video";
import '../styles/VideoPicker.css';

const ResponsiveReactGridLayout = WidthProvider(ResponsiveGridLayout);

export interface Props 
{
    cols: {};
    onSelectChange: (event: any) => void;
    library: Video[];
}

interface State 
{
    layouts: Layouts;
}

export default class VideoPicker extends React.Component<Props, State>
{
    static itemCount : number = 200;

    static defaultProps: any = {
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
    };

    constructor(_props: any)
    {
        super(_props);
        this.handleSelection = this.handleSelection.bind(this);
        const lgLayout = this.createLayouts(12, VideoPicker.itemCount);
        const mdLayout = this.createLayouts(10, VideoPicker.itemCount);
        const smLayout = this.createLayouts(6, VideoPicker.itemCount);
        const xsLayout = this.createLayouts(4, VideoPicker.itemCount);
        const xxsLayout = this.createLayouts(2, VideoPicker.itemCount);
        const layouts: Layouts = { 
            lg: lgLayout,
            md: mdLayout,
            sm: smLayout,
            xs: xsLayout,
            xxs: xxsLayout
        };

        this.state = {
            layouts: layouts
        };

    }
    
    /**
     * 
     * @param _cols Number of columns in the grid
     * @param _elementCount Number of items in the grid
     * @returns An array representing the layout of the grid
     */
    private createLayouts(_cols: number, _elementCount: number): Layout[] 
    {
       
        let layouts: Layout[] = [];
        const itemWidth = 1;
        const itemHeight = 1;

        //Using map may be cleaner, but I think this is more readable for this example
        for (let element = 1; element <= _elementCount; element++) 
        {
            const horizontalPosition = (element - 1) % _cols;
            let layout : Layout =  { 
                        i: element.toString(), 
                        x: horizontalPosition === 0 ? 0 : horizontalPosition * itemWidth, 
                        y: Math.floor((element - 1) / _cols), 
                        w: itemWidth, 
                        h: itemHeight, 
                        static: true };
            layouts.push(layout);
        };

        return layouts;

    };

    /**
     * 
     * @param _elementCount The number of items that should be populated on the screen/ Ideally this would be passed in or data grabbed from an API then rendered accordingly.
     * @returns 
     */
    private createDOM (_elementCount: number): any
    {
        
        if (typeof(this.props.library) === "undefined")
        {
            return;
        }
        let elements: JSX.Element[] = [];
        
        this.props.library.forEach((video: Video, index: number) => 
        {
            let offsetIndex = index + 1; //This is to offset the index to match the react-grid-layout's layout which starts at 1.
            let elementDOM: JSX.Element = 
            <div className="imageParent" key={offsetIndex}>
                <img id={offsetIndex.toString()} className="image" src="https://xl.movieposterdb.com/13_06/2013/2194499/xl_2194499_c0435606.jpg?v=2021-10-22%2017:59:47" alt="About Time" onMouseDown={ e => {window.alert( e.currentTarget.id) }} />
            </div>
            elements.push(elementDOM);
        });


        
        // for (let element = 1; element <= _elementCount; element++) 
        // {
        //     let elementDOM: JSX.Element = 
        //     <div className="imageParent" key={element}>
        //         <img id = "About time movie 1" className="image" src="https://xl.movieposterdb.com/13_06/2013/2194499/xl_2194499_c0435606.jpg?v=2021-10-22%2017:59:47" alt="About Time" onMouseDown={ e => {window.alert( e.currentTarget.id) }} />
        //     </div>
        //     elements.push(elementDOM);
        // }
        console.log(elements)
        return elements;
    };

    /**
     * @method handleSelection()
     * @description: Once a video selection occurs this will update local state.
     * @param event: The HTML event that triggered this function
     */
	private handleSelection(event: any)
	{
		this.props.onSelectChange(event.target.value);

        //{window.alert( e.currentTarget.id)
    }
    
    render() {
        return (
            <div>
                <ResponsiveReactGridLayout
                    className="layout"
                    layouts={this.state.layouts}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    isDraggable={false}
                    width={1200}
                    compactType={"horizontal"}
                >
                    {this.createDOM(VideoPicker.itemCount)}
                </ResponsiveReactGridLayout>
            </div>
        );
    }
}



// import React from 'react';
// import { Video } from '../interfaces/Video';

// class VideoPicker extends React.Component<any, any> {

//     constructor(props: any)
//     {
// 	  super(props);
//       this.handleSelection = this.handleSelection.bind(this);
//     }

//     render() 
//     {   
//         const videos : Array<Video> = this.props.library;
//         return (
//             <div>
                
//                 <select name="VideoChoice" onChange={this.handleSelection}>
//                     {videos.map((x: any) => 
//                     {
//                         return <option key={x.name}>{x.name}</option>;
//                     })}
//                 </select>	
//              </div>
//         );
// 	}
    
//     /**
//      * @method handleSelection()
//      * @description: Once a video selection occurs this will update local state.
//      * @param event: The HTML event that triggered this function
//      */
// 	private handleSelection(event: any)
// 	{
// 		this.props.onSelectChange(event.target.value);
//     }
    
 
// }

// export { VideoPicker }
