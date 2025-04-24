# WebRTC Music Jam Platform

This is a real-time video conferencing application built using WebRTC, enabling peer-to-peer communication for video, audio, and text chat. It's designed for music enthusiasts to collaborate online, especially for remote music jam sessions.

## Features

- **Peer-to-Peer Video and Audio Communication**: Allows users to join a video call, stream audio and video, and interact with other participants.
- **Text Chat**: A chat window for real-time text communication alongside the video.
- **Mute/Unmute**: Users can toggle their microphone on or off during the call.
- **Camera On/Off**: Users can toggle their camera on or off.

## Technologies Used

- **WebRTC**: For real-time peer-to-peer video and audio communication.
- **Socket.io**: For signaling between clients to establish WebRTC connections.
- **Node.js**: Backend server to handle WebRTC signaling and WebSocket connections.
- **Express**: For serving the application.
- **HTML/CSS/JavaScript**: Frontend for the user interface and interaction.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Nasriya-NF/webrtc-music-jam.git
cd webrtc-music-jam

Install Dependencies
npm install

Start the server
npm start

#HOW IT WORKS
Once access is granted, the local media stream will be displayed in a video element on the webpage.

The server uses Socket.io to handle signaling and exchange WebRTC offers, answers, and ICE candidates between users to establish a peer-to-peer connection.

The application allows for muting/unmuting the microphone and toggling the camera during the call.

A text chat feature is available to send messages during the session.

#License
This project is licensed under the MIT License - see the LICENSE file for details.

##Acknowledgments
WebRTC

Socket.io

Express
