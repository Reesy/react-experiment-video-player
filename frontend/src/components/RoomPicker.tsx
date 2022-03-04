import React from "react";
import { IVideoApi } from "../apis/IVideoApi";
import { VideoApi } from "../apis/VideoApi";
import { RoomResource } from "../interfaces/RoomResource";
interface RoomPickerProps 
{
    selectRoom: (room: RoomResource) => void;
}

interface RoomPickerState
{
    rooms: Array<RoomResource>;
}

export default class RoomPicker extends React.Component<RoomPickerProps, RoomPickerState>
{
    
    private videoApi: IVideoApi;

    constructor(_props: RoomPickerProps)
    {
        super(_props);

        this.videoApi = new VideoApi();
        
        this.videoApi.getRooms()
            .then((response: any) => 
            {
                this.setState({rooms: response});
            })
            .catch((err: any) => {
                console.log(err)
            });
    };

    render(): React.ReactNode {
        
        let content;
        if (typeof(this.state) !== "undefined" && this.state !== null)
        {
            if (this.state.rooms.length > 0)
            {
                content = <div>
                    <h1>Rooms</h1>
                    <ul>
                        {this.state.rooms.map((room: RoomResource) =>
                            <li key={room.id}>
                                <p>Video being watched: {room.name} </p>
                                <button onClick={() => {this.props.selectRoom(room)}}> Join watch session. </button>
                            </li>
                        )}
                    </ul>
                        
                </div>
            }
            else
            {
                content = "There are no groups watching together at the moment.";
            }

        }
        else
        {
            content = "Loading rooms.."
        };
        
        
        return (

            <div>
                {content}
            </div>
        )
    }
};