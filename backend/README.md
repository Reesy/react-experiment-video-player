## Available Scripts

In the project directory, you can run:

### `npm start`

Runs a node service that provides a REST API and websockets. 

Default REST API URL [http://localhost:3050](http://localhost:3050)
</br>
Default websocket URL [ws://localhost:7070/](ws://localhost:7070/)

### `npm run test`

Runs Mocha based unit tests

### `npm run build`

Runs the Typescript transpiler on the project TS files and outputs the resulting JS files in a ./dist/ folder.

### Requirements 

For videos, subtitles and thumbnails to be discoverable the following file structure is required: 

```
backend
│   README.md
│   builders
|   constants
|   ...
│
└───thumbnails
│   │   videoExample1.jpg
│   │   videoExample2.jpg
└───videos
    │   videoExample1.mp4/m4v
    │   videoExample2.mp4/m4v
    |   videoExample2.vtt   (subtitle file)
```

The app will attempt to pair thumbnails to videos and return them in the API using a 'fast-dice-coefficient' algorithm (https://github.com/ka-weihe/fast-dice-coefficient)

## REST API


---
GET example ```/api/video/library``` request:
```
GET /api/video/library HTTP/1.1
```

Example response:
```
HTTP/1.1 200 OK
Server: My RESTful API
Content-Type: application/json; charset=utf-8
Content-Length: xy

[
    {
        "name": "myvid.mp4",
        "path": "myvid.mp4",
        "thumbnail": "myvidsss.jpg"
    },
    {
        "name": "myothervid.mp4",
        "path": "myothervid.mp4",
        "thumbnail": "myothervid.jpg"
    }
]
```

---

---
GET example ```/api/video/scanLibrary``` request:
```
GET /api/video/scanLibrary HTTP/1.1
```

Example response:
```
HTTP/1.1 200 OK
Server: My RESTful API
Content-Type: application/json; charset=utf-8
Content-Length: xy

"Beginning Scan"

```

---


---
GET example ```/api/rooms``` request:
```
GET /api/rooms HTTP/1.1
```

Example response:
```
HTTP/1.1 200 OK
Server: My RESTful API
Content-Type: application/json; charset=utf-8
Content-Length: xy

[
    {
        "id": "50b0930b-770b-47a5-b01f-666f452f0938",    //Guid Associated to room
        "name": "MyVid1.mp4"
    }
]
```

---


---
GET example ```/api/room?roomID=50b0930b-770b-47a5-b01f-666f452f0938``` request:
```
GET /api/room HTTP/1.1
```

Example response:
```
HTTP/1.1 200 OK
Server: My RESTful API
Content-Type: application/json; charset=utf-8
Content-Length: xy

[
    {
        "id": "50b0930b-770b-47a5-b01f-666f452f0938",    //Guid Associated to room
        "name": "MyVid1.mp4"
    }
]
```
