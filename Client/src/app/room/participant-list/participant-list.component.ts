import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Observable } from 'rxjs';

import { CommunicationHubService, ParticipantsStateUpdate } from 'src/app/core';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss']
})
export class ParticipantListComponent {
  state: 'backlog' | 'poker';

  public participantsStateUpdate$: Observable<ParticipantsStateUpdate>;

  constructor(private communicationHubService: CommunicationHubService, router: Router) {
    this.state = 'backlog';
    this.participantsStateUpdate$ = this.communicationHubService.getParticipantsStateUpdate();
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.state = event.url.split('/')[event.url.split('/').length - 1].startsWith('poker') ? 'poker' : 'backlog';
      }
    });
  }

}
