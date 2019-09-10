import { ParticipantsStateUpdate } from './../models/participants-state-update.model';
import { VotingStateUpdate } from './communication-hub.service';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunicationHubService {
  private hubConnection: HubConnection;
  private votingStateUpdate$: Subject<VotingStateUpdate>;
  private participantsStateUpdate$: Subject<ParticipantsStateUpdate>;

  constructor() {
    this.votingStateUpdate$ = new Subject<VotingStateUpdate>();
    this.participantsStateUpdate$ = new BehaviorSubject<ParticipantsStateUpdate>({ participants: [], areVotesRevealed: false });

    this.hubConnection = new HubConnectionBuilder().withUrl(environment.communicationHubBaseUrl + environment.communicationHubPath).build();

    this.connect();
  }

  public connect(): void {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :(', err));

    this.hubConnection.on(CommunicationHubMethod.VotingStateUpdate, payload => this.votingStateUpdate$.next(payload));
    this.hubConnection.on(CommunicationHubMethod.ParticipantsStateUpdate, payload => this.participantsStateUpdate$.next(payload));
  }

  public getVotingStateUpdate(): Observable<VotingStateUpdate> {
    return this.votingStateUpdate$.asObservable();
  }

  public getParticipantsStateUpdate(): Observable<ParticipantsStateUpdate> {
    return this.participantsStateUpdate$.asObservable();
  }

  public async createParticipantAsync(name: string) {
    await this.hubConnection.invoke(CommunicationHubMethod.CreateParticipant, name);
  }

  public async leaveRoomAsync() {
    await this.hubConnection.invoke(CommunicationHubMethod.LeaveRoom);
  }

  public async selectValueAsync(value: number) {
    await this.hubConnection.invoke(CommunicationHubMethod.SelectValue, value);
  }

  public async revealVotes() {
    await this.hubConnection.invoke(CommunicationHubMethod.RevealVotes);
  }

  public disconnect() {
    this.hubConnection.stop();
  }
}

export enum CommunicationHubMethod {
  CreateParticipant = 'createParticipant',
  LeaveRoom = 'leaveRoom',
  SelectValue = 'selectValue',
  RevealVotes = 'revealVotes',
  VotingStateUpdate = 'votingStateUpdate',
  ParticipantsStateUpdate = 'participantsStateUpdate',
}

export interface VotingStateUpdate { // TODO: Move to better place
  status: 'Voting' | 'Revealed';
  voters: string[];
}
