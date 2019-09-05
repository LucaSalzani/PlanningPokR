import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommunicationHubService } from '../core/services';
import { Room } from '../core/models';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent {
  public userName: string;
  public rooms: Room[];

  constructor(private communicationHubService: CommunicationHubService, private router: Router) {
    this.rooms = [
      { roomName: 'Anubis', roomId: 'needed??' },
      { roomName: 'Geb', roomId: 'needed??' },
      { roomName: 'Horus', roomId: 'needed??' },
      { roomName: 'Maat', roomId: 'needed??' },
      { roomName: 'Osiris', roomId: 'needed??' },
      { roomName: 'Seth', roomId: 'needed??' },
    ];
  }

  async joinRoom() {
    await this.communicationHubService.createParticipantAsync(this.userName);
    this.router.navigateByUrl(`/room/${42}`);
  }
}
