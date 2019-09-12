import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { CommunicationHubService, StoryService } from 'src/app/core/services';
import { ParticipantsStateUpdate } from 'src/app/core';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent implements OnInit {
  participantsStateUpdate$: Observable<ParticipantsStateUpdate>;
  storyId: string;

  private roomId: string;

  constructor(
    private communicationHubService: CommunicationHubService,
    private route: ActivatedRoute,
    private storyService: StoryService,
    private modalService: NgbModal) {
      this.participantsStateUpdate$ = this.communicationHubService.getParticipantsStateUpdate();
    }

  ngOnInit(): void {
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
    this.storyService.setAcceptedVote(this.storyId, acceptedVote); // TODO: set accepted vote for all clients
    this.resetVotes();
    await this.communicationHubService.navigate(this.roomId, 'backlog');
  }

  openModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(async (result: number) => {
      await this.acceptVote(result);
    }, () => {});
  }
}
