const video = document.getElementById("videosContainer");

// Add an event listener to trigger screen sharing when a click event occurs
document.addEventListener("click", () => {
  // Call getDisplayMedia inside the event listener
  navigator.mediaDevices
    .getDisplayMedia({ video: true })
    .then((stream) => {
      // Clear previous videos
      video.innerHTML = "";

      const screenVideo = document.createElement("video");
      screenVideo.srcObject = stream;
      screenVideo.autoplay = true;

      // Append the screen sharing video to the videos container
      video.appendChild(screenVideo);

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
