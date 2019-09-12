import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { StoryService, CommunicationHubService } from './../../core/services';
import { Story } from 'src/app/core/models';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {
  storyList$: Observable<Story[]>;
  roomId: string;

  constructor(
    private storyService: StoryService,
    private route: ActivatedRoute,
    private communicationHubService: CommunicationHubService) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomid');
    this.storyList$ = this.storyService.getStoriesByRoom(this.roomId);
  }

  async startVoting(storyId: string) {
    await this.communicationHubService.navigate(this.roomId, 'poker', storyId);
  }

}
