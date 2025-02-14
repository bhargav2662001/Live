// video-stream.component.ts
import { Component, OnInit } from '@angular/core';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.css'],
})
export class VideoStreamComponent implements OnInit {
  frame: string = '';
  speechText: string = '';

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    // Subscribe to video stream
    this.videoService.getVideoStream().subscribe((frame) => {
      this.frame = 'data:image/jpeg;base64,' + frame; // Convert base64 to image URL
    });

    // Subscribe to speech-to-text results
    this.videoService.getSpeechText().subscribe((text) => {
      this.speechText = text;
    });
  }
}