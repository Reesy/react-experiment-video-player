import express  = require("express");
import bodyParser = require('body-parser');
import Library = require('./services/Library');
import path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let contentDirectory = path.join(__dirname, 'videos');
app.use(express.static(contentDirectory));
let library = new Library.Library();
let cachedLibrary = library.getLibrary();

app.get('/api/video/library', (req: express.Request, res: express.Response) =>
{
    res.send(cachedLibrary);
});

console.log("Listening on port 3050");
app.listen(3050);