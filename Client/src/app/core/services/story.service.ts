import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommunicationHubService } from 'src/app/core/services/communication-hub.service';
import { StoryStateUpdate, Story } from './../models';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private storyStateUpdate$: Observable<StoryStateUpdate>;

  constructor(private communicationHubService: CommunicationHubService) {
    this.storyStateUpdate$ = this.communicationHubService.getStoryStateUpdate();
  }

  public getStoriesByRoom(roomId: string): Observable<Story[]> {
    return this.storyStateUpdate$.pipe(map(update => update.stories.filter(s => s.roomId === roomId)));
  }

  public async addStory(roomId: string, storyId: string, title: string) {
    await this.communicationHubService.addStory(roomId, storyId, title);
  }

  public async deleteStory(roomId: string, storyId: string) {
    await this.communicationHubService.deleteStory(roomId, storyId);
  }
}
