import { Injectable } from '@angular/core';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class VideoChatService {
  private peer!: Peer;
  private myStream!: MediaStream;

  constructor() {
    this.initializePeer();
  }

  private initializePeer() {
    const peerId = this.generatePeerId();
    
    this.peer = new Peer(peerId, {
      host: "0.peerjs.com",
      port: 443,
      secure: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }, // Google's STUN server
          { urls: "stun:stun1.l.google.com:19302" },
          {
            urls: "turn:TURN_SERVER_ADDRESS", // Replace with your TURN server if needed
            username: "yourUsername",
            credential: "yourPassword"
          }
        ]
      }
    });

    this.peer.on('open', (id) => {
      console.log("✅ My Peer ID:", id);
      localStorage.setItem("peerId", id);
    });

    this.peer.on('disconnected', () => {
      console.warn("⚠️ Peer disconnected, attempting to reconnect...");
      this.peer.reconnect();
    });

    this.peer.on('error', (err) => {
      console.error("❌ PeerJS Error:", err);
    });

    // Listen for incoming calls
    this.peer.on('call', (call) => {
      console.log("📡 Incoming call from:", call.peer);

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log("🎥 Local stream ready, answering call...");
          call.answer(stream);

          call.on("stream", (remoteStream) => {
            console.log("📡 Received remote stream");
            const remoteVideoElement = document.getElementById("remoteVideo") as HTMLVideoElement;
            if (remoteVideoElement) {
              remoteVideoElement.srcObject = remoteStream;
            }
          });
        })
        .catch(err => console.error("🚫 Failed to get media:", err));
    });
  }

  private generatePeerId(): string {
    return 'peer-' + Math.random().toString(36).substr(2, 9);
  }

  /** 🔹 Start Local Video Stream */
  async initLocalStream(videoElement: HTMLVideoElement) {
    try {
      this.myStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoElement.srcObject = this.myStream;
    } catch (error) {
      console.error("❌ Error accessing webcam:", error);
    }
  }

  /** 🔹 Get Peer ID */
  getPeerId(): string {
    return this.peer?.id || "";
  }

  /** 🔹 Call Another Peer */
  callPeer(remotePeerId: string, remoteVideoElement: HTMLVideoElement) {
    if (!this.peer || !this.myStream) {
      console.error("❌ PeerJS or Local Stream not initialized.");
      return;
    }

    const call = this.peer.call(remotePeerId, this.myStream);
    
    call.on("stream", (remoteStream) => {
      console.log("📡 Call connected, setting remote stream...");
      remoteVideoElement.srcObject = remoteStream;
    });

    call.on("error", (err) => {
      console.error("❌ Call error:", err);
    });
  }
}
