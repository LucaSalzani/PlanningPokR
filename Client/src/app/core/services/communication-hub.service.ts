import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ParticipantsStateUpdate } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CommunicationHubService {
  private hubConnection: HubConnection;
  private votingStateUpdate$: Subject<VotingStateUpdate>;
  private participantsStateUpdate$: Subject<ParticipantsStateUpdate>;

  constructor() {
    this.votingStateUpdate$ = new Subject<VotingStateUpdate>();
    this.participantsStateUpdate$ = new BehaviorSubject<ParticipantsStateUpdate>({participants: []});

    this.hubConnection = new HubConnectionBuilder().withUrl(environment.communicationHubBaseUrl + environment.communicationHubPath).build();

    this.connect();
  }

  public connect(): void {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :(', err));

    this.hubConnection.on('votingStateUpdate', payload => this.votingStateUpdate$.next(payload));
    this.hubConnection.on('participantsStateUpdate', payload => this.participantsStateUpdate$.next(payload));
  }

  public getVotingStateUpdate(): Observable<VotingStateUpdate> {
    return this.votingStateUpdate$.asObservable();
  }

  public getParticipantsStateUpdate(): Observable<ParticipantsStateUpdate> {
    return this.participantsStateUpdate$.asObservable();
  }

  public async createParticipantAsync(name: string) {
    await this.hubConnection.invoke('createParticipant', name);
  }

  public async leaveRoomAsync() {
    await this.hubConnection.invoke('leaveRoom');
  }

  public disconnect() {
    this.hubConnection.stop();
  }
}

export interface VotingStateUpdate { // TODO: Move to better place
  status: 'Voting' | 'Revealed';
  voters: string[];
}
