import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { VideoStreamComponent } from './video-stream/video-stream.component';

const routes: Routes = [

  // { path: '', redirectTo: 'video-chat', pathMatch: 'full'},
  // {path:'video-chat',component:VideoChatComponent , data:{random:0}}

  { path: '', redirectTo: 'video', pathMatch: 'full'},
  {path:'video',component:VideoStreamComponent , data:{random:0}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 

 }
