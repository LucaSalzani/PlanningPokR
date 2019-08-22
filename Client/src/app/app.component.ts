import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { VotingStateUpdate, CommunicationHubService } from './core/communication-hub.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  private votingStateUpdateSubscription: Subscription;

  public votingStateUpdate: VotingStateUpdate;

  constructor(private communicationHubService: CommunicationHubService) {
    this.votingStateUpdate = {
      status: 'Revealed',
      voters: []
    };

    this.votingStateUpdateSubscription = this.communicationHubService.getVotingStateUpdate().subscribe(
      stateUpdate => {
        this.votingStateUpdate = stateUpdate;
      }
    );
  }

  ngOnDestroy(): void {
    this.communicationHubService.disconnect();
    this.votingStateUpdateSubscription.unsubscribe();
  }
}
