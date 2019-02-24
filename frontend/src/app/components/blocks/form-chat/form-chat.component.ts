import { Component, OnInit } from '@angular/core';
import { ChatService } from 'app/services/chat.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-form-chat',
  templateUrl: './form-chat.component.html',
  styleUrls: ['./form-chat.component.scss']
})
export class FormChatComponent implements OnInit {
  messageText: String;
  messageArray: Array<{user: String, message: String}> = [];

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
  }

  send() {
    if (this.messageText.length < 255 || this.messageText.length === 0) {
      this.chatService.sendMessage(this.messageText);
      this.messageText = '';
    } else {
      this.showNotification( 'error', 'A message must be between 1 and 255 char.');
    }
  }

  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }
}
