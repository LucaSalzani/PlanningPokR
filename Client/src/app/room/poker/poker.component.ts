import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommunicationHubService } from 'src/app/core/services';
import { ParticipantsStateUpdate } from 'src/app/core';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent implements OnInit {
  participantsStateUpdate$: Observable<ParticipantsStateUpdate>;
  isModerator$: Observable<boolean>;
  userId: string;
  storyId: string;

  private roomId: string;

  constructor(
    private communicationHubService: CommunicationHubService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    authService: AuthService) {
      this.participantsStateUpdate$ = this.communicationHubService.getParticipantsStateUpdate();
      this.userId = authService.getUserId();
    }

  ngOnInit(): void {
    this.isModerator$ = this.participantsStateUpdate$.pipe(
      map(update => {
        const user = update.participants.find(p => p.userId === this.userId);
        return user ? user.isModerator : false;
      }));
    this.roomId = this.route.snapshot.paramMap.get('roomid');
    this.storyId = this.route.snapshot.queryParamMap.get('storyId');
  }

  async selectValue(value: number) {
    await this.communicationHubService.selectValueAsync(value, this.roomId);
  }

  async revealVotes() {
    await this.communicationHubService.revealVotes(this.roomId);
  }

  async resetVotes() {
    await this.communicationHubService.resetVotes(this.roomId);
  }

  async acceptVote(acceptedVote: number) {
    await this.communicationHubService.setAcceptedVote(this.roomId, this.storyId, acceptedVote);
    await this.resetVotes();
    await this.communicationHubService.navigate(this.roomId, 'backlog');
  }

  async abortVoting() {
    await this.resetVotes();
    await this.communicationHubService.navigate(this.roomId, 'backlog');
  }

  openModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(async (result: number) => {
      await this.acceptVote(result);
    }, () => {});
  }

  disconnect() { // TODO: Remove
    this.communicationHubService.disconnect();
  }
}
