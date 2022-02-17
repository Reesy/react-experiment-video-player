import React from "react";
import { IVideoApi } from "../apis/IVideoApi";
import { Room } from "../interfaces/Room";


interface RoomProps 
{
    videoApi: IVideoApi;
}


interface RoomState
{
    rooms: Array<Room>;
}

export default class RoomPicker extends React.Component<RoomProps, RoomState>
{

    constructor(_props: any)
    {
        super(_props);

   
        _props.videoApi.getRooms()
            .then((response: any) => 
            {
                this.setState({rooms: response});
                //this.rooms = response.data;
                //console.log(response);
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
                content = this.state.rooms[0].roomName;
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