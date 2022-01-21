import React from 'react';
import '../styles/GroupWatcher.css';
// = new WebSocket('ws://localhost:7070');
let websocket: WebSocket;

class GroupWatcher extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.createConnection = this.createConnection.bind(this);

   
        this.state = 
        {
            pauseState: "paused", //this can either be 'paused' or 'playing
            connected: false,
        };

    }
    
    destructor()
    {
        websocket.close();
    };

    render() {
      
      
    let content;
    if (this.state.connected === true)
    {
        content = 
        <div>
            <p>
                <button
                    className="Main-button"
                    onClick={this.sendMessage}>
                    Send pause update
                </button>
            </p>

            <p> Playback is {this.state.pauseState} </p> 
        </div>
    }
    else
    {
        content = 
        <div>
            <p>
                <button
                    onClick={this.createConnection}>
                    Connect
                </button>
            </p>
        </div>
    }
      
    return (
        <div>
            {content} 
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

    createConnection()
    {
        this.setState({ connected: true });
        websocket = new WebSocket('ws://localhost:7070');

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

    }

};

export default GroupWatcher;
