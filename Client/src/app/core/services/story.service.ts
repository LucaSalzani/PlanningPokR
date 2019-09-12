import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommunicationHubService } from 'src/app/core/services/communication-hub.service';
import { StoryStateUpdate } from './../models/story-state-update.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private storyStateUpdate$: Observable<StoryStateUpdate>;

  constructor(private communicationHubService: CommunicationHubService) {
    this.storyStateUpdate$ = this.communicationHubService.getStoryStateUpdate();
  }

  public getStoriesByRoom(roomId: string) {
    return this.storyStateUpdate$.pipe(map(update => update.stories.filter(s => s.roomId === roomId)));
  }
}
