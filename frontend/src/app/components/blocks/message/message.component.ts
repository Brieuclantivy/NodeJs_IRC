import { Component, OnInit, Input } from '@angular/core';
import { ChatMessage } from 'app/models/chat-message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() chatMessage: ChatMessage;
  userName: String;
  msg: String;
  date: Date;

  constructor() { }
  ngOnInit(chatMessage = this.chatMessage) {
    this.userName = chatMessage.userName;
    this.msg = chatMessage.message;
    this.date = chatMessage.date;
    }
  }

