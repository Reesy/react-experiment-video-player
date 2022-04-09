import express = require("express");
import { IConnections } from "../interfaces/Connections";

export default class RoomAPI 
{

    private app: express.Application;
    private rooms: IConnections;
    constructor(_app: express.Application, _rooms: IConnections)
    {
        this.app = _app;
        this.rooms = _rooms;
        this.initRoutes();
    };

    initRoutes()
    {
        this.app.get('/api/rooms', (req: express.Request, res: express.Response) =>
        {
            res.send(this.rooms.getRooms());
        });

        this.app.get('/api/room', (req: express.Request, res: express.Response) =>
        {
            let roomID: any = req.query.roomID!;
            try 
            {
                let room = this.rooms.getRoom(roomID);
                res.send(room);
            }
            catch (error)
            {
                res.send(error);
            };

        });

        this.app.post('/api/room', (req: express.Request, res: express.Response) =>
        {
            throw 'Not implemented'
        });

    }
}