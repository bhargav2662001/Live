import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { FormsModule } from '@angular/forms';
import { VideoStreamComponent } from './video-stream/video-stream.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoChatComponent,
    VideoStreamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
