import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChatService } from 'app/services/chat.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
  selectedRoom: string;
  roomList: string[];
  public isCollapsed = false;
  private notifier: NotifierService;

  /**
   * Constructor
   *
   * @param { NotifierService } notifier Notifier service
   */

  constructor(private chatService: ChatService, notifierService: NotifierService) {
    this.notifier = notifierService;
  }
  ngOnInit() {
    this.chatService
    .getListRoom()
    .subscribe((room: string) => {
    });
    this.roomList = this.chatService.roomList;
  }

  changeRoom(room: string) {
    this.chatService.switchRoom(room);
    this.showNotification( 'success', 'You have joined "' + room + '" channel.' );
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }
}
