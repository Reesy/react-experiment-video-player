import express = require("express");
import { Video } from "../interfaces/Video";
import { Library } from "../services/Library";


export default class LibraryAPI
{
    private app: express.Application;
    private cachedLibrary: Array<Video>;
    private Library: Library;

    constructor(_app: express.Application, _library: Library)
    {
        this.app = _app;
        this.Library = _library;
        this.cachedLibrary = _library.getLibrary();
        this.initRoutes();
    };

    initRoutes()
    {

        this.app.get('/api/video/library', (req: express.Request, res: express.Response) =>
        {
            console.log("Library api called from" + req.ip);
            res.send(this.cachedLibrary);
        });

        this.app.get('/api/video/scanLibrary', (req: express.Request, res: express.Response) =>
        {
            this.Library.scanLibrary();
            res.send("Beginning scan");
        });
    };

};