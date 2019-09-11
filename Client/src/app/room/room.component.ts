import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommunicationHubService } from '../core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  private roomId: string;

  constructor(private communicationHubService: CommunicationHubService, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomid');
    await this.communicationHubService.enterRoomAsync(this.roomId);
  }

  async ngOnDestroy() {
    await this.communicationHubService.leaveRoomAsync();
  }
}
