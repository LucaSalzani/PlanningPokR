import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommunicationHubService } from 'src/app/core/services/communication-hub.service';
import { StoryStateUpdate, Story } from './../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private storyStateUpdate$: Observable<StoryStateUpdate>;

  constructor(private communicationHubService: CommunicationHubService, private httpClient: HttpClient) {
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

  public async setStoryPointsInJira(storyId: string, acceptedVote: number) {
    const body = {
      storyKey: storyId,
      storyPoints: acceptedVote,
    };

    await this.httpClient.post(`${environment.backendBaseUrl}api/jira/storypoints`, body).toPromise();
  }
}
