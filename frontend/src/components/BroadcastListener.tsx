import React from 'react';
import '../styles/BroadcastListener.css';

const websocket: WebSocket = new WebSocket('ws://localhost:7070');

class BroadcastListener extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);

        websocket.onopen = (event: Event) =>
        {
            console.log('Websocket opened');
        };

        websocket.onclose = (event: CloseEvent) =>
        {
            console.log('Websocket closed');
        };
    
        websocket.onmessage = (event: MessageEvent) =>
        {
            console.log('Recieved: ', event.data);
            this.setState({ pauseState: event.data });
        };
   
        this.state = 
        {
            pauseState: "paused" //this can either be 'paused' or 'playing
        };

    }
    
    destructor()
    {
        websocket.close();
    };

    render() {
      return (
        <div>
    
        <p>
            <button
                className="Main-button"
                onClick={this.sendMessage}>
                Click here for something to happen: 
            </button>
        </p>
     
         <p> Playback is {this.state.pauseState} </p> 
        </div>
      );
    }

    sendMessage()
    {   
        websocket.send("Update");
        
        if (this.state.pauseState === "paused")
        {
            this.setState({ pauseState: "playing" });
        }
        else if (this.state.pauseState === "playing")
        {
            this.setState({ pauseState: "paused" });
        };        
    };

};

export default BroadcastListener;
