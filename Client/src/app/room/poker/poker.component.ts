import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { CommunicationHubService } from 'src/app/core/services';
import { ParticipantsStateUpdate, RoomSettingsUpdate, VotingOption } from 'src/app/core';
import { AuthService } from './../../auth/auth.service';
import { StoryService } from './../../core/services/story.service';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent implements OnInit, OnDestroy {
  participantsStateUpdate$: Observable<ParticipantsStateUpdate>;
  roomSettingsUpdate$: Observable<RoomSettingsUpdate>;
  isModerator$: Observable<boolean>;
  areVotesRevealedSubscription: Subscription;
  userId: string;
  storyId: string;
  setStoryPointsToJira: boolean;
  selectedValue: number | null;

  private roomId: string;

  constructor(
    private communicationHubService: CommunicationHubService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private storyService: StoryService,
    authService: AuthService) {
      this.participantsStateUpdate$ = this.communicationHubService.getParticipantsStateUpdate();
      this.roomSettingsUpdate$ = this.communicationHubService.getRoomSettingsUpdate();
      this.userId = authService.getUserId();
      this.setStoryPointsToJira = false;
      this.selectedValue = null;
    }

  ngOnInit(): void {
    this.isModerator$ = this.participantsStateUpdate$.pipe(
      map(update => {
        const user = update.participants.find(p => p.userId === this.userId);
        return user ? user.isModerator : false;
      }));

    this.areVotesRevealedSubscription = this.participantsStateUpdate$.pipe(
      map(update => update.areVotesRevealed))
      .subscribe(areRevealed => {
        if (areRevealed) {
          this.selectedValue = null;
        }
      });

    this.roomId = this.route.snapshot.paramMap.get('roomid');
    this.storyId = this.route.snapshot.queryParamMap.get('storyId');
  }

  async selectValue(value: number) {
    await this.communicationHubService.selectValueAsync(value, this.roomId);
    this.selectedValue = value;
  }

  async revealVotes() {
    await this.communicationHubService.revealVotes(this.roomId);
  }

  async resetVotes() {
    await this.communicationHubService.resetVotes(this.roomId);
  }

  async acceptVote(acceptedVote: number) {
    await this.communicationHubService.setAcceptedVote(this.roomId, this.storyId, acceptedVote);

    if (this.setStoryPointsToJira) {
      await this.storyService.setStoryPointsInJira(this.storyId, acceptedVote); // TODO: Go on if error occurs
    }

    await this.resetVotes();
    await this.communicationHubService.navigate(this.roomId, 'backlog');
  }

  async abortVoting() {
    await this.resetVotes();
    await this.communicationHubService.navigate(this.roomId, 'backlog');
  }

  getVotes() {
    return this.participantsStateUpdate$.pipe(withLatestFrom(update => update.participants), map(list => list.map(p => p.vote)));
  }

  getActiveVotingOptions(): Observable<VotingOption[]> {
    return this.roomSettingsUpdate$.pipe(map(update => update.votingOptions.filter(option => option.isActive)));
  }

  openModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(async (result: number) => {
      await this.acceptVote(result);
    }, () => {});
  }

  disconnect() {
    this.communicationHubService.disconnect();
  }

  ngOnDestroy() {
    this.areVotesRevealedSubscription.unsubscribe();
  }
}
