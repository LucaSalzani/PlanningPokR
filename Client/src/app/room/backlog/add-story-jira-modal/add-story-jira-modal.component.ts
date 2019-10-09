import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-story-jira-modal',
  templateUrl: './add-story-jira-modal.component.html',
  styleUrls: ['./add-story-jira-modal.component.scss']
})
export class AddStoryJiraModalComponent implements OnInit {
  @Input() roomId: string;

  public jiraStories: JiraStoryDto[];

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) {
    this.jiraStories = [];
  }

  ngOnInit() {
    let parameters = new HttpParams();
    parameters = parameters.append('roomId', this.roomId);

    this.http.get<JiraStoryDto[]>(`${environment.backendBaseUrl}api/jira/stories`, { params: parameters, responseType: 'json'})
    .toPromise().then((stories: JiraStoryDto[]) => {
      this.jiraStories = stories;
      console.log('stories', this.jiraStories);
    }); // TODO: Error Handling
  }

  addStory(storyKey: string, storyTitle: string) {
    this.activeModal.close({
      newStoryId: storyKey,
      newStoryTitle: storyTitle
    });
  }

}

export interface JiraStoryDto { // TODO: Extract
  key: string;
  title: string;
}
