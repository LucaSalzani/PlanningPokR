import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, HttpError, LogLevel } from '@aspnet/signalr';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from './../../auth/auth.service';
import { ParticipantsStateUpdate, NavigationUpdate, StoryStateUpdate, RoomSettingsUpdate } from './../models';
import { CommunicationHubMethod } from './communication-hub-method.enum';

@Injectable({
  providedIn: 'root'
})
export class CommunicationHubService {
  private hubConnection: HubConnection;
  private participantsStateUpdate$: BehaviorSubject<ParticipantsStateUpdate>;
  private navigationUpdate$: Subject<NavigationUpdate>;
  private storyStateUpdate$: BehaviorSubject<StoryStateUpdate>;
  private roomSettingsUpdate$: BehaviorSubject<RoomSettingsUpdate>;

  constructor(private authService: AuthService) {
    this.participantsStateUpdate$ = new BehaviorSubject<ParticipantsStateUpdate>({ participants: [], areVotesRevealed: false });
    this.navigationUpdate$ = new Subject<NavigationUpdate>();
    this.storyStateUpdate$ = new BehaviorSubject<StoryStateUpdate>({stories: []});
    this.roomSettingsUpdate$ = new BehaviorSubject<RoomSettingsUpdate>({ teamJiraLabel: 'DEFAULT', votingOptions: [] });

    this.hubConnection = this.createHubConnection();
  }

  public async connect() {
    await this.startHubConnectionIfDisconnected();

    this.hubConnection.on(CommunicationHubMethod.ParticipantsStateUpdate, payload => this.participantsStateUpdate$.next(payload));
    this.hubConnection.on(CommunicationHubMethod.NavigationUpdate, payload => this.navigationUpdate$.next(payload));
    this.hubConnection.on(CommunicationHubMethod.StoryStateUpdate, payload => this.storyStateUpdate$.next(payload));
    this.hubConnection.on(CommunicationHubMethod.RoomSettingsUpdate, payload => this.roomSettingsUpdate$.next(payload));
    this.hubConnection.onclose(error => console.log('onclose', error));
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

  public getStoryStateUpdate(): Observable<StoryStateUpdate> {
    return this.storyStateUpdate$.asObservable();
  }

  public getRoomSettingsUpdate(): Observable<RoomSettingsUpdate> {
    return this.roomSettingsUpdate$.asObservable();
  }

  public async enterRoomAsync(roomId: string) {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.EnterRoom, roomId);
  }

  public async leaveRoomAsync() {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.LeaveRoom);
  }

  public async selectValueAsync(value: number, roomId: string) {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.SelectValue, value, roomId);
  }

  public async revealVotes(roomId: string) {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.RevealVotes, roomId);
  }

  public async resetVotes(roomId: string) {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.ResetVotes, roomId);
  }

  public async setAcceptedVote(roomId: string, storyId: string, acceptedVote: number) {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.SetAcceptedVote, roomId, storyId, acceptedVote);
  }

  public async addStory(roomId: string, storyId: string, title: string) {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.AddStory, roomId, storyId, title);
  }

  public async deleteStory(roomId: string, storyId: string) {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.DeleteStory, roomId, storyId);
  }

  public async navigate(roomId: string, phase: 'poker' | 'backlog', storyId?: string) {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.Navigate, roomId, phase, storyId);
  }

  public async claimModerator(roomId: string) {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.ClaimModerator, roomId);
  }

  public async updateRoomSettings(roomId: string, update: RoomSettingsUpdate) {
    await this.startHubConnectionIfDisconnected();
    await this.hubConnection.invoke(CommunicationHubMethod.UpdateRoomSettings, roomId, update);
  }

  public disconnect() {
    this.hubConnection.stop();
  }

  private createHubConnection(): HubConnection {
    return new HubConnectionBuilder()
    .configureLogging(LogLevel.Trace)
    .withUrl(environment.backendBaseUrl + environment.communicationHubPath, {
      accessTokenFactory: () => this.authService.jwt
    }).build();
  }

  private async startHubConnectionIfDisconnected() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    await this.hubConnection
    .start()
    .then(() => console.log('Connection started!'))
    .catch(async (err: Error) => {
      console.log('An error occurred', err);
      if (err instanceof HttpError && err.statusCode === 401) {
        await this.authService.logout();
      }
    });
  }
}


