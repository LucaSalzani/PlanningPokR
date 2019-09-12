import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from './../../auth/auth.service';
import { ParticipantsStateUpdate, NavigationUpdate } from './../models';
import { CommunicationHubMethod } from './communication-hub-method.enum';

@Injectable({
  providedIn: 'root'
})
export class CommunicationHubService {
  private hubConnection: HubConnection;
  private participantsStateUpdate$: BehaviorSubject<ParticipantsStateUpdate>;
  private navigationUpdate$: Subject<NavigationUpdate>;

  constructor(private authService: AuthService) {
    this.participantsStateUpdate$ = new BehaviorSubject<ParticipantsStateUpdate>({ participants: [], areVotesRevealed: false });
    this.navigationUpdate$ = new Subject<NavigationUpdate>();

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
    this.hubConnection.on(CommunicationHubMethod.NavigationUpdate, payload => this.navigationUpdate$.next(payload));
  }

  public isConnected() {
    return this.hubConnection.state === HubConnectionState.Connected;
  }

  public getParticipantsStateUpdate(): Observable<ParticipantsStateUpdate> {
    return this.participantsStateUpdate$.asObservable();
  }

  public getNavigationUpdate(): Observable<NavigationUpdate> {
    return this.navigationUpdate$.asObservable();
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

  public async resetVotes(roomId: string) {
    await this.hubConnection.invoke(CommunicationHubMethod.ResetVotes, roomId);
  }

  public async navigate(roomId: string, phase: 'poker' | 'backlog', storyId?: string) {
    await this.hubConnection.invoke(CommunicationHubMethod.Navigate, roomId, phase, storyId);
  }

  public disconnect() {
    this.hubConnection.stop();
  }
}


