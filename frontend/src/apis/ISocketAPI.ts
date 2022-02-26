

export interface ISocketAPI 
{
    send(message: string): void;

    addListener(callback: Function): void;

    close(): void;

}