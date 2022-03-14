import * as React from "react";
import { Layout, Layouts, Responsive as ResponsiveGridLayout, WidthProvider } from "react-grid-layout";
import { IVideoApi } from "../apis/IVideoApi";
import { VideoApi } from "../apis/VideoApi";
import { VideoResource } from "../interfaces/VideoResource";
import '../styles/VideoPicker.css';

const ResponsiveReactGridLayout = WidthProvider(ResponsiveGridLayout);

interface VideoPickerProps 
{
    cols: {};
    selectVideo: (video: VideoResource) => void;
}

interface VideoPickerState 
{
    library: VideoResource[];
    layouts: Layouts;
    thumbnailPath: string
}

export default class VideoPicker extends React.Component<VideoPickerProps, VideoPickerState>
{

    private videoApi: IVideoApi;

    static defaultProps: any = {
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
    };

    static getDerivedStateFromProps(nextProps: VideoPickerProps, prevState: VideoPickerState)
    {
        //console.log('Inside derived state from props');
        if (prevState.library.length !== prevState.layouts["lg"].length)
        {

            let itemCount = prevState.library.length;
            const layouts: Layouts = VideoPicker.createLayouts(itemCount);

            let newState: VideoPickerState = {
                layouts: layouts,
                thumbnailPath: prevState.thumbnailPath, //this is persisted, will likely change this to dynamically obtain each thumbnail in the future. 
                library: prevState.library
            };

            return newState;
        };
        return null;
    };


    constructor(_props: VideoPickerProps)
    {
        super(_props);
        this.selectVideo = this.selectVideo.bind(this);

        this.videoApi = new VideoApi();
        const layouts: Layouts = {
            lg: [],
            md: [],
            sm: [],
            xs: [],
            xxs: []
        };
        let thumbnailPath = this.videoApi.getThumbnailApiAddress();


        this.state = {
            library: [],
            layouts: layouts,
            thumbnailPath: thumbnailPath
        };

        this.videoApi.getVideos()
            .then((videos: Array<VideoResource>) =>
            {
                this.setState({
                    library: videos
                });
            }).catch((error: any) =>
            {
                throw error;
            });
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
        if (typeof (this.state.library) === "undefined")
        {
            return;
        }
        let elements: JSX.Element[] = [];

        let thumbnail : string = "no_thumbnail.jpg";
        
        this.state.library.forEach((video: VideoResource, index: number) => 
        {
            if (video.thumbnail !== null && video.thumbnail !== "")
            {
                thumbnail = this.state.thumbnailPath + video.thumbnail;
            }
            let offsetIndex = index + 1; //This is to offset the index to match the react-grid-layout's layout which starts at 1.
            let elementDOM: JSX.Element =
                <div className="imageParent" key={offsetIndex}>
                    <img id={offsetIndex.toString()} 
                          className="image" 
                          src={thumbnail}
                          alt={video.name} 
                          onMouseDown={e => { 
                            this.selectVideo(video);
                          }} />
                </div>
            elements.push(elementDOM);
        });

        return elements;
    };

    private selectVideo(_selectedVideo: VideoResource)
    {
        this.props.selectVideo(_selectedVideo);
    }

    render()
    {


        if (typeof (this.state.library) === "undefined" || this.state.library.length === 0 || typeof (this.state.layouts) === "undefined")
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
                    {this.createDOM(this.state.library.length)}
                </ResponsiveReactGridLayout>
            </div>
        );
    }
}