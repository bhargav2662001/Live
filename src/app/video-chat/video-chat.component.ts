import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { VideoChatService } from '../video-chat.service';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements AfterViewInit {
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  peerId: string = "Generating...";
  remotePeerId: string = "";

  constructor(private videoChatService: VideoChatService) {}

  async ngAfterViewInit() {
    // Initialize local video
    await this.videoChatService.initLocalStream(this.myVideo.nativeElement);

    // Fetch Peer ID after ensuring PeerJS is ready
    setTimeout(() => {
      this.peerId = this.videoChatService.getPeerId();
      console.log("📡 My Peer ID:", this.peerId);
    }, 2000);
  }

  callPeer() {
    if (!this.remotePeerId) {
      alert("⚠️ Please enter a remote peer ID.");
      return;
    }
    console.log(`📞 Calling peer: ${this.remotePeerId}`);
    this.videoChatService.callPeer(this.remotePeerId, this.remoteVideo.nativeElement);
  }
}
