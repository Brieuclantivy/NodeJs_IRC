import { Injectable } from '@angular/core';
import { ChatMessage } from '../models/chat-message.model';
import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatMessages: ChatMessage[] = [];
  roomList: string[] = [];
  userList: string[] = [];
  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();
  private url = 'http://localhost:10001';
  private socket;

  constructor(private router: Router) {
      this.socket = io(this.url);
  }
  public sendMessage(message) {
      this.socket.emit('sendMessage', message);
  }

  public firstConnection(username) {
    this.socket.emit('newUserConnected', username);
    }

  public getMessages = () => {
      return Observable.create((observer) => {
        this.socket.on('sendMessage', (username, message) => {
          let exist: Boolean = false;
            this.chatMessages.forEach(msg => {
              if ((msg.date.getSeconds() === new Date().getSeconds()) && (msg.userName === username) && (msg.message === message)) {
                exist = true;
              }
            });
            if (exist === false) {
              this.chatMessages.push({userName : username, message: message, date : new Date()});
            }
          });
      });
  }

  public getUsers = () => {
    this.socket.emit('updateRoomList', 'room1');
    return Observable.create((observer) => {
        this.socket.on('updateRoomList', (roomList, actualRoom, userList) => {
          console.log('update room: ' + userList);
          while (this.userList.length > 0) {
            this.userList.pop();
          }
          userList.forEach(user => {
            if (!this.userList.includes(user)) {
              this.userList.push(user);
            }
          });
        });
    });
}

  public switchRoom = (newroom) => {
      this.socket.emit('switchRoom', newroom);
      this.socket.emit('getHistory', newroom);
      this.socket.on('getHistory', (message) => {
         console.log('history' + message[0].nickname);
      message.forEach(msg => {
        this.chatMessages.push({userName: msg.nickame, message: msg.msg, date: msg.sendDate});
      });
        });
}

  public getListRoom = () => {
    this.socket.emit('getListRoom');
    return Observable.create((observer) => {
      this.socket.on('getListRoom', (roomName) => {
        roomName.forEach(room => {
          if (!this.roomList.includes(room)) {
            this.roomList.push(room);
            }
          });
        });
      });
  }

  public deleteRoom = (roomName) => {
    this.socket.emit('deleteRoom', roomName);
    this.getListRoom();
  }

  public createRoom = (roomName) => {
    this.socket.emit('addRoom', roomName);
    this.getListRoom();
  }

  public catchError = () => {
    this.socket.on('throwError', (errorMsg) => {
      this.router.navigate(['/error', errorMsg]);
    });
    this.router.navigate(['/error']);
  }
}
