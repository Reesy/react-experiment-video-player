# React-experiment-video-player

# Description 
A react based single page app that has a video selection screen, video player and a group watch feature using web sockets. 

The API server is run using NodeJS and checks the host machine for valid video videos, subtitles and an associated thumbnail and serves it to the react frontend. It hosts REST based APIs to allow for the retrieval of the video, thumbnails and subtitles and it uses websockets to sync up a 'group watch' (called room) session. 

</br>

# Quick build
Building the backend server: [Building the API server](./backend/README.MD)
</br>
Building the frontend react app [Building the API server](./frontend/README.md)

## Current progress 

Note: This code is in need of a big refactor, I inverted many SOLID principles and didn't TDD 

- [ ] CI/CD through Jenkins 
    - [x] Building API/backend
    - [ ] Testing API/backend
        - [x] Unit tests
        - [ ] API tests
    - [x] Building Client/frontend
    - [ ] Testing API/backend
    - [ ] Full scale 'prod-like' end-to-end testing
    - [ ] Add a build status badge to the top level readme
- [x] Rest APIs for locating and serving content
    - [x] Videos
    - [x] Thumbnails
    - [x] Subtitles
      - [ ] Read subtitles on subtitle builder (it regressed)
      - [ ] Add API test to prevent regression.
- [x] Video selection screen 
- [x] Video player screen
    - [ ] Custom styling
- [x] Room selection screen (for group watch)
    - [x] On joining, video playes from the current watching position of everyone else in the room
    - [x] Pause/play and video position changes are broadcast to everyone in the room.
    - [ ] Leave room/close socket
    - [ ] Show how many users are currently watching the video
    - [ ] Add ability for a private group watch, randomised 'password' key. 
- [ ] Rescan host directories for updated content 
- [ ] Clean up disconnected socket connections
- [ ] Reassign 'host' when the host leaves (the socket who's videos state is grabbed when a new user joins the room)
- [ ] Add a nginx.conf file
  - [ ] Add certificate, using certbot.
- [ ] Update CORS to be less permissable, i.e add a prod mode. 
- [ ] Dockerise frontend
  - [ ] Narrow down files that should be in the docker image.
- [ ] Dockerise backend
  - [ ] Narrow down files that should be in the docker image.
- [ ] Add docker-compose.yml

## Jenkins CI/CD support
It has Jenkins support, If you have a Jenkins server you can use the Jenkins github plugin to set up a job. It's much easier through blue-ocean. You can create a new pipeline, point it at your github repository and it will automatically build your project.
