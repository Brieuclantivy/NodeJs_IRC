import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/blocks/login/login.component';
import { ChatRoomComponent } from './components/layout/chat-room/chat-room.component';
import { SignUpComponent } from './components/blocks/sign-up/sign-up.component';
import { RoomSettingComponent } from './components/blocks/room-setting/room-setting.component';
import { FourOFourComponent } from './components/redirect/four-ofour/four-ofour.component';
import { ErrorComponent } from './components/redirect/error/error.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'room', component: ChatRoomComponent},
  { path: 'signup', component: SignUpComponent},
  { path: 'roomsetting', component: RoomSettingComponent},
  { path: 'error', component: ErrorComponent},
  { path: 'not-found', component: FourOFourComponent},
  { path: '**', redirectTo: '/not-found' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
