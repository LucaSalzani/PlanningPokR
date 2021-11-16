/* eslint-disable react-hooks/rules-of-hooks */
import { HttpError, HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { NavigationUpdate } from "../models/navigation-update.model";
import { ParticipantsStateUpdate } from "../models/participants-state-update.model";
import { RoomSettingsUpdate } from "../models/room-settings-update.model";
import { StoryStateUpdate } from "../models/story-state-update.model";
import useAuth from "./use-auth.hook";

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
      accessTokenFactory: () => useAuth().getJwt()
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

  ensureConnection() {
    if (this.connection.state === HubConnectionState.Connected) {
      return;
    }

    return this.connection
    .start()
    .then(() => {
      console.log('Connection started!')
    })
    .catch(async (err: Error) => {
      console.log('An error occurred', err);
      if (err instanceof HttpError && err.statusCode === 401) {
        useAuth().logout();
      }
    });
  }
}

export default ConnectionHubService
