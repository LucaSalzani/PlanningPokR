import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommunicationHubService, StoryService } from 'src/app/core/services';
import { Observable } from 'rxjs';
import { ParticipantsStateUpdate } from 'src/app/core';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent implements OnInit {
  acceptedVote: number;
  participantsStateUpdate$: Observable<ParticipantsStateUpdate>;

  private roomId: string;
  private storyId: string;

  constructor(
    private communicationHubService: CommunicationHubService,
    private route: ActivatedRoute,
    private storyService: StoryService) {
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
    this.acceptedVote = 5; // TODO: Get Math.Max() and distribute to clients
    await this.communicationHubService.revealVotes(this.roomId);
  }

  async resetVotes() {
    await this.communicationHubService.resetVotes(this.roomId);
  }

  async acceptVote() {
    this.storyService.setAcceptedVote(this.storyId, this.acceptedVote); // TODO: set accepted vote for all clients
    this.resetVotes();
    await this.communicationHubService.navigate(this.roomId, 'backlog');
  }
}
