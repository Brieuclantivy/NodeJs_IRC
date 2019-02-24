import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  @Input() errorMessage: String;
  message: String;
  constructor() { }

  ngOnInit(message = this.errorMessage) {
    this.message = this.errorMessage;
    }
}
