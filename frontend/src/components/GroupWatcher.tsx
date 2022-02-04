import React from 'react';
import '../styles/GroupWatcher.css';
// = new WebSocket('ws://localhost:7070');
let websocket: WebSocket;

class GroupWatcher extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
    }
    
    destructor()
    {
    };

    render() {
      
      
    let content;
    if (this.props.connected === true)
    {
        content = 
        <div>
            <p>
                <button
                    className="Main-button"
                    onClick={this.props.sendMessage}>
                    Send pause update
                </button>
            </p>

            <p> Playback is {this.props.isPaused} </p> 
        </div>
    }
    else
    {
        content = 
        <div>
            <p>
                <button
                    onClick={this.props.createConnection}>
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

};

export default GroupWatcher;
