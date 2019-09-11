import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { StoryService } from './../../core/services';
import { Story } from 'src/app/core/models';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {
  storyList: Story[];
  roomId: string;

  constructor(private storyService: StoryService, private route: ActivatedRoute, private router: Router) {
    this.storyList = [];
  }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomid');
    this.storyList = this.storyService.getStoriesByRoom(this.roomId);
  }

  startVoting(storyId: string) {
    this.router.navigate(['../poker'], { relativeTo: this.route, queryParams: { storyId } }); // TODO: Navigate for all
  }

}
