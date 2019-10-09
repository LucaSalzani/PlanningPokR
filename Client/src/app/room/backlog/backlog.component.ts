import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AddStoryJiraModalComponent } from './add-story-jira-modal';
import { AddStoryManuallyModalComponent } from './add-story-manually-modal';
import { StoryService, CommunicationHubService } from './../../core/services';
import { Story } from 'src/app/core/models';
import { AuthService } from 'src/app/auth';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {
  storyList$: Observable<Story[]>;
  isModerator$: Observable<boolean>;
  userId: string;
  roomId: string;

  constructor(
    private storyService: StoryService,
    private route: ActivatedRoute,
    private communicationHubService: CommunicationHubService,
    private modalService: NgbModal,
    authService: AuthService) {
      this.userId = authService.getUserId();
    }

  ngOnInit() {
    this.isModerator$ = this.communicationHubService.getParticipantsStateUpdate().pipe(
      map(update => {
        const user = update.participants.find(p => p.userId === this.userId);
        return user ? user.isModerator : false;
      }));

    this.roomId = this.route.snapshot.paramMap.get('roomid');
    this.storyList$ = this.storyService.getStoriesByRoom(this.roomId);
  }

  async startVoting(storyId: string) {
    await this.communicationHubService.navigate(this.roomId, 'poker', storyId);
  }

  async deleteStory(storyId: string) {
    await this.storyService.deleteStory(this.roomId, storyId);
  }

  openNewStoryManuallyDialog() {
    const modalRef = this.modalService.open(AddStoryManuallyModalComponent);
    modalRef.result.then(async (result: {newStoryId: string, newStoryTitle: string}) => {
      if (result.newStoryTitle && result.newStoryId) {
        await this.storyService.addStory(this.roomId, result.newStoryId, result.newStoryTitle);
      }
    }, () => {});
  }

  openNewStoryJiraDialog() {
    const modalRef = this.modalService.open(AddStoryJiraModalComponent);
    modalRef.componentInstance.roomId = this.roomId;
    modalRef.result.then(async (result: {newStoryId: string, newStoryTitle: string}) => {
      if (result.newStoryTitle && result.newStoryId) {
        await this.storyService.addStory(this.roomId, result.newStoryId, result.newStoryTitle);
      }
    }, () => {});
  }

}
