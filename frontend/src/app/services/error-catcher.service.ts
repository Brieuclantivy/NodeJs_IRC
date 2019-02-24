import { Injectable, ErrorHandler } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorCatcherService {
  private url = 'http://localhost:10001';
  private socket;
  error: String = '';
  constructor(private router: Router) {
    this.socket = io(this.url);
  }

  public catchError = () => {
    return Observable.create((observer) => {
      this.socket.on('throwError', (error) => {
        this.error = error;
        this.router.navigate(['/error', error]);
      });
    });
  }
}
