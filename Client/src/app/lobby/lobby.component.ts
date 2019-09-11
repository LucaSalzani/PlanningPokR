import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Room } from '../core/models';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent {
  public rooms: Room[];

  constructor(private router: Router) {
    this.rooms = [
      { roomName: 'Anubis', roomId: 'anubis' },
      { roomName: 'Geb', roomId: 'geb' },
      { roomName: 'Horus', roomId: 'horus' },
      { roomName: 'Maat', roomId: 'maat' },
      { roomName: 'Osiris', roomId: 'osiris' },
      { roomName: 'Seth', roomId: 'seth' },
    ];
  }

  joinRoom(roomId: string) {
    this.router.navigateByUrl(`/room/${roomId}`);
  }
}
