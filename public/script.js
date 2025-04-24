
const username = prompt("Enter your name:");
const socket = io();
socket.emit("set-username", username);


const videoContainer = document.getElementById("video-container");

const peers = {};
const localVideo = document.createElement("video");
localVideo.muted = true;
localVideo.autoplay = true;
localVideo.playsInline = true;
videoContainer.appendChild(localVideo);

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localVideo.srcObject = stream;

        socket.emit("join", "music-jam-room");

        socket.on("new-user", (userId) => {
            const peer = createPeer(userId, stream);
            peers[userId] = peer;
        });

        socket.on("offer", async (data) => {
            const peer = createPeer(data.sender, stream, false);
            peers[data.sender] = peer;
            await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit("answer", { target: data.sender, sdp: peer.localDescription });
        });

        socket.on("answer", async (data) => {
            const peer = peers[data.sender];
            await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
        });

        socket.on("candidate", (data) => {
            const peer = peers[data.sender];
            if (peer) {
                peer.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        });

        socket.on("user-disconnected", (userId) => {
            if (peers[userId]) {
                peers[userId].close();
                delete peers[userId];
            }
            document.getElementById(userId)?.remove();
        });

    })
    .catch(error => console.error("Error accessing media devices:", error));

function createPeer(userId, stream, initiator = true) {
    const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.ontrack = (event) => {
        let remoteVideo = document.getElementById(userId);
        if (!remoteVideo) {
            remoteVideo = document.createElement("video");
            remoteVideo.id = userId;
            remoteVideo.autoplay = true;
            remoteVideo.playsInline = true;
            videoContainer.appendChild(remoteVideo);
        }
        remoteVideo.srcObject = event.streams[0];
    };

    peer.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("candidate", { target: userId, candidate: event.candidate });
        }
    };

    if (initiator) {
        peer.createOffer().then(offer => {
            peer.setLocalDescription(offer);
            socket.emit("offer", { target: userId, sdp: offer });
        });
    }

    return peer;
}
const muteButton = document.getElementById("muteButton");
const videoButton = document.getElementById("videoButton");

let isAudioMuted = false;
let isVideoMuted = false;

muteButton.addEventListener("click", () => {
    const audioTracks = localVideo.srcObject.getAudioTracks();
    if (audioTracks.length > 0) {
        isAudioMuted = !isAudioMuted;
        audioTracks[0].enabled = !isAudioMuted;
        muteButton.textContent = isAudioMuted ? "Unmute" : "Mute";
    }
});

videoButton.addEventListener("click", () => {
    const videoTracks = localVideo.srcObject.getVideoTracks();
    if (videoTracks.length > 0) {
        isVideoMuted = !isVideoMuted;
        videoTracks[0].enabled = !isVideoMuted;
        videoButton.textContent = isVideoMuted ? "Camera On" : "Camera Off";
    }
});


const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendMessage");
const chatBox = document.getElementById("chat-box");

// Send message
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message !== "") {
    socket.emit("chat", message);
    appendMessage(`You: ${message}`);
    messageInput.value = "";
  }
});

// Receive message
socket.on("chat", (data) => {
    appendMessage(`${data.sender}: ${data.message}`);
});


// Append message to chat box
function appendMessage(msg) {
  const msgElement = document.createElement("div");
  msgElement.textContent = msg;
  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
