import { Component, OnInit } from '@angular/core';
import { ChatService } from 'app/services/chat.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  password: String = '';
  username: String = '';
  showbutton: Boolean = false;

  private notifier: NotifierService;

  /**
   * Constructor
   *
   * @param { NotifierService } notifier Notifier service
   */
  constructor(private chatService: ChatService,  notifierService: NotifierService ) {
    this.notifier = notifierService;
  }
  ngOnInit() {
  }

  register() {
    this.chatService.firstConnection(this.username);
    this.showNotification( 'success', 'Your account has been created!!!' );
  }

  handleSubmit(event) {
    this.checkError();
    if (event.keyCode === 13) {
      if (!this.showbutton === true) {
        this.register();
      } else {
        this.showNotification( 'error', 'Enter correct Username and Password first!');
      }
    }
    if (!this.checkAlphaNumeric(event)) {
    this.showNotification( 'error', 'You can only use AlphaNumeric chars.');
    this.password = '';
    this.username = '';
    }
  }

  checkError() {
    if (this.password.length >= 4 && this.password.length <= 12 && this.username.length >= 4 && this.username.length <= 12) {
      this.showbutton = true;
    } else {
      this.showbutton = false;
    }
  }

  checkAlphaNumeric(event) {
    const key = event.charCode || event.keyCode || 0;
    if (
      key === 9 ||
      (key >= 37 && key <= 40) ||
      (key >= 46 && key <= 64)) {
        return false;
      } else {
        return true;
    }
  }
  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }
}
