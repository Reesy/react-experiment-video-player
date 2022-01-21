import { ISocket } from '../interfaces/ISocket';

export default class Socket implements ISocket
{

    constructor()
    {

    };

    public send(message: string): void {
        throw new Error('Method not implemented.');
    };

    
};