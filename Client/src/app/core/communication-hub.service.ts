import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunicationHubService {
  private hubConnection: HubConnection;
  private votingStateUpdate$: Subject<VotingStateUpdate>;

  constructor() {
    this.votingStateUpdate$ = new Subject<VotingStateUpdate>();

    this.hubConnection = new HubConnectionBuilder().withUrl(environment.communicationHubBaseUrl + environment.communicationHubPath).build();

    this.connect();
  }

  public connect(): void {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :(', err));

    this.hubConnection.on('votingStateUpdate', payload => this.votingStateUpdate$.next(payload));
  }

  public getVotingStateUpdate(): Observable<VotingStateUpdate> {
    return this.votingStateUpdate$.asObservable();
  }

  public disconnect() {
    this.hubConnection.stop();
  }
}

export interface VotingStateUpdate { // TODO: Move to better place
  status: 'Voting' | 'Revealed';
  voters: string[];
}
