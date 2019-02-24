import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule, MatFormFieldModule, MatInputModule, MatIconModule } from '@angular/material';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavComponent } from './components/layout/nav/nav.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ChatRoomComponent } from './components/layout/chat-room/chat-room.component';

import { FormChatComponent } from './components/blocks/form-chat/form-chat.component';
import { LoginComponent } from './components/blocks/login/login.component';
import { SignUpComponent } from './components/blocks/sign-up/sign-up.component';
import { FeedComponent } from './components/blocks/feed/feed.component';
import { UserListComponent } from './components/blocks/user-list/user-list.component';
import { UserItemComponent } from './components/blocks/user-item/user-item.component';
import { MessageComponent } from './components/blocks/message/message.component';
import { RoomListComponent } from './components/blocks/room-list/room-list.component';
import { RoomSettingComponent } from './components/blocks/room-setting/room-setting.component';

import { FourOFourComponent } from './components/redirect/four-ofour/four-ofour.component';
import { ErrorComponent } from './components/redirect/error/error.component';

import { ChatService } from './services/chat.service';
import { ErrorCatcherService } from './services/error-catcher.service';

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
position: {
  horizontal: {
    position: 'left',
    distance: 12
  },
  vertical: {
    position: 'bottom',
    distance: 12,
    gap: 10
  }
},
theme: 'material',
behaviour: {
  autoHide: 5000,
  onClick: false,
  onMouseover: 'pauseAutoHide',
  showDismissButton: true,
  stacking: 4
},
animations: {
  enabled: true,
  show: {
    preset: 'slide',
    speed: 300,
    easing: 'ease'
  },
  hide: {
    preset: 'fade',
    speed: 300,
    easing: 'ease',
    offset: 50
  },
  shift: {
    speed: 300,
    easing: 'ease'
  },
  overlap: 150
}
};
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    SignUpComponent,
    FormChatComponent,
    FeedComponent,
    ChatRoomComponent,
    UserListComponent,
    UserItemComponent,
    FooterComponent,
    MessageComponent,
    RoomListComponent,
    RoomSettingComponent,
    FourOFourComponent,
    ErrorComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    NgbModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    NotifierModule.withConfig(customNotifierOptions),
    MatIconModule,
  ],
  providers: [ChatService, ErrorCatcherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
