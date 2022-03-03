import React from "react";
import { IVideoApi } from "../apis/IVideoApi";
import { VideoApi } from "../apis/VideoApi";
import { Room } from "../interfaces/Room";


interface RoomProps 
{
    selectRoom: (room: Room) => void;
}

interface RoomState
{
    rooms: Array<Room>;
}

export default class RoomPicker extends React.Component<RoomProps, RoomState>
{
    
    private videoApi: IVideoApi;

    constructor(_props: RoomProps)
    {
        super(_props);

        this.videoApi = new VideoApi();
        
        this.videoApi.getRooms()
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

    // [
    //     {
    //         "roomID": "e704d5e7-ee51-4ade-9fed-3fda76ef7745",
    //         "roomName": "7796da5574c19e239d4f5de4fbfe020f-480p.mp4",
    //         "videoState": {
    //             "videoPath": "http://localhost:3050/7796da5574c19e239d4f5de4fbfe020f-480p.mp4",
    //             "playingState": "paused",
    //             "videoPosition": 0
    //         },
    //         "connections": [
    //             "be74d0ec-61e7-4a5a-8b14-432b6fa1ebef"
    //         ]
    //     }
    // ]

    render(): React.ReactNode {
        
        let content;
        if (typeof(this.state) !== "undefined" && this.state !== null)
        {
            if (this.state.rooms.length > 0)
            {
                content = <div>
                    <h1>Rooms</h1>
                    <ul>
                        {this.state.rooms.map((room: Room) =>
                            <li key={room.roomID}>
                                <p>Video being watched: {room.video.name} </p>
                                <button onClick={() => {this.props.selectRoom(room)}}> Join watch session. </button>
                            </li>
                        )}
                    </ul>
                        
                </div>
                
                
                // this.state.rooms[0].roomName;
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