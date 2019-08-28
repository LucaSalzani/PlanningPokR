import { Component } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent {
  public userName: string;
  public rooms: Room[];

  constructor() {
    this.rooms = [
      { roomName: 'Anubis', roomId: 'needed??' },
      { roomName: 'Geb', roomId: 'needed??' },
      { roomName: 'Horus', roomId: 'needed??' },
      { roomName: 'Maat', roomId: 'needed??' },
      { roomName: 'Osiris', roomId: 'needed??' },
      { roomName: 'Seth', roomId: 'needed??' },
    ];
  }

  joinRoom(roomId: string) {
    console.log(roomId);
  }

}

export interface Room {
  roomName: string;
  roomId: string;
}
