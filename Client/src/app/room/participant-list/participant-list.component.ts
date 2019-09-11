import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { CommunicationHubService, ParticipantsStateUpdate } from 'src/app/core';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss']
})
export class ParticipantListComponent {

  public participantsStateUpdate$: Observable<ParticipantsStateUpdate>;

  constructor(private communicationHubService: CommunicationHubService) {
    this.participantsStateUpdate$ = this.communicationHubService.getParticipantsStateUpdate();
  }

}
