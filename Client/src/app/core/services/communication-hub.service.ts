import { AuthService } from './../../auth/auth.service';
import { ParticipantsStateUpdate } from './../models/participants-state-update.model';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunicationHubService {
  private hubConnection: HubConnection;
  private participantsStateUpdate$: Subject<ParticipantsStateUpdate>;

  constructor(private authService: AuthService) {
    this.participantsStateUpdate$ = new BehaviorSubject<ParticipantsStateUpdate>({ participants: [], areVotesRevealed: false });

    this.hubConnection = new HubConnectionBuilder().withUrl(environment.backendBaseUrl + environment.communicationHubPath, {
      accessTokenFactory: () => authService.jwt
    }).build();
  }

  public async connect() {
    await this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :(', err));

    this.hubConnection.on(CommunicationHubMethod.ParticipantsStateUpdate, payload => this.participantsStateUpdate$.next(payload));
  }

  public isConnected() {
    return this.hubConnection.state === HubConnectionState.Connected;
  }

  public getParticipantsStateUpdate(): Observable<ParticipantsStateUpdate> {
    return this.participantsStateUpdate$.asObservable();
  }

  public async enterRoomAsync(roomId: string) {
    await this.hubConnection.invoke(CommunicationHubMethod.EnterRoom, roomId);
  }

  public async leaveRoomAsync() {
    await this.hubConnection.invoke(CommunicationHubMethod.LeaveRoom);
  }

  public async selectValueAsync(value: number, roomId: string) {
    await this.hubConnection.invoke(CommunicationHubMethod.SelectValue, value, roomId);
  }

  public async revealVotes(roomId: string) {
    await this.hubConnection.invoke(CommunicationHubMethod.RevealVotes, roomId);
  }

  public disconnect() {
    this.hubConnection.stop();
  }
}

export enum CommunicationHubMethod {
  EnterRoom = 'enterRoom',
  LeaveRoom = 'leaveRoom',
  SelectValue = 'selectValue',
  RevealVotes = 'revealVotes',
  VotingStateUpdate = 'votingStateUpdate',
  ParticipantsStateUpdate = 'participantsStateUpdate',
}
