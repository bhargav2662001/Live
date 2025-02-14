// video.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000'); // Connect to the Flask server
  }

  // Receive video frames
  getVideoStream(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('video_frame', (data: { frame: string }) => {
        observer.next(data.frame);
      });
    });
  }

  // Receive speech-to-text results
  getSpeechText(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('speech_text', (data: { text: string }) => {
        observer.next(data.text);
      });
    });
  }
}