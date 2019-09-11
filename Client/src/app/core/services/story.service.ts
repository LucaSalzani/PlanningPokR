import { Injectable } from '@angular/core';

import { Story } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  stories: Story[];

  constructor() {
    this.stories = [
      {storyId: 'DIAS-1', title: 'Story 1', roomId: 'anubis', acceptedVote: null},
      {storyId: 'DIAS-2', title: 'Story 2', roomId: 'anubis', acceptedVote: null},
      {storyId: 'DIAS-3', title: 'Story 3', roomId: 'anubis', acceptedVote: null},
      {storyId: 'DIAS-4', title: 'Story 4', roomId: 'horus', acceptedVote: null},
    ];
  }

  public getStoriesByRoom(roomId: string) {
    return this.stories.filter(s => s.roomId === roomId);
  }

  public setAcceptedVote(storyId: string, acceptedVote: number) {
    const updateItem = this.stories.find(s => s.storyId === storyId);
    const index = this.stories.indexOf(updateItem);
    this.stories[index] = {
      ...updateItem,
      acceptedVote,
    };
  }
}
