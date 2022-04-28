import { ISocketAPI } from "./ISocketAPI";


export class SocketAPI implements ISocketAPI
{
    private websocket: WebSocket;
    private listeners: Array<Function>;
    private ws_path: string = process.env.REACT_APP_WS_URL ? process.env.REACT_APP_WS_URL : `wss://${window.location.host}/ws`; 

    constructor()
    {
        console.log ('ws_path: ', this.ws_path);
        this.websocket = new WebSocket(this.ws_path);
        this.listeners = new Array<Function>();
        
        this.websocket.onmessage = (event) =>
        {
            if (this.listeners.length < 1)
            {
                console.log('A message was received but no listeners were found, please add a listener');
                console.log('The unhandled message was: ' + event.data);
            }
            this.listeners.forEach(listener =>
            {
                listener(event.data);
            });
        };
    };

    //I want to check if a connection is established, once connected I want the promise to resolve. 
    private waitForOpen(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (this.websocket.readyState === WebSocket.OPEN)
            {
                resolve();
            }
            else
            {
                this.websocket.onopen = () =>
                {
                    console.log("Socket connection established");
                    resolve();
                };
            }
        });

    };



    async send(message: string): Promise<void>
    {
        await this.waitForOpen();
        
        this.websocket.send(message);
    };

    addListener(callback: Function): void
    {
        this.listeners.push(callback);
    };

    removeListener(callback: Function): void
    {
        this.listeners.splice(this.listeners.indexOf(callback), 1);
    };

    close(): void
    {
        this.listeners = Array();
        this.websocket.close();
    };


}