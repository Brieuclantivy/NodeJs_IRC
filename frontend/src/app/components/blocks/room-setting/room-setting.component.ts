import { Component, OnInit } from '@angular/core';
import { ChatService } from 'app/services/chat.service';

@Component({
  selector: 'app-room-setting',
  templateUrl: './room-setting.component.html',
  styleUrls: ['./room-setting.component.scss']
})
export class RoomSettingComponent implements OnInit {
  roomList: string[];
  newRoomName: string;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.refreshRooms();
  }

  deleteRoom(roomname) {
    this.chatService.deleteRoom(roomname);
  }

  refreshRooms() {
    this.roomList = this.chatService.roomList;
    this.chatService
    .getListRoom()
    .subscribe((room: string) => {
    });
  }

  createRoom() {
    this.chatService.createRoom(this.newRoomName);
    this.newRoomName = '';
  }

  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.createRoom();
    }
  }
}
