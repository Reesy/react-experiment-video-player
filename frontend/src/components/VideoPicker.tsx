import * as React from "react";
import { Layout, Layouts, Responsive as ResponsiveGridLayout, WidthProvider } from "react-grid-layout";
import { IVideoApi } from "../apis/IVideoApi";
import { Video } from "../interfaces/Video";
import '../styles/VideoPicker.css';

const ResponsiveReactGridLayout = WidthProvider(ResponsiveGridLayout);

interface VideoPickerProps 
{
    cols: {};
    onSelectChange: (event: any) => void;
    library: Video[];
    videoApi: IVideoApi;
}

interface VideoPickerState 
{
    layouts: Layouts;
    thumbnailPath: string
}

export default class VideoPicker extends React.Component<VideoPickerProps, VideoPickerState>
{
    static itemCount: number = 164;



    static defaultProps: any = {
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
    };

    static getDerivedStateFromProps(nextProps: VideoPickerProps, prevState: VideoPickerState)
    {
        if (nextProps.library.length !== prevState.layouts["lg"].length)
        {

            let itemCount = nextProps.library.length;
            const layouts: Layouts = VideoPicker.createLayouts(itemCount);

            let newState: VideoPickerState = {
                layouts: layouts,
                thumbnailPath: prevState.thumbnailPath //this is persisted, will likely change this to dynamically obtain each thumbnail in the future. 
            };

            return newState;
        };
        return null;
    }

    componentDidUpdate(prevProps: VideoPickerProps, prevState: VideoPickerState)
    {
        if (prevProps.library !== this.props.library)
        {
            let itemCount = this.props.library.length;
            const layouts = VideoPicker.createLayouts(itemCount);

            this.setState({
                layouts: layouts
            });
        };
    }

    constructor(_props: any)
    {
        super(_props);
        this.handleSelection = this.handleSelection.bind(this);

        const layouts: Layouts = {
            lg: [],
            md: [],
            sm: [],
            xs: [],
            xxs: []
        };
        let thumbnailPath = this.props.videoApi.getThumbnailApiAddress();


        this.state = {
            layouts: layouts,
            thumbnailPath: thumbnailPath
        };
    }

    /**
     * 
     * @param _cols Number of columns in the grid
     * @param _elementCount Number of items in the grid
     * @returns An array representing the layout of the grid for a particular column size
     */
    private static createLayout(_cols: number, _elementCount: number): Layout[] 
    {

        let layouts: Layout[] = [];
        const itemWidth = 1;
        const itemHeight = 1;

        //Using map may be cleaner, but I think this is more readable for this example
        for (let element = 1; element <= _elementCount; element++) 
        {
            const horizontalPosition = (element - 1) % _cols;
            let layout: Layout = {
                i: element.toString(),
                x: horizontalPosition === 0 ? 0 : horizontalPosition * itemWidth,
                y: Math.floor((element - 1) / _cols),
                w: itemWidth,
                h: itemHeight,
                static: true
            };
            layouts.push(layout);
        };

        return layouts;

    };

    /**
     * 
     * @returns A 'Layouts' object representing the current state of the grid, for every column size
     */
    private static createLayouts(_elementCount: number): Layouts
    {
        
        const lgLayout = this.createLayout(12, _elementCount);
        const mdLayout = this.createLayout(10, _elementCount);
        const smLayout = this.createLayout(6, _elementCount);
        const xsLayout = this.createLayout(4, _elementCount);
        const xxsLayout = this.createLayout(2, _elementCount);
        const layouts: Layouts = {
            lg: lgLayout,
            md: mdLayout,
            sm: smLayout,
            xs: xsLayout,
            xxs: xxsLayout
        };

        return layouts;
    };
    /**
     * 
     * @param _elementCount The number of items that should be populated on the screen/ Ideally this would be passed in or data grabbed from an API then rendered accordingly.
     * @returns 
     */
    private createDOM(_elementCount: number): any
    {
        if (typeof (this.props.library) === "undefined")
        {
            return;
        }
        let elements: JSX.Element[] = [];

        let thumbnail : string = "no_thumbnail.jpg";
        
        this.props.library.forEach((video: Video, index: number) => 
        {
            if (video.thumbnail !== null && video.thumbnail !== "")
            {
                thumbnail = this.state.thumbnailPath + "/" + video.thumbnail;
            }
            let offsetIndex = index + 1; //This is to offset the index to match the react-grid-layout's layout which starts at 1.
            let elementDOM: JSX.Element =
                <div className="imageParent" key={offsetIndex}>
                    <img id={offsetIndex.toString()} 
                          className="image" 
                          src={thumbnail}
                          alt={video.name} 
                          onMouseDown={e => { 
                            this.handleSelection(video);
                          }} />
                </div>
            elements.push(elementDOM);
        });

        return elements;
    };

    /**
     * @method handleSelection()
     * @description: Once a video selection occurs this will update local state.
     * @param _selectedVideo The selected video
     */
    private handleSelection(_selectedVideo: Video)
    {
        this.props.onSelectChange(_selectedVideo);
    }

    render()
    {


        if (typeof (this.props.library) === "undefined" || this.props.library.length === 0 || typeof (this.state.layouts) === "undefined")
        {

            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            );

        }
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