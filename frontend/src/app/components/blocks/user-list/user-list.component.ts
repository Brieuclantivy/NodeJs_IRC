import { Component, OnInit } from '@angular/core';
import { ChatService } from 'app/services/chat.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: string[] = [];
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService
    .getUsers()
    .subscribe((user: string) => {
    });
    this.users = this.chatService.userList;
  }
}
