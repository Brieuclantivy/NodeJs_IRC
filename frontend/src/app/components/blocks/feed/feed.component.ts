import { Component, OnInit } from '@angular/core';
import { ChatMessage } from 'app/models/chat-message.model';
import { ChatService } from 'app/services/chat.service';
import { ErrorCatcherService } from 'app/services/error-catcher.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  public messages: Array <ChatMessage> = [];
  public error: String = '';
  constructor(private chatService: ChatService, private errorHandler: ErrorCatcherService) {}
  ngOnInit() {
    this.messages = this.chatService.chatMessages;
    this.chatService
      .getMessages()
      .subscribe((msg: ChatMessage) => {
    });
    this.error = this.errorHandler.error;
    this.errorHandler
      .catchError()
      .subscribe((error) => { });
    }
}
