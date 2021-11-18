/* eslint-disable react-hooks/rules-of-hooks */
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { NavigationUpdate } from "../models/navigation-update.model";
import { ParticipantsStateUpdate } from "../models/participants-state-update.model";
import { RoomSettingsUpdate } from "../models/room-settings-update.model";
import { StoryStateUpdate } from "../models/story-state-update.model";
import { authProvider } from "./auth.provider";

const API_URL = 'https://localhost:5101/communicationHub'

enum CommunicationHubMethod {
  EnterRoom = 'enterRoom',
  LeaveRoom = 'leaveRoom',
  SelectValue = 'selectValue',
  RevealVotes = 'revealVotes',
  Navigate = 'navigate',
  ResetVotes = 'resetVotes',
  SetAcceptedVote = 'setAcceptedVote',
  AddStory = 'addStory',
  DeleteStory = 'deleteStory',
  ClaimModerator = 'claimModerator',
  UpdateRoomSettings = 'updateRoomSettings',
  NavigationUpdate = 'navigationUpdate',
  ParticipantsStateUpdate = 'participantsStateUpdate',
  StoryStateUpdate = 'storyStateUpdate',
  RoomSettingsUpdate = 'roomSettingsUpdate'
}

class ConnectionHubService {

  private connection : HubConnection
  private participantsStateUpdate$: BehaviorSubject<ParticipantsStateUpdate>;
  private navigationUpdate$: Subject<NavigationUpdate>;
  private storyStateUpdate$: BehaviorSubject<StoryStateUpdate>;
  private roomSettingsUpdate$: BehaviorSubject<RoomSettingsUpdate>;

  constructor() {
    this.participantsStateUpdate$ = new BehaviorSubject<ParticipantsStateUpdate>({ participants: [], areVotesRevealed: false });
    this.navigationUpdate$ = new Subject<NavigationUpdate>();
    this.storyStateUpdate$ = new BehaviorSubject<StoryStateUpdate>({stories: []});
    this.roomSettingsUpdate$ = new BehaviorSubject<RoomSettingsUpdate>({ teamJiraLabel: 'DEFAULT', votingOptions: [] });

    this.connection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Trace)
    .withUrl(API_URL, {
      accessTokenFactory: () => authProvider.jwt
    })
    .withAutomaticReconnect()
    .build();

    this.connection.on(CommunicationHubMethod.ParticipantsStateUpdate, payload => this.participantsStateUpdate$.next(payload));
    this.connection.on(CommunicationHubMethod.NavigationUpdate, payload => this.navigationUpdate$.next(payload));
    this.connection.on(CommunicationHubMethod.StoryStateUpdate, payload => this.storyStateUpdate$.next(payload));
    this.connection.on(CommunicationHubMethod.RoomSettingsUpdate, payload => this.roomSettingsUpdate$.next(payload));
    this.connection.onclose(error => console.log('onclose', error));
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
    await this.ensureConnection();
    await this.connection.invoke(CommunicationHubMethod.EnterRoom, roomId);
  }

  public async leaveRoomAsync() {
    await this.ensureConnection();
    await this.connection.invoke(CommunicationHubMethod.LeaveRoom);
  }

  public async selectValueAsync(value: number, roomId: string) {
    await this.ensureConnection();
    await this.connection.invoke(CommunicationHubMethod.SelectValue, value, roomId);
  }

  ensureConnection() {
    if (this.connection.state === HubConnectionState.Connected) {
      return;
    }

    if (this.connection.state !== HubConnectionState.Disconnected){
      this.connection.stop().then(() => console.log('stopped'))
    }

    return this.connection
    .start()
    .then(() => {
      console.log('Connection started!')
    })
    .catch((err: any) => {
      if (err.errorType === 'FailedToNegotiateWithServerError') {
        console.log('logging out')
        authProvider.signout(() => {
          window.location.reload()
        })
      }
      console.log('An error occurred', err);
    });
  }
}

export default ConnectionHubService
