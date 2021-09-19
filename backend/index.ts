import express  = require("express");
import bodyParser = require('body-parser');
import Library = require('./services/Library');
import path = require('path');

const app = express();
const ServedVideoLocation = 'videos'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let contentDirectory = path.join(__dirname, ServedVideoLocation);
app.use(express.static(contentDirectory));

let library = new Library.Library(contentDirectory, '');
let cachedLibrary = library.getLibrary();

app.use((req, res, next) => 
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
  
app.get('/api/video/library', (req: express.Request, res: express.Response) =>
{
  console.log("Library api called from" + req.ip);
  res.send(cachedLibrary);
});

app.get('/api/video/scanLibrary', (req: express.Request, res: express.Response) =>
{
  library.scanLibrary();
  res.send("Beginning scan");
});

console.log("Listening on port 3050");
app.listen(3050);