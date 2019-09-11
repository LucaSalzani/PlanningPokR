import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommunicationHubService, StoryService } from 'src/app/core/services';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent implements OnInit {
  areVotesRevealed: boolean;
  acceptedVote: number;

  private roomId: string;
  private storyId: string;

  constructor(
    private communicationHubService: CommunicationHubService,
    private route: ActivatedRoute,
    private storyService: StoryService) { }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomid');
    this.storyId = this.route.snapshot.queryParamMap.get('storyId');
    this.areVotesRevealed = false;
  }

  async selectValue(value: number) { // TODO: Set this in service??
    await this.communicationHubService.selectValueAsync(value, this.roomId);
  }

  async revealVotes() {
    this.areVotesRevealed = true;
    this.acceptedVote = 5; // TODO: Get Math.Max()
    await this.communicationHubService.revealVotes(this.roomId);
  }

  resetVotes() {
    console.log('To implement'); // TODO: Implement
  }

  acceptVote() {
    this.storyService.setAcceptedVote(this.storyId, this.acceptedVote);
    console.log('To implement'); // TODO: Navigate back here for all
  }
}
