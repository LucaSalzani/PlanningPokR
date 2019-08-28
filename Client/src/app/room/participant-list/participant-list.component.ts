import { Component, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { CommunicationHubService, ParticipantsStateUpdate } from 'src/app/core';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss']
})
export class ParticipantListComponent implements OnDestroy {

  public participantsStateUpdate$: Observable<ParticipantsStateUpdate>;

  constructor(private communicationHubService: CommunicationHubService) {
    this.participantsStateUpdate$ = this.communicationHubService.getParticipantsStateUpdate();
  }

  ngOnDestroy(): void {
    this.communicationHubService.leaveRoomAsync(); // TODO: Maybe move to room.component.ts
  }

}
