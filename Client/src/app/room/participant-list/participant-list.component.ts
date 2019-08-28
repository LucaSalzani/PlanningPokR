import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CommunicationHubService, ParticipantsStateUpdate } from 'src/app/core';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss']
})
export class ParticipantListComponent implements OnDestroy {

  private participantsStateUpdateSubscription: Subscription;

  public participantsStateUpdate: ParticipantsStateUpdate;

  constructor(private communicationHubService: CommunicationHubService) {
    this.participantsStateUpdate = {
      participants: []
    };

    this.participantsStateUpdateSubscription = this.communicationHubService.getParticipantsStateUpdate().subscribe(
      stateUpdate => {
        this.participantsStateUpdate = stateUpdate;
      }
    );
  }

  ngOnDestroy(): void {
    this.communicationHubService.leaveRoomAsync();
    this.participantsStateUpdateSubscription.unsubscribe();
  }

}
