const video = document.getElementById("remoteVideo");
// Rest of your code follows...

document.addEventListener("click", () => {
  // Call getDisplayMedia inside the event listener
  navigator.mediaDevices
    .getDisplayMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;

      const peerConnection = new RTCPeerConnection();

      // Add the screen stream to the peer connection
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));

      // Send offer to signaling server
      peerConnection
        .createOffer()
        .then((offer) => {
          peerConnection.setLocalDescription(offer);
          socket.emit("offer", offer);
        })
        .catch((error) => {
          console.error("Error creating offer:", error);
        });

      // Handle incoming answers from the signaling server
      socket.on("answer", (answer) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      });

      // Handle incoming ICE candidates from the signaling server
      socket.on("iceCandidate", (iceCandidate) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
      });
    })
    .catch((error) => {
      console.error("Error accessing media devices.", error);
    });
});
