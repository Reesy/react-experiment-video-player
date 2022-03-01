

export interface ISocketAPI 
{
    send(message: string): void;

    addListener(callback: Function): void;

    removeListener(callback: Function): void; 

    close(): void;
};